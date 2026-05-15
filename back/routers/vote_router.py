from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.vote import VoteDB
from models.final_result import FinalResultDB
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

# =========================
# GET FINAL VOTE
# =========================
# @router.post("/publish")
# def publish_results(payload: dict, db: Session = Depends(get_db)):

#     existing = db.query(FinalResultDB).first()

#     if existing:
#         existing.results = json.dumps(payload["results"])
#         existing.published = True

#         db.commit()

#         return {"message": "results updated"}

#     result = FinalResultDB(
#         results=json.dumps(payload["results"]),
#         published=True
#     )

#     db.add(result)

#     db.commit()

#     return {"message": "results created"}
# =========================
# SUBMIT FINAL VOTE
# =========================
@router.post("/submit")
def submit_vote(payload: VoteCreate, db: Session = Depends(get_db)):

    existing = db.query(VoteDB).filter(
        VoteDB.user_id == payload.user_id
    ).first()

    if existing:
        existing.ranking = json.dumps(payload.ranking)
        existing.status = "submitted"

        db.commit()

        return {"message": "vote submitted"}

    vote = VoteDB(
        user_id=payload.user_id,
        ranking=json.dumps(payload.ranking),
        status="submitted"
    )

    db.add(vote)
    db.commit()
    db.refresh(vote)

    return {
        "message": "vote submitted",
        "id": vote.id
    }

# =========================
# GET FINAL VOTE
# =========================
@router.get("/latest")
def get_latest_results(db: Session = Depends(get_db)):

    result = db.query(FinalResultDB).first()

    if not result:
        return {
            "published": False,
            "results": []
        }

    return {
        "published": result.published,
        "results": json.loads(result.results)
    }

# =========================
# GET VOTE
# =========================
@router.get("/")
def get_votes(db: Session = Depends(get_db)):

    votes = db.query(VoteDB).all()

    return [
        {
            "id": v.id,
            "user_id": v.user_id,
            "ranking": json.loads(v.ranking) if v.ranking else [],
            "status": v.status
        }
        for v in votes
    ]

@router.get("/{user_id}")
def get_vote(user_id: int, db: Session = Depends(get_db)):

    vote = db.query(VoteDB).filter(
        VoteDB.user_id == user_id
    ).first()

    if not vote:
        return {
            "user_id": user_id,
            "status": "none",
            "ranking": []
        }

    try:
        ranking = json.loads(vote.ranking) if vote.ranking else []
    except:
        ranking = []

    return {
        "id": vote.id,
        "user_id": vote.user_id,
        "ranking": ranking,
        "status": vote.status
    }


# =========================
# SAVE DRAFT
# =========================
@router.post("/draft")
def save_draft(payload: VoteCreate, db: Session = Depends(get_db)):

    existing = db.query(VoteDB).filter(
        VoteDB.user_id == payload.user_id
    ).first()

    if existing:
        existing.ranking = json.dumps(payload.ranking)
        existing.status = "draft"
        db.commit()
        return {"message": "draft updated"}

    vote = VoteDB(
        user_id=payload.user_id,
        ranking=json.dumps(payload.ranking),
        status="draft"
    )

    db.add(vote)
    db.commit()
    db.refresh(vote)

    return {"message": "draft saved", "id": vote.id}