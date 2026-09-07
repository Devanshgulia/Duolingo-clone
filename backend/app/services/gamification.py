from datetime import date, datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import (
    User, UserSkillProgress, Skill, Lesson, LessonAttempt, XpLog,
    Quest, UserQuestProgress, Achievement, UserAchievement, Unit
)

def utc_now():
    return datetime.now(timezone.utc)

def calculate_streak(user: User, activity_date: date = None) -> tuple[int, bool]:
    """
    Calculates updated streak for user based on activity date.
    Returns (new_streak_count, streak_incremented)
    """
    if activity_date is None:
        activity_date = date.today()

    if user.last_activity_date == activity_date:
        # Already did activity today
        return user.streak_count, False

    if user.last_activity_date == activity_date - timedelta(days=1):
        # Activity yesterday -> increment streak!
        new_streak = user.streak_count + 1
        user.streak_count = new_streak
        user.last_activity_date = activity_date
        return new_streak, True
    
    if user.last_activity_date is None:
        user.streak_count = 1
        user.last_activity_date = activity_date
        return 1, True

    if user.last_activity_date < activity_date - timedelta(days=1):
        # Missed a day. Check if streak freeze is available
        if getattr(user, 'streak_freeze_count', None) is not None and user.streak_freeze_count > 0:
            user.streak_freeze_count -= 1
            # Streak preserved!
            new_streak = user.streak_count + 1
            user.streak_count = new_streak
            user.last_activity_date = activity_date
            return new_streak, True
        else:
            user.streak_count = 1
            user.last_activity_date = activity_date
            return 1, True

    return user.streak_count, False


def sync_user_streak(user: User, db: Session) -> User:
    """
    Validates user's streak against current real date (date.today()).
    If user missed a day, checks streak freezes or resets streak to 0.
    """
    today = date.today()
    if user.last_activity_date is None:
        if user.streak_count != 0:
            user.streak_count = 0
            db.commit()
            db.refresh(user)
        return user

    if user.last_activity_date == today or user.last_activity_date == today - timedelta(days=1):
        # Streak is active (practiced today or practiced yesterday, today pending)
        return user

    # User missed more than 1 day
    missed_days = (today - user.last_activity_date).days - 1
    freezes_available = getattr(user, 'streak_freeze_count', 0) or 0
    if freezes_available >= missed_days and user.streak_count > 0:
        user.streak_freeze_count -= missed_days
        user.last_activity_date = today - timedelta(days=1)
        db.commit()
        db.refresh(user)
    else:
        user.streak_count = 0
        db.commit()
        db.refresh(user)

    return user


def get_user_active_dates(user_id: int, db: Session, days: int = 90) -> list[str]:
    """Returns sorted list of ISO date strings (YYYY-MM-DD) on which user earned XP or was active."""
    since_date = date.today() - timedelta(days=days)
    since_datetime = datetime.combine(since_date, datetime.min.time())

    logs = db.query(func.date(XpLog.created_at)).filter(
        XpLog.user_id == user_id,
        XpLog.created_at >= since_datetime
    ).distinct().all()

    dates_set = {str(row[0]) for row in logs if row[0]}

    user = db.query(User).filter(User.id == user_id).first()
    if user and user.last_activity_date:
        dates_set.add(str(user.last_activity_date))

    return sorted(list(dates_set))


def get_today_xp(user_id: int, db: Session) -> int:
    """Returns the total XP earned by user today."""
    today_start = datetime.combine(date.today(), datetime.min.time())
    result = db.query(func.sum(XpLog.amount)).filter(
        XpLog.user_id == user_id,
        XpLog.created_at >= today_start
    ).scalar()
    return result or 0


def deduct_heart(user: User, db: Session) -> int:
    """Decrements user hearts by 1 down to 0 unless Super Duolingo. Returns remaining hearts."""
    if user.is_super:
        return user.hearts # Unlimited hearts for Super Duolingo!

    if user.hearts > 0:
        user.hearts -= 1
        db.commit()
        db.refresh(user)
    return user.hearts


def refill_hearts(user: User, db: Session, cost_gems: int = 100) -> tuple[bool, str]:
    """Refills user hearts to max_hearts using gems or practice."""
    if user.hearts >= user.max_hearts:
        return False, "Hearts are already full!"
    
    if user.gems >= cost_gems:
        user.gems -= cost_gems
        user.hearts = user.max_hearts
        db.commit()
        db.refresh(user)
        return True, "Hearts refilled successfully!"
    else:
        # Free practice refill fallback
        user.hearts = user.max_hearts
        db.commit()
        db.refresh(user)
        return True, "Hearts refilled via practice session!"


def update_progress_on_lesson_complete(user_id: int, lesson_id: int, db: Session) -> dict:
    """
    Updates XP, XpLog, streak, completed_lessons_count, crowns, quests, achievements, and unlocks the next skill.
    """
    user = db.query(User).filter(User.id == user_id).first()
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not user or not lesson:
        raise ValueError("User or Lesson not found")

    # 1. Award XP (Double XP if active)
    base_xp = lesson.xp_reward
    xp_earned = base_xp * 2 if user.double_xp_active else base_xp
    user.xp_total += xp_earned
    xp_log = XpLog(user_id=user.id, amount=xp_earned, source=f"lesson_{lesson.id}_completion")
    db.add(xp_log)

    # 2. Update Streak
    new_streak, streak_incremented = calculate_streak(user, date.today())

    # 3. Update Skill Progress
    skill_id = lesson.skill_id
    progress = db.query(UserSkillProgress).filter(
        UserSkillProgress.user_id == user_id,
        UserSkillProgress.skill_id == skill_id
    ).first()

    if not progress:
        progress = UserSkillProgress(user_id=user_id, skill_id=skill_id, status="available", completed_lessons_count=0)
        db.add(progress)

    progress.completed_lessons_count += 1
    
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    crowns_awarded = 0
    next_skill_unlocked = False

    if skill and progress.completed_lessons_count >= skill.total_lessons:
        if progress.status != "completed":
            progress.status = "completed"
            progress.crowns += 1
            crowns_awarded = 1
            
            # Unlock next skill in order
            next_skill = db.query(Skill).filter(
                Skill.unit_id == skill.unit_id,
                Skill.order_index > skill.order_index
            ).order_by(Skill.order_index.asc()).first()

            if next_skill:
                next_progress = db.query(UserSkillProgress).filter(
                    UserSkillProgress.user_id == user_id,
                    UserSkillProgress.skill_id == next_skill.id
                ).first()
                if not next_progress:
                    next_progress = UserSkillProgress(
                        user_id=user_id,
                        skill_id=next_skill.id,
                        status="available",
                        completed_lessons_count=0
                    )
                    db.add(next_progress)
                elif next_progress.status == "locked":
                    next_progress.status = "available"
                next_skill_unlocked = True
            else:
                # End of unit reached! Unlock first skill of the next unit
                current_unit = db.query(Unit).filter(Unit.id == skill.unit_id).first()
                if current_unit:
                    next_unit = db.query(Unit).filter(
                        Unit.course_id == current_unit.course_id,
                        Unit.order_index > current_unit.order_index
                    ).order_by(Unit.order_index.asc()).first()
                    if next_unit and next_unit.skills:
                        first_skill_next_unit = sorted(next_unit.skills, key=lambda s: s.order_index)[0]
                        next_progress = db.query(UserSkillProgress).filter(
                            UserSkillProgress.user_id == user_id,
                            UserSkillProgress.skill_id == first_skill_next_unit.id
                        ).first()
                        if not next_progress:
                            next_progress = UserSkillProgress(
                                user_id=user_id,
                                skill_id=first_skill_next_unit.id,
                                status="available",
                                completed_lessons_count=0
                            )
                            db.add(next_progress)
                        elif next_progress.status == "locked":
                            next_progress.status = "available"
                        next_skill_unlocked = True

    # 4. Advance Quests Progress
    updated_quests = []
    user_quests = db.query(UserQuestProgress).filter(UserQuestProgress.user_id == user.id).all()
    for uq in user_quests:
        quest = uq.quest
        if not uq.is_completed:
            if quest.quest_type == "earn_xp":
                uq.current_amount += xp_earned
            elif quest.quest_type == "complete_lessons":
                uq.current_amount += 1
            elif quest.quest_type == "perfect_lesson":
                uq.current_amount += 1

            if uq.current_amount >= quest.target_amount:
                uq.is_completed = True
            
            updated_quests.append({
                "quest_id": quest.id,
                "title": quest.title,
                "current": uq.current_amount,
                "target": quest.target_amount,
                "is_completed": uq.is_completed
            })

    # 5. Advance Achievements
    user_achs = db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    for ua in user_achs:
        code = ua.achievement.code
        if code == "wildfire":
            ua.current_progress = user.streak_count
        elif code == "sage":
            ua.current_progress = user.xp_total
        elif code == "scholar":
            ua.current_progress = db.query(func.sum(UserSkillProgress.crowns)).filter(UserSkillProgress.user_id == user.id).scalar() or 0

    db.commit()
    db.refresh(user)

    return {
        "xp_earned": xp_earned,
        "total_xp": user.xp_total,
        "streak_count": user.streak_count,
        "streak_incremented": streak_incremented,
        "crowns_awarded": crowns_awarded,
        "next_skill_unlocked": next_skill_unlocked,
        "hearts_remaining": user.hearts,
        "quests_updated": updated_quests
    }
