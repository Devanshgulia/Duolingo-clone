import re
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import (
    User, Course, Unit, Skill, UserSkillProgress,
    UserChestClaim, LessonAttempt, XpLog, Quest, UserQuestProgress,
    Achievement, UserAchievement
)
from app.schemas import RegisterRequest, LoginRequest, AuthResponse, UserSummary
from app.auth import hash_password, verify_password, create_access_token, require_current_user, get_current_user
from app.services.gamification import get_today_xp, get_user_active_dates

router = APIRouter(prefix="/api/auth", tags=["Auth"])

def user_to_summary(user: User, db: Session) -> UserSummary:
    today_xp = get_today_xp(user.id, db)
    active_dates = get_user_active_dates(user.id, db)
    return UserSummary(
        id=user.id,
        username=user.username,
        display_name=user.display_name or "",
        avatar_url=user.avatar_url,
        xp_total=user.xp_total,
        streak_count=user.streak_count,
        hearts=user.hearts,
        max_hearts=user.max_hearts,
        gems=user.gems,
        daily_goal_xp=user.daily_goal_xp,
        today_xp=today_xp,
        streak_freeze_count=user.streak_freeze_count,
        double_xp_active=user.double_xp_active,
        is_super=user.is_super,
        league=user.league or "Bronze",
        outfit=user.outfit or "classic",
        last_activity_date=user.last_activity_date,
        active_course_id=user.active_course_id,
        active_dates=active_dates
    )

def reset_demo_user(user: User, db: Session) -> User:
    """Completely wipe and re-initialize demo user to a fresh starter state with no assigned name."""
    db.query(UserSkillProgress).filter(UserSkillProgress.user_id == user.id).delete()
    db.query(UserChestClaim).filter(UserChestClaim.user_id == user.id).delete()
    db.query(LessonAttempt).filter(LessonAttempt.user_id == user.id).delete()
    db.query(XpLog).filter(XpLog.user_id == user.id).delete()
    db.query(UserQuestProgress).filter(UserQuestProgress.user_id == user.id).delete()
    db.query(UserAchievement).filter(UserAchievement.user_id == user.id).delete()

    user.display_name = ""
    user.xp_total = 0
    user.streak_count = 0
    user.hearts = 5
    user.max_hearts = 5
    user.gems = 500
    user.daily_goal_xp = 30
    user.streak_freeze_count = 1
    user.double_xp_active = False
    user.is_super = False
    user.league = "Bronze"
    user.outfit = "classic"
    user.last_activity_date = None

    default_course = db.query(Course).first()
    if default_course:
        user.active_course_id = default_course.id
        all_units = db.query(Unit).filter(Unit.course_id == default_course.id).order_by(Unit.order_index).all()
        is_first_skill = True
        for u in all_units:
            skills = db.query(Skill).filter(Skill.unit_id == u.id).order_by(Skill.order_index).all()
            for s in skills:
                status_str = "available" if is_first_skill else "locked"
                prog = UserSkillProgress(
                    user_id=user.id,
                    skill_id=s.id,
                    status=status_str,
                    crowns=0,
                    completed_lessons_count=0
                )
                db.add(prog)
                is_first_skill = False

    quests = db.query(Quest).all()
    for q in quests:
        db.add(UserQuestProgress(
            user_id=user.id,
            quest_id=q.id,
            current_amount=0,
            is_completed=False,
            is_claimed=False
        ))

    achievements = db.query(Achievement).all()
    for a in achievements:
        db.add(UserAchievement(
            user_id=user.id,
            achievement_id=a.id,
            current_level=0,
            current_progress=0
        ))

    db.commit()
    db.refresh(user)
    return user

@router.post("/register", response_model=AuthResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    username_clean = req.username.strip().lower()
    if not username_clean:
        raise HTTPException(status_code=400, detail="Username cannot be empty")
    
    if len(username_clean) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")

    if not re.match(r'^[a-zA-Z0-9_-]+$', username_clean):
        raise HTTPException(status_code=400, detail="Username can only contain letters, numbers, underscores and hyphens")

    if len(req.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters")

    # Check if username exists
    existing = db.query(User).filter(User.username == username_clean).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username is already taken")

    # Check email if provided
    email_clean = req.email.strip().lower() if req.email else None
    if email_clean:
        existing_email = db.query(User).filter(User.email == email_clean).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email is already registered")

    default_course = db.query(Course).first()
    active_course_id = default_course.id if default_course else None

    avatar = f"https://api.dicebear.com/7.x/bottts/svg?seed={username_clean}&backgroundColor=58cc02"
    display_name = req.display_name.strip() if req.display_name else req.username.strip()

    new_user = User(
        username=username_clean,
        email=email_clean,
        password_hash=hash_password(req.password),
        display_name=display_name,
        avatar_url=avatar,
        xp_total=0,
        streak_count=0,
        hearts=5,
        max_hearts=5,
        gems=500,
        daily_goal_xp=30,
        streak_freeze_count=1,
        is_super=False,
        league="Bronze",
        outfit="classic",
        last_activity_date=None,
        active_course_id=active_course_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if default_course and default_course.units:
        first_unit = default_course.units[0]
        if first_unit.skills:
            first_skill = first_unit.skills[0]
            prog = UserSkillProgress(
                user_id=new_user.id,
                skill_id=first_skill.id,
                status="available",
                crowns=0,
                completed_lessons_count=0
            )
            db.add(prog)
            db.commit()

    token = create_access_token(new_user.id)
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=user_to_summary(new_user, db)
    )

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    ident = req.identifier.strip().lower()
    
    # Query by username or email (case insensitive)
    user = db.query(User).filter(
        (User.username.ilike(ident)) | (User.email.ilike(ident))
    ).first()

    if not user:
        if ident in ["learner", "learner@duolingo.clone"]:
            default_course = db.query(Course).first()
            user = User(
                username="learner",
                email="learner@duolingo.clone",
                password_hash=hash_password("password"),
                display_name="",
                avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=duo_learner&backgroundColor=58cc02",
                xp_total=0,
                streak_count=0,
                hearts=5,
                max_hearts=5,
                gems=500,
                daily_goal_xp=30,
                streak_freeze_count=1,
                is_super=False,
                league="Bronze",
                outfit="classic",
                last_activity_date=None,
                active_course_id=default_course.id if default_course else None
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            reset_demo_user(user, db)
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username/email or password"
            )

    is_valid = False
    if user.username == "learner":
        is_valid = True
        reset_demo_user(user, db)
    elif user.password_hash:
        is_valid = verify_password(req.password, user.password_hash)

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password"
        )

    token = create_access_token(user.id)
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=user_to_summary(user, db)
    )

@router.post("/demo", response_model=AuthResponse)
def demo_login(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == "learner").first()
    if not user:
        default_course = db.query(Course).first()
        user = User(
            username="learner",
            email="learner@duolingo.clone",
            password_hash=hash_password("password"),
            display_name="",
            avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=duo_learner&backgroundColor=58cc02",
            xp_total=0,
            streak_count=0,
            hearts=5,
            max_hearts=5,
            gems=500,
            daily_goal_xp=30,
            streak_freeze_count=1,
            is_super=False,
            league="Bronze",
            outfit="classic",
            last_activity_date=None,
            active_course_id=default_course.id if default_course else None
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    reset_demo_user(user, db)
    token = create_access_token(user.id)
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=user_to_summary(user, db)
    )

@router.get("/me", response_model=UserSummary)
def get_me(db: Session = Depends(get_db), current_user: User = Depends(require_current_user)):
    return user_to_summary(current_user, db)

@router.post("/logout")
def logout():
    return {"success": True, "message": "Logged out successfully"}
