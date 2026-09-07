from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models import User
from app.schemas import ShopItemOut, PurchaseRequest, PurchaseResponse, UserSummary
from app.services.gamification import get_today_xp
from app.auth import get_current_user

router = APIRouter(prefix="/api/shop", tags=["Shop"])

SHOP_CATALOG = [
    {
        "id": "heart_refill",
        "title": "Refill Hearts",
        "description": "Restore your health to 5 full hearts instantly.",
        "category": "refill",
        "cost_gems": 100,
        "icon": "heart"
    },
    {
        "id": "streak_freeze",
        "title": "Streak Freeze",
        "description": "Protect your streak for one day of inactivity.",
        "category": "powerup",
        "cost_gems": 200,
        "icon": "snowflake"
    },
    {
        "id": "double_xp",
        "title": "Double XP Boost",
        "description": "Earn 2x XP points for your next completed lessons.",
        "category": "powerup",
        "cost_gems": 150,
        "icon": "zap"
    },
    {
        "id": "super_duolingo",
        "title": "Super Duolingo (Demo)",
        "description": "Enjoy unlimited hearts, legendary status, and zero ads.",
        "category": "subscription",
        "cost_gems": 500,
        "icon": "sparkles"
    },
    {
        "id": "outfit_formal",
        "title": "Formal Suit Duo",
        "description": "Dress up Duo in a fancy gentleman tux.",
        "category": "outfit",
        "cost_gems": 300,
        "icon": "shirt"
    }
]

@router.get("", response_model=List[ShopItemOut])
def get_shop_items(current_user: User = Depends(get_current_user)):
    items = []
    for item in SHOP_CATALOG:
        is_owned = False
        is_active = False

        if item["id"] == "streak_freeze":
            is_owned = current_user.streak_freeze_count > 0
            is_active = current_user.streak_freeze_count > 0
        elif item["id"] == "double_xp":
            is_active = current_user.double_xp_active
            is_owned = current_user.double_xp_active
        elif item["id"] == "super_duolingo":
            is_owned = current_user.is_super
            is_active = current_user.is_super
        elif item["id"] == "outfit_formal":
            is_owned = current_user.outfit == "formal"
            is_active = current_user.outfit == "formal"

        items.append(ShopItemOut(
            id=item["id"],
            title=item["title"],
            description=item["description"],
            category=item["category"],
            cost_gems=item["cost_gems"],
            icon=item["icon"],
            is_owned=is_owned,
            is_active=is_active
        ))
    return items

@router.post("/purchase", response_model=PurchaseResponse)
def purchase_shop_item(req: PurchaseRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    catalog_item = next((item for item in SHOP_CATALOG if item["id"] == req.item_id), None)
    if not catalog_item:
        raise HTTPException(status_code=404, detail="Item not found in shop catalog")

    cost = catalog_item["cost_gems"]

    if req.item_id == "heart_refill":
        if current_user.hearts >= current_user.max_hearts:
            raise HTTPException(status_code=400, detail="Hearts are already full!")
        if current_user.gems < cost:
            raise HTTPException(status_code=400, detail=f"Not enough gems! Need {cost} gems.")
        current_user.gems -= cost
        current_user.hearts = current_user.max_hearts
        message = "Hearts successfully refilled to 5!"

    elif req.item_id == "streak_freeze":
        if current_user.gems < cost:
            raise HTTPException(status_code=400, detail=f"Not enough gems! Need {cost} gems.")
        current_user.gems -= cost
        current_user.streak_freeze_count += 1
        message = f"Streak Freeze equipped! You now have {current_user.streak_freeze_count} streak freezes."

    elif req.item_id == "double_xp":
        if current_user.gems < cost:
            raise HTTPException(status_code=400, detail=f"Not enough gems! Need {cost} gems.")
        current_user.gems -= cost
        current_user.double_xp_active = True
        message = "Double XP Boost activated for your upcoming lessons!"

    elif req.item_id == "super_duolingo":
        if current_user.gems < cost:
            raise HTTPException(status_code=400, detail=f"Not enough gems! Need {cost} gems.")
        current_user.gems -= cost
        current_user.is_super = not current_user.is_super
        message = "Super Duolingo unlocked! You have unlimited hearts!"

    elif req.item_id == "outfit_formal":
        if current_user.gems < cost:
            raise HTTPException(status_code=400, detail=f"Not enough gems! Need {cost} gems.")
        current_user.gems -= cost
        current_user.outfit = "formal"
        message = "Duo is now dressed up in a fancy formal suit!"

    else:
        raise HTTPException(status_code=400, detail="Unknown shop item")

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

    return PurchaseResponse(
        success=True,
        message=message,
        user_summary=user_sum
    )
