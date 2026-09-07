import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.db import get_db
from app.models import User, UserSkillProgress, LessonAttempt, Skill, Course, Achievement, UserAchievement, XpLog
from app.schemas import UserSummary, UserProfileStats, RefillHeartsResponse, CourseSwitchRequest, UpdateGoalRequest
from app.services.gamification import refill_hearts, get_today_xp, sync_user_streak, get_user_active_dates
from app.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/user", tags=["User"])


@router.get("/summary", response_model=UserSummary)
def get_user_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_user = sync_user_streak(current_user, db)
    today_xp = get_today_xp(current_user.id, db)
    active_dates = get_user_active_dates(current_user.id, db)

    return UserSummary(
        id=current_user.id,
        username=current_user.username,
        display_name=current_user.display_name,
        avatar_url=current_user.avatar_url,
        xp_total=current_user.xp_total,
        streak_count=current_user.streak_count,
        hearts=current_user.hearts,
        max_hearts=current_user.max_hearts,
        gems=current_user.gems,
        daily_goal_xp=current_user.daily_goal_xp,
        today_xp=today_xp,
        streak_freeze_count=current_user.streak_freeze_count,
        double_xp_active=current_user.double_xp_active,
        is_super=current_user.is_super,
        league=current_user.league or "Bronze",
        outfit=current_user.outfit or "classic",
        last_activity_date=current_user.last_activity_date,
        active_course_id=current_user.active_course_id,
        active_dates=active_dates
    )

@router.put("/goal", response_model=UserSummary)
def update_daily_goal(req: UpdateGoalRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if req.daily_goal_xp < 5 or req.daily_goal_xp > 500:
        raise HTTPException(status_code=400, detail="Daily goal must be between 5 and 500 XP")
    current_user.daily_goal_xp = req.daily_goal_xp
    db.commit()
    db.refresh(current_user)
    return get_user_summary(db=db, current_user=current_user)


@router.post("/streak/increment", response_model=UserSummary)
def increment_user_streak(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    today = date.today()
    if current_user.last_activity_date == today:
        # Already practiced today
        pass
    elif current_user.last_activity_date == today - timedelta(days=1):
        current_user.streak_count += 1
        current_user.last_activity_date = today
    else:
        current_user.streak_count = 1
        current_user.last_activity_date = today

    today_start = datetime.combine(today, datetime.min.time())
    existing_xp = db.query(XpLog).filter(XpLog.user_id == current_user.id, XpLog.created_at >= today_start).first()
    if not existing_xp:
        db.add(XpLog(user_id=current_user.id, amount=1, source="streak_ignite"))
        current_user.xp_total += 1

    db.commit()
    db.refresh(current_user)
    return get_user_summary(db=db, current_user=current_user)


@router.put("/course", response_model=UserSummary)
def switch_course(req: CourseSwitchRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = db.query(Course).filter(Course.id == req.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    current_user.active_course_id = course.id
    db.commit()
    return get_user_summary(db=db, current_user=current_user)


@router.get("/profile", response_model=UserProfileStats)
def get_user_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    skills_completed = db.query(UserSkillProgress).filter(
        UserSkillProgress.user_id == current_user.id,
        UserSkillProgress.status == "completed"
    ).count()

    total_lessons_completed = db.query(LessonAttempt).filter(
        LessonAttempt.user_id == current_user.id,
        LessonAttempt.status == "completed"
    ).count()

    # Load dynamic achievements
    achievements_out = []
    all_achs = db.query(Achievement).all()
    user_ach_map = {
        ua.achievement_id: ua for ua in db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()
    }

    for ach in all_achs:
        ua = user_ach_map.get(ach.id)
        current_progress = ua.current_progress if ua else 0
        current_level = ua.current_level if ua else 0
        
        tiers = []
        if ach.tiers_json:
            try:
                tiers = json.loads(ach.tiers_json)
            except Exception:
                tiers = []

        target = tiers[min(current_level, len(tiers) - 1)]["target"] if tiers else 100
        unlocked = current_progress >= target or current_level > 0

        achievements_out.append({
            "id": ach.code,
            "title": ach.title,
            "description": ach.description,
            "icon": ach.icon,
            "current_progress": current_progress,
            "target": target,
            "current_level": current_level,
            "max_level": ach.max_level,
            "unlocked": unlocked
        })

    return UserProfileStats(
        id=current_user.id,
        username=current_user.username,
        display_name=current_user.display_name,
        avatar_url=current_user.avatar_url,
        xp_total=current_user.xp_total,
        streak_count=current_user.streak_count,
        hearts=current_user.hearts,
        gems=current_user.gems,
        league=current_user.league or "Bronze",
        is_super=current_user.is_super,
        outfit=current_user.outfit or "classic",
        skills_completed=skills_completed,
        total_lessons_completed=total_lessons_completed,
        achievements=achievements_out
    )


@router.post("/hearts/refill", response_model=RefillHeartsResponse)
def refill_user_hearts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    success, message = refill_hearts(current_user, db, cost_gems=100)
    return RefillHeartsResponse(
        success=success,
        hearts=current_user.hearts,
        gems=current_user.gems,
        message=message
    )


@router.post("/dev/simulate-day")
def simulate_day_pass(days: int = 1, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Developer helper: shift last_activity_date backwards to test streak retention or streak breaking."""
    if current_user.last_activity_date:
        current_user.last_activity_date -= timedelta(days=days)
        db.commit()
        db.refresh(current_user)
    return {
        "message": f"Simulated passing of {days} day(s)",
        "new_last_activity_date": str(current_user.last_activity_date),
        "streak_count": current_user.streak_count,
        "streak_freeze_count": current_user.streak_freeze_count
    }
