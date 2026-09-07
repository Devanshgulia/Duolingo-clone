from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import User, Exercise, LessonAttempt
from app.schemas import StartLessonResponse, LessonDetailOut, ExerciseOut, CompleteLessonResult, CompleteLessonRequest
from app.services.gamification import calculate_streak, get_today_xp
from app.auth import get_current_user

router = APIRouter(prefix="/api/practice", tags=["Practice"])

@router.post("/start", response_model=StartLessonResponse)
def start_practice_lesson(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Pick a random sample of 4 exercises from available lessons
    exercises = db.query(Exercise).limit(4).all()
    if not exercises:
        raise HTTPException(status_code=404, detail="No exercises available for practice")

    attempt = LessonAttempt(
        user_id=current_user.id,
        lesson_id=exercises[0].lesson_id,
        status="in_progress",
        hearts_lost=0
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    exercises_out = [
        ExerciseOut(
            id=e.id,
            lesson_id=e.lesson_id,
            type=e.type,
            prompt=e.prompt,
            options_json=e.options_json,
            order_index=e.order_index,
            hint=e.hint
        )
        for e in exercises
    ]

    lesson_detail = LessonDetailOut(
        id=9999,
        skill_id=1,
        skill_title="Practice Session",
        title="Heart Recovery Practice",
        xp_reward=10,
        exercises=exercises_out
    )

    return StartLessonResponse(
        attempt_id=attempt.id,
        lesson=lesson_detail,
        hearts_remaining=current_user.hearts
    )

@router.post("/complete", response_model=CompleteLessonResult)
def complete_practice_lesson(req: CompleteLessonRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    attempt = db.query(LessonAttempt).filter(LessonAttempt.id == req.attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Practice attempt not found")

    attempt.status = "completed"
    
    # Practice restores +1 heart (up to max_hearts)
    if current_user.hearts < current_user.max_hearts:
        current_user.hearts += 1

    xp_earned = 10
    current_user.xp_total += xp_earned
    new_streak, streak_incremented = calculate_streak(current_user)

    db.commit()
    db.refresh(current_user)

    return CompleteLessonResult(
        xp_earned=xp_earned,
        total_xp=current_user.xp_total,
        streak_count=current_user.streak_count,
        streak_incremented=streak_incremented,
        crowns_awarded=0,
        next_skill_unlocked=False,
        hearts_remaining=current_user.hearts
    )
