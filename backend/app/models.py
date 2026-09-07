from datetime import datetime, date, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, DateTime, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    display_name = Column(String(100), nullable=False)
    avatar_url = Column(String(255), nullable=True)
    xp_total = Column(Integer, default=0)
    streak_count = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    max_hearts = Column(Integer, default=5)
    gems = Column(Integer, default=500)
    daily_goal_xp = Column(Integer, default=30)
    streak_freeze_count = Column(Integer, default=1)
    double_xp_active = Column(Boolean, default=False)
    is_super = Column(Boolean, default=False)
    outfit = Column(String(50), default="classic")
    league = Column(String(50), default="Bronze")
    last_activity_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    active_course_id = Column(Integer, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)

    skill_progress = relationship("UserSkillProgress", back_populates="user", cascade="all, delete-orphan")
    lesson_attempts = relationship("LessonAttempt", back_populates="user", cascade="all, delete-orphan")
    xp_logs = relationship("XpLog", back_populates="user", cascade="all, delete-orphan")
    quest_progress = relationship("UserQuestProgress", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    chest_claims = relationship("UserChestClaim", back_populates="user", cascade="all, delete-orphan")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    language_code = Column(String(10), nullable=False)
    icon_code = Column(String(50), default="es")

    units = relationship("Unit", back_populates="course", order_by="Unit.order_index", cascade="all, delete-orphan")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, nullable=False)
    color_theme = Column(String(30), default="green") # green, blue, purple, orange, teal

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", order_by="Skill.order_index", cascade="all, delete-orphan")
    guidebook = relationship("Guidebook", back_populates="unit", uselist=False, cascade="all, delete-orphan")
    chests = relationship("ChestReward", back_populates="unit", order_by="ChestReward.order_index", cascade="all, delete-orphan")


class Guidebook(Base):
    __tablename__ = "guidebooks"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id", ondelete="CASCADE"), unique=True, nullable=False)
    title = Column(String(100), nullable=False)
    summary = Column(Text, nullable=True)
    key_phrases_json = Column(Text, nullable=False) # JSON: [{phrase: "Hola", translation: "Hello", audio_text: "Hola"}]
    grammar_tips_json = Column(Text, nullable=True) # JSON: [{title: "Greetings", explanation: "..."}]

    unit = relationship("Unit", back_populates="guidebook")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    icon = Column(String(50), default="star")
    order_index = Column(Integer, nullable=False)
    total_lessons = Column(Integer, default=3)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", order_by="Lesson.order_index", cascade="all, delete-orphan")
    user_progress = relationship("UserSkillProgress", back_populates="skill", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    order_index = Column(Integer, nullable=False)
    xp_reward = Column(Integer, default=10)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", order_by="Exercise.order_index", cascade="all, delete-orphan")
    attempts = relationship("LessonAttempt", back_populates="lesson", cascade="all, delete-orphan")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(30), nullable=False)  # multiple_choice, translate, match_pairs, fill_blank, type_answer
    prompt = Column(Text, nullable=False)
    correct_answer = Column(Text, nullable=False)  # string or JSON string
    options_json = Column(Text, nullable=True)    # JSON options / word bank / matching pairs
    order_index = Column(Integer, nullable=False)
    hint = Column(String(255), nullable=True)

    lesson = relationship("Lesson", back_populates="exercises")


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"
    __table_args__ = (UniqueConstraint("user_id", "skill_id", name="uq_user_skill"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), default="locked")  # locked, available, completed
    crowns = Column(Integer, default=0)
    completed_lessons_count = Column(Integer, default=0)

    user = relationship("User", back_populates="skill_progress")
    skill = relationship("Skill", back_populates="user_progress")


class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), default="in_progress")  # in_progress, completed, failed
    xp_earned = Column(Integer, default=0)
    hearts_lost = Column(Integer, default=0)
    started_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="lesson_attempts")
    lesson = relationship("Lesson", back_populates="attempts")


class XpLog(Base):
    __tablename__ = "xp_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Integer, nullable=False)
    source = Column(String(50), default="lesson_completion")
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="xp_logs")


class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    quest_type = Column(String(50), nullable=False) # earn_xp, complete_lessons, perfect_lesson, spend_time
    target_amount = Column(Integer, default=20)
    reward_gems = Column(Integer, default=20)
    reward_xp = Column(Integer, default=10)
    icon = Column(String(50), default="target")

    user_progress = relationship("UserQuestProgress", back_populates="quest", cascade="all, delete-orphan")


class UserQuestProgress(Base):
    __tablename__ = "user_quest_progress"
    __table_args__ = (UniqueConstraint("user_id", "quest_id", name="uq_user_quest"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quest_id = Column(Integer, ForeignKey("quests.id", ondelete="CASCADE"), nullable=False)
    current_amount = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    is_claimed = Column(Boolean, default=False)

    user = relationship("User", back_populates="quest_progress")
    quest = relationship("Quest", back_populates="user_progress")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    max_level = Column(Integer, default=5)
    tiers_json = Column(Text, nullable=False) # JSON: [{level: 1, target: 3, reward_gems: 20}]
    icon = Column(String(50), default="flame")

    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    __table_args__ = (UniqueConstraint("user_id", "achievement_id", name="uq_user_achievement"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False)
    current_level = Column(Integer, default=0)
    current_progress = Column(Integer, default=0)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")


class ChestReward(Base):
    __tablename__ = "chest_rewards"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id", ondelete="CASCADE"), nullable=False)
    order_index = Column(Integer, nullable=False)
    reward_gems = Column(Integer, default=20)
    reward_xp = Column(Integer, default=15)
    unlock_condition_skill_id = Column(Integer, ForeignKey("skills.id", ondelete="SET NULL"), nullable=True)

    unit = relationship("Unit", back_populates="chests")
    claims = relationship("UserChestClaim", back_populates="chest", cascade="all, delete-orphan")


class UserChestClaim(Base):
    __tablename__ = "user_chest_claims"
    __table_args__ = (UniqueConstraint("user_id", "chest_id", name="uq_user_chest"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    chest_id = Column(Integer, ForeignKey("chest_rewards.id", ondelete="CASCADE"), nullable=False)
    claimed_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="chest_claims")
    chest = relationship("ChestReward", back_populates="claims")
