from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.vote import Vote
from pydantic import BaseModel
from typing import List, Dict
import json

router = APIRouter(prefix="/votes", tags=["Votes"])

# dependency DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 📦 schema reçu depuis React
class VoteCreate(BaseModel):
    user_id: int
    ranking: List[Dict]  # ou List[dict] selon ton Artist type


@router.post("/")
def submit_vote(payload: VoteCreate, db: Session = Depends(get_db)):
    vote = Vote(
        user_id=payload.user_id,
        ranking=json.dumps(payload.ranking)
    )

    db.add(vote)
    db.commit()
    db.refresh(vote)

    return {"message": "vote saved", "id": vote.id}