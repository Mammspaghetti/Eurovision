from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.vote import Vote
from pydantic import BaseModel
from typing import List, Dict
import json

router = APIRouter(prefix="/votes", tags=["Votes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class VoteCreate(BaseModel):
    user_id: int
    ranking: List[Dict]


@router.post("/draft")
def save_draft(payload: VoteCreate, db: Session = Depends(get_db)):
    existing = db.query(Vote).filter(Vote.user_id == payload.user_id).first()

    if existing:
        existing.ranking = json.dumps(payload.ranking)
        existing.status = "draft"
        db.commit()
        return {"message": "draft updated"}

    vote = Vote(
        user_id=payload.user_id,
        ranking=json.dumps(payload.ranking),
        status="draft"
    )

    db.add(vote)
    db.commit()
    db.refresh(vote)

    return {"message": "draft saved", "id": vote.id}