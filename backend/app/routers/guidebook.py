import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Unit, Guidebook
from app.schemas import GuidebookOut, KeyPhraseItem, GrammarTipItem

router = APIRouter(prefix="/api/guidebooks", tags=["Guidebooks"])

@router.get("/unit/{unit_id}", response_model=GuidebookOut)
def get_unit_guidebook(unit_id: int, db: Session = Depends(get_db)):
    unit = db.query(Unit).filter(Unit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    guidebook = db.query(Guidebook).filter(Guidebook.unit_id == unit_id).first()
    if not guidebook:
        raise HTTPException(status_code=404, detail="Guidebook for this unit not found")

    key_phrases = []
    if guidebook.key_phrases_json:
        try:
            raw_phrases = json.loads(guidebook.key_phrases_json)
            key_phrases = [KeyPhraseItem(**p) for p in raw_phrases]
        except Exception:
            pass

    grammar_tips = []
    if guidebook.grammar_tips_json:
        try:
            raw_tips = json.loads(guidebook.grammar_tips_json)
            grammar_tips = [GrammarTipItem(**t) for t in raw_tips]
        except Exception:
            pass

    return GuidebookOut(
        id=guidebook.id,
        unit_id=unit.id,
        unit_title=unit.title,
        title=guidebook.title,
        summary=guidebook.summary,
        key_phrases=key_phrases,
        grammar_tips=grammar_tips
    )
