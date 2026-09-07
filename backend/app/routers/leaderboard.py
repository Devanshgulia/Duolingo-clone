from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models import User
from app.schemas import LeaderboardEntry

from app.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Leaderboard"])

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    users = db.query(User).order_by(User.xp_total.desc()).limit(15).all()
    
    leaderboard = []
    for rank, u in enumerate(users, start=1):
        leaderboard.append(
            LeaderboardEntry(
                user_id=u.id,
                username=u.username,
                display_name=u.display_name,
                avatar_url=u.avatar_url,
                xp_total=u.xp_total,
                league=u.league or "Bronze",
                rank=rank,
                is_current_user=(current_user is not None and u.id == current_user.id)
            )
        )
    return leaderboard
