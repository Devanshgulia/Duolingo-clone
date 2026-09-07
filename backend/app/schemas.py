from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Any, Dict
from datetime import datetime, date

# --- User & Gamification Schemas ---
class UserSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    xp_total: int
    streak_count: int
    hearts: int
    max_hearts: int
    gems: int
    daily_goal_xp: int
    today_xp: int
    streak_freeze_count: int = 1
    double_xp_active: bool = False
    is_super: bool = False
    league: str = "Bronze"
    outfit: str = "classic"
    last_activity_date: Optional[date] = None
    active_course_id: Optional[int] = None
    active_dates: List[str] = []


class RegisterRequest(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    display_name: Optional[str] = None
    age: Optional[int] = None


class LoginRequest(BaseModel):
    identifier: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserSummary


class UpdateGoalRequest(BaseModel):
    daily_goal_xp: int


class CourseOverview(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    language_code: str
    icon_code: str


class CourseSwitchRequest(BaseModel):
    course_id: int


class UserProfileStats(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    xp_total: int
    streak_count: int
    hearts: int
    gems: int
    league: str = "Bronze"
    is_super: bool = False
    outfit: str = "classic"
    skills_completed: int
    total_lessons_completed: int
    achievements: List[Dict[str, Any]] = []


class LeaderboardEntry(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    xp_total: int
    league: str = "Bronze"
    rank: int
    is_current_user: bool = False


# --- Learning Path Schemas ---
class LessonOverview(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    order_index: int
    xp_reward: int
    is_completed: bool = False


class SkillNodeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    unit_id: int
    title: str
    icon: str
    order_index: int
    total_lessons: int
    status: str  # locked, available, completed
    crowns: int
    completed_lessons_count: int
    lessons: List[LessonOverview] = []


class ChestRewardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    unit_id: int
    order_index: int
    reward_gems: int
    reward_xp: int
    is_unlocked: bool = False
    is_claimed: bool = False


class UnitOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    order_index: int
    color_theme: str = "green"
    has_guidebook: bool = True
    skills: List[SkillNodeOut] = []
    chests: List[ChestRewardOut] = []


class PathOut(BaseModel):
    course_id: int
    course_title: str
    language_code: str
    units: List[UnitOut] = []
    user_summary: UserSummary
    available_courses: List[CourseOverview] = []


# --- Guidebook Schemas ---
class KeyPhraseItem(BaseModel):
    phrase: str
    translation: str
    audio_text: Optional[str] = None
    context: Optional[str] = None


class GrammarTipItem(BaseModel):
    title: str
    explanation: str
    examples: List[Dict[str, str]] = []


class GuidebookOut(BaseModel):
    id: int
    unit_id: int
    unit_title: str
    title: str
    summary: Optional[str] = None
    key_phrases: List[KeyPhraseItem] = []
    grammar_tips: List[GrammarTipItem] = []


# --- Exercise & Lesson Player Schemas ---
class ExerciseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    lesson_id: int
    type: str  # multiple_choice, translate, match_pairs, fill_blank, type_answer
    prompt: str
    options_json: Optional[str] = None  # JSON string containing options/word bank/pairs
    order_index: int
    hint: Optional[str] = None


class LessonDetailOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    skill_id: int
    skill_title: str
    title: str
    xp_reward: int
    exercises: List[ExerciseOut] = []


class StartLessonResponse(BaseModel):
    attempt_id: int
    lesson: LessonDetailOut
    hearts_remaining: int


class AnswerSubmission(BaseModel):
    attempt_id: int
    exercise_id: int
    user_answer: Any  # string, array of strings, or key-value object


class AnswerResult(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: Optional[str] = None
    hearts_remaining: int
    out_of_hearts: bool = False


class CompleteLessonRequest(BaseModel):
    attempt_id: int


class CompleteLessonResult(BaseModel):
    xp_earned: int
    total_xp: int
    streak_count: int
    streak_incremented: bool
    crowns_awarded: int
    next_skill_unlocked: bool
    hearts_remaining: int
    quests_updated: List[Dict[str, Any]] = []


class RefillHeartsResponse(BaseModel):
    success: bool
    hearts: int
    gems: int
    message: str


# --- Quests Schemas ---
class QuestOut(BaseModel):
    id: int
    title: str
    description: str
    quest_type: str
    target_amount: int
    reward_gems: int
    reward_xp: int
    icon: str
    current_amount: int
    is_completed: bool
    is_claimed: bool


class ClaimQuestResponse(BaseModel):
    success: bool
    reward_gems: int
    reward_xp: int
    user_summary: UserSummary


# --- Chest Schemas ---
class ClaimChestResponse(BaseModel):
    success: bool
    reward_gems: int
    reward_xp: int
    user_summary: UserSummary


# --- Shop Schemas ---
class ShopItemOut(BaseModel):
    id: str
    title: str
    description: str
    category: str  # powerup, refill, subscription, outfit
    cost_gems: int
    icon: str
    is_owned: bool = False
    is_active: bool = False


class PurchaseRequest(BaseModel):
    item_id: str


class PurchaseResponse(BaseModel):
    success: bool
    message: str
    user_summary: UserSummary
