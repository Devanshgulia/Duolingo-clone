import pytest
from datetime import date, timedelta
from app.models import User
from app.services.gamification import calculate_streak
from app.services.validation import evaluate_exercise_answer

def test_streak_calculation():
    user = User(username="test", display_name="Test", xp_total=0, streak_count=5)
    
    # 1. Activity today after yesterday -> streak increments
    user.last_activity_date = date.today() - timedelta(days=1)
    new_streak, inc = calculate_streak(user, date.today())
    assert new_streak == 6
    assert inc is True

    # 2. Activity again today -> streak unchanged
    new_streak, inc = calculate_streak(user, date.today())
    assert new_streak == 6
    assert inc is False

    # 3. Missed a day (last active 2 days ago) -> streak resets to 1
    user.last_activity_date = date.today() - timedelta(days=2)
    user.streak_count = 6
    new_streak, inc = calculate_streak(user, date.today())
    assert new_streak == 1
    assert inc is True


def test_exercise_answer_evaluations():
    # Multiple choice
    ok, ans = evaluate_exercise_answer("multiple_choice", "el niño", "El Niño")
    assert ok is True

    # Translate
    ok, ans = evaluate_exercise_answer("translate", "El niño come pan", ["El", "niño", "come", "pan."])
    assert ok is True

    # Fill in blank
    ok, ans = evaluate_exercise_answer("fill_blank", "La", "la")
    assert ok is True

    # Type answer
    ok, ans = evaluate_exercise_answer("type_answer", "Buenos días", "buenos dias!")
    assert ok is True
