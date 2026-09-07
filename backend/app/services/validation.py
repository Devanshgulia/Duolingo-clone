import json
import re
import unicodedata
from typing import Any

def normalize_text(text: str) -> str:
    """
    Normalizes text by lowercasing, removing accents/diacritics, stripping whitespace and punctuation.
    Example: 'Buenos días!' -> 'buenos dias'
    """
    if not isinstance(text, str):
        return ""
    text = text.lower().strip()
    # Normalize unicode to strip accents (e.g., 'í' -> 'i')
    text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('utf-8')
    # Remove common punctuation: .,!?;:¡¿"'
    text = re.sub(r'[.,!?;:¡¿"\'\s]+', ' ', text).strip()
    return text


def evaluate_exercise_answer(exercise_type: str, correct_answer_raw: str, user_answer: Any) -> tuple[bool, str]:
    """
    Evaluates user_answer against correct_answer_raw based on exercise_type.
    Returns (is_correct, formatted_correct_answer).
    """
    if exercise_type == "multiple_choice":
        formatted_correct = correct_answer_raw
        if isinstance(user_answer, str):
            is_correct = normalize_text(user_answer) == normalize_text(correct_answer_raw)
        else:
            is_correct = False
        return is_correct, formatted_correct

    elif exercise_type == "translate":
        formatted_correct = correct_answer_raw
        if isinstance(user_answer, list):
            user_str = " ".join(user_answer)
        else:
            user_str = str(user_answer or "")
        
        is_correct = normalize_text(user_str) == normalize_text(correct_answer_raw)
        return is_correct, formatted_correct

    elif exercise_type == "fill_blank":
        formatted_correct = correct_answer_raw
        user_str = str(user_answer or "")
        is_correct = normalize_text(user_str) == normalize_text(correct_answer_raw)
        return is_correct, formatted_correct

    elif exercise_type == "type_answer":
        formatted_correct = correct_answer_raw
        user_str = str(user_answer or "")
        is_correct = normalize_text(user_str) == normalize_text(correct_answer_raw)
        return is_correct, formatted_correct

    elif exercise_type == "match_pairs":
        try:
            expected_pairs = json.loads(correct_answer_raw) if isinstance(correct_answer_raw, str) else correct_answer_raw
        except Exception:
            expected_pairs = {}
        
        formatted_correct = "Match all pairs correctly"
        
        if isinstance(user_answer, dict):
            user_pairs = user_answer
        elif isinstance(user_answer, list):
            user_pairs = {pair[0]: pair[1] for pair in user_answer if len(pair) == 2}
        else:
            user_pairs = {}

        if not expected_pairs:
            return True, formatted_correct

        # Normalize expected pairs
        expected_norm = {normalize_text(str(k)): normalize_text(str(v)) for k, v in expected_pairs.items()}
        user_norm = {normalize_text(str(k)): normalize_text(str(v)) for k, v in user_pairs.items()}

        is_correct = True
        for key, val in expected_norm.items():
            # Check direct match or reversed match
            if user_norm.get(key) != val and user_norm.get(val) != key:
                is_correct = False
                break

        return is_correct, formatted_correct

    user_str = str(user_answer or "")
    is_correct = normalize_text(user_str) == normalize_text(correct_answer_raw)
    return is_correct, correct_answer_raw
