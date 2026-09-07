from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import User, Course, Unit, Skill, Lesson, UserSkillProgress, ChestReward, UserChestClaim
from app.schemas import PathOut, UnitOut, SkillNodeOut, LessonOverview, UserSummary, CourseOverview, ChestRewardOut
from app.services.gamification import get_today_xp, sync_user_streak, get_user_active_dates
from app.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Path"])

@router.get("/path", response_model=PathOut)
def get_learning_path(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    courses = db.query(Course).all()
    if not courses:
        raise HTTPException(status_code=404, detail="No courses found")

    active_course = None
    if current_user.active_course_id:
        active_course = next((c for c in courses if c.id == current_user.active_course_id), None)
    
    if not active_course:
        active_course = courses[0]
        current_user.active_course_id = active_course.id
        db.commit()

    # Get user progress map: skill_id -> UserSkillProgress
    progress_records = db.query(UserSkillProgress).filter(
        UserSkillProgress.user_id == current_user.id
    ).all()
    progress_map = {p.skill_id: p for p in progress_records}

    # Get claimed chests map
    claimed_chests = {
        c.chest_id for c in db.query(UserChestClaim).filter(UserChestClaim.user_id == current_user.id).all()
    }

    units_out = []
    prev_units_completed = True
    for u_idx, unit in enumerate(active_course.units):
        skills_out = []
        unit_completed = True

        for s_idx, skill in enumerate(unit.skills):
            prog = progress_map.get(skill.id)
            if prog:
                status = prog.status
                crowns = prog.crowns
                completed_lessons = prog.completed_lessons_count
            else:
                if u_idx == 0 and s_idx == 0:
                    status = "available"
                else:
                    status = "locked"
                crowns = 0
                completed_lessons = 0

            if status != "completed":
                unit_completed = False

            lessons_out = [
                LessonOverview(
                    id=l.id,
                    title=l.title,
                    order_index=l.order_index,
                    xp_reward=l.xp_reward,
                    is_completed=(completed_lessons >= l.order_index)
                )
                for l in skill.lessons
            ]

            skills_out.append(
                SkillNodeOut(
                    id=skill.id,
                    unit_id=unit.id,
                    title=skill.title,
                    icon=skill.icon,
                    order_index=skill.order_index,
                    total_lessons=skill.total_lessons,
                    status=status,
                    crowns=crowns,
                    completed_lessons_count=completed_lessons,
                    lessons=lessons_out
                )
            )

        # Process chest rewards in unit
        chests_out = []
        for chest in unit.chests:
            is_claimed = chest.id in claimed_chests
            # Chest is unlocked if previous units are completed and preceding skills in this unit are completed
            is_unlocked = False
            if prev_units_completed:
                preceding_skills = [s for s in unit.skills if s.order_index <= chest.order_index]
                if not preceding_skills:
                    is_unlocked = True
                else:
                    is_unlocked = all(
                        progress_map.get(s.id) and progress_map.get(s.id).status == "completed"
                        for s in preceding_skills
                    )

            chests_out.append(
                ChestRewardOut(
                    id=chest.id,
                    unit_id=unit.id,
                    order_index=chest.order_index,
                    reward_gems=chest.reward_gems,
                    reward_xp=chest.reward_xp,
                    is_unlocked=is_unlocked,
                    is_claimed=is_claimed
                )
            )

        prev_units_completed = prev_units_completed and unit_completed

        units_out.append(
            UnitOut(
                id=unit.id,
                title=unit.title,
                description=unit.description,
                order_index=unit.order_index,
                color_theme=unit.color_theme or "green",
                has_guidebook=bool(unit.guidebook),
                skills=skills_out,
                chests=chests_out
            )
        )

    current_user = sync_user_streak(current_user, db)
    today_xp = get_today_xp(current_user.id, db)
    active_dates = get_user_active_dates(current_user.id, db)

    user_sum = UserSummary(
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

    available_courses_out = [
        CourseOverview(
            id=c.id,
            title=c.title,
            language_code=c.language_code,
            icon_code=c.icon_code
        )
        for c in courses
    ]

    return PathOut(
        course_id=active_course.id,
        course_title=active_course.title,
        language_code=active_course.language_code,
        units=units_out,
        user_summary=user_sum,
        available_courses=available_courses_out
    )
