from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.db import get_db
from app.models import User, Lesson, Exercise, LessonAttempt, UserSkillProgress
from app.schemas import (
    LessonDetailOut, ExerciseOut, StartLessonResponse,
    AnswerSubmission, AnswerResult, CompleteLessonRequest, CompleteLessonResult
)
from app.services.validation import evaluate_exercise_answer
from app.services.gamification import deduct_heart, update_progress_on_lesson_complete
from app.auth import get_current_user

router = APIRouter(prefix="/api/lessons", tags=["Lessons"])


@router.get("/{lesson_id}", response_model=LessonDetailOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    import json as _json
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    exercises_out = []
    for e in lesson.exercises:
        options = e.options_json
        # For match_pairs, inject the correct pairs map into options_json
        # so the frontend can validate matches locally.
        # This is NOT a security concern — all words are already visible.
        if e.type == "match_pairs" and e.correct_answer:
            try:
                existing = _json.loads(options) if options else {}
                pairs = _json.loads(e.correct_answer) if isinstance(e.correct_answer, str) else e.correct_answer
                existing["pairs"] = pairs
                options = _json.dumps(existing)
            except Exception:
                pass

        exercises_out.append(ExerciseOut(
            id=e.id,
            lesson_id=e.lesson_id,
            type=e.type,
            prompt=e.prompt,
            options_json=options,
            order_index=e.order_index
        ))

    return LessonDetailOut(
        id=lesson.id,
        skill_id=lesson.skill_id,
        skill_title=lesson.skill.title if lesson.skill else "Skill",
        title=lesson.title,
        xp_reward=lesson.xp_reward,
        exercises=exercises_out
    )


@router.post("/{lesson_id}/start", response_model=StartLessonResponse)
def start_lesson(lesson_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    if current_user.hearts <= 0:
        raise HTTPException(status_code=400, detail="Out of hearts! Refill hearts to start a lesson.")

    attempt = LessonAttempt(
        user_id=current_user.id,
        lesson_id=lesson.id,
        status="in_progress",
        hearts_lost=0
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    lesson_detail = get_lesson(lesson_id, db)

    return StartLessonResponse(
        attempt_id=attempt.id,
        lesson=lesson_detail,
        hearts_remaining=current_user.hearts
    )


@router.post("/{lesson_id}/answer", response_model=AnswerResult)
def submit_exercise_answer(
    lesson_id: int,
    submission: AnswerSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exercise = db.query(Exercise).filter(Exercise.id == submission.exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    attempt = db.query(LessonAttempt).filter(LessonAttempt.id == submission.attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Lesson attempt not found")

    is_correct, correct_answer_str = evaluate_exercise_answer(
        exercise_type=exercise.type,
        correct_answer_raw=exercise.correct_answer,
        user_answer=submission.user_answer
    )

    out_of_hearts = False
    hearts_remaining = current_user.hearts

    if not is_correct:
        attempt.hearts_lost += 1
        hearts_remaining = deduct_heart(current_user, db)
        if hearts_remaining <= 0:
            out_of_hearts = True
            attempt.status = "failed"
            db.commit()

    return AnswerResult(
        is_correct=is_correct,
        correct_answer=correct_answer_str,
        explanation="Great job!" if is_correct else f"Correct answer: {correct_answer_str}",
        hearts_remaining=hearts_remaining,
        out_of_hearts=out_of_hearts
    )


@router.post("/{lesson_id}/complete", response_model=CompleteLessonResult)
def complete_lesson(
    lesson_id: int,
    req: CompleteLessonRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attempt = db.query(LessonAttempt).filter(LessonAttempt.id == req.attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Lesson attempt not found")

    attempt.status = "completed"
    attempt.completed_at = datetime.utcnow()

    res = update_progress_on_lesson_complete(
        user_id=current_user.id,
        lesson_id=lesson_id,
        db=db
    )

    attempt.xp_earned = res["xp_earned"]
    db.commit()

    return CompleteLessonResult(
        xp_earned=res["xp_earned"],
        total_xp=res["total_xp"],
        streak_count=res["streak_count"],
        streak_incremented=res["streak_incremented"],
        crowns_awarded=res["crowns_awarded"],
        next_skill_unlocked=res["next_skill_unlocked"],
        hearts_remaining=res["hearts_remaining"]
    )
