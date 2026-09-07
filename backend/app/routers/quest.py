from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models import User, Quest, UserQuestProgress, XpLog
from app.schemas import QuestOut, ClaimQuestResponse, UserSummary
from app.services.gamification import get_today_xp
from app.auth import get_current_user

router = APIRouter(prefix="/api/quests", tags=["Quests"])

@router.get("", response_model=List[QuestOut])
def get_user_quests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    all_quests = db.query(Quest).all()
    user_progress_map = {
        uq.quest_id: uq for uq in db.query(UserQuestProgress).filter(UserQuestProgress.user_id == current_user.id).all()
    }

    quests_out = []
    for q in all_quests:
        uq = user_progress_map.get(q.id)
        current_amount = uq.current_amount if uq else 0
        is_completed = uq.is_completed if uq else False
        is_claimed = uq.is_claimed if uq else False

        quests_out.append(QuestOut(
            id=q.id,
            title=q.title,
            description=q.description,
            quest_type=q.quest_type,
            target_amount=q.target_amount,
            reward_gems=q.reward_gems,
            reward_xp=q.reward_xp,
            icon=q.icon,
            current_amount=current_amount,
            is_completed=is_completed,
            is_claimed=is_claimed
        ))

    return quests_out

@router.post("/{quest_id}/claim", response_model=ClaimQuestResponse)
def claim_quest_reward(quest_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")

    uq = db.query(UserQuestProgress).filter(
        UserQuestProgress.user_id == current_user.id,
        UserQuestProgress.quest_id == quest_id
    ).first()

    if not uq or not uq.is_completed:
        raise HTTPException(status_code=400, detail="Quest is not completed yet!")

    if uq.is_claimed:
        raise HTTPException(status_code=400, detail="Quest reward already claimed!")

    uq.is_claimed = True
    current_user.gems += quest.reward_gems
    current_user.xp_total += quest.reward_xp
    db.add(XpLog(user_id=current_user.id, amount=quest.reward_xp, source=f"quest_{quest.id}_reward"))
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

    return ClaimQuestResponse(
        success=True,
        reward_gems=quest.reward_gems,
        reward_xp=quest.reward_xp,
        user_summary=user_sum
    )
