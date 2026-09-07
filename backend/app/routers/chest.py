from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import User, ChestReward, UserChestClaim, XpLog, UserSkillProgress
from app.schemas import ClaimChestResponse, UserSummary
from app.services.gamification import get_today_xp
from app.auth import get_current_user

router = APIRouter(prefix="/api/chests", tags=["Chests"])

@router.post("/{chest_id}/claim", response_model=ClaimChestResponse)
def claim_chest(chest_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chest = db.query(ChestReward).filter(ChestReward.id == chest_id).first()
    if not chest:
        raise HTTPException(status_code=404, detail="Chest not found")

    existing_claim = db.query(UserChestClaim).filter(
        UserChestClaim.user_id == current_user.id,
        UserChestClaim.chest_id == chest_id
    ).first()

    if existing_claim:
        raise HTTPException(status_code=400, detail="Chest already opened!")

    # Verify if chest is unlocked based on section/unit and skill progression
    unit = chest.unit
    if not unit:
        raise HTTPException(status_code=400, detail="Chest does not belong to a valid unit")

    course = unit.course
    progress_records = db.query(UserSkillProgress).filter(
        UserSkillProgress.user_id == current_user.id
    ).all()
    progress_map = {p.skill_id: p for p in progress_records}

    # Check if all previous units in course are completed
    prev_units_completed = True
    if course:
        for u in course.units:
            if u.order_index < unit.order_index:
                for s in u.skills:
                    prog = progress_map.get(s.id)
                    if not prog or prog.status != "completed":
                        prev_units_completed = False
                        break
            if not prev_units_completed:
                break

    if not prev_units_completed:
        raise HTTPException(status_code=400, detail="This chest is in a locked section! Complete previous sections first.")

    # Check preceding skills in this unit
    preceding_skills = [s for s in unit.skills if s.order_index <= chest.order_index]
    if preceding_skills:
        for s in preceding_skills:
            prog = progress_map.get(s.id)
            if not prog or prog.status != "completed":
                raise HTTPException(status_code=400, detail="This chest is locked! Complete preceding lessons first.")

    new_claim = UserChestClaim(user_id=current_user.id, chest_id=chest.id)
    db.add(new_claim)

    current_user.gems += chest.reward_gems
    current_user.xp_total += chest.reward_xp
    db.add(XpLog(user_id=current_user.id, amount=chest.reward_xp, source=f"chest_{chest.id}_reward"))
    db.commit()
    db.refresh(current_user)

    today_xp = get_today_xp(current_user.id, db)
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
        active_course_id=current_user.active_course_id
    )

    return ClaimChestResponse(
        success=True,
        reward_gems=chest.reward_gems,
        reward_xp=chest.reward_xp,
        user_summary=user_sum
    )
