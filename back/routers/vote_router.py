from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import SessionLocal

from models.vote import VoteDB
from models.final_result import FinalResultDB
from models.leaderboard import LeaderboardDB

from pydantic import BaseModel

from typing import List, Dict

import json


router = APIRouter(
    prefix="/votes",
    tags=["Votes"]
)


# =========================================
# DATABASE
# =========================================
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================================
# DTO
# =========================================
class VoteCreate(BaseModel):
    user_id: int
    ranking: List[Dict]


class PublishResults(BaseModel):
    results: List[Dict]
    published: bool = True

class FinalVoteCreate(BaseModel):
    ranking: List[Dict]

# =========================================
# HELPERS
# =========================================
def serialize_vote(vote: VoteDB):

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


def create_or_update_vote(
    db: Session,
    payload: VoteCreate,
    status: str
):

    existing = db.query(VoteDB).filter(
        VoteDB.user_id == payload.user_id
    ).first()

    ranking_json = json.dumps(payload.ranking)

    # UPDATE
    if existing:
        existing.ranking = ranking_json
        existing.status = status

        db.commit()
        db.refresh(existing)

        return existing

    # CREATE
    vote = VoteDB(
        user_id=payload.user_id,
        ranking=ranking_json,
        status=status
    )

    db.add(vote)

    db.commit()
    db.refresh(vote)

    return vote


# =========================================
# SUBMIT VOTE
# =========================================
@router.post("/submit")
def submit_vote(payload: VoteCreate, db: Session = Depends(get_db)):

    existing = db.query(VoteDB).filter(
        VoteDB.user_id == payload.user_id
    ).first()

    ranking_json = json.dumps(payload.ranking)

    if existing:
        existing.ranking = ranking_json
        existing.status = "submitted"
    else:
        db.add(VoteDB(
            user_id=payload.user_id,
            ranking=ranking_json,
            status="submitted"
        ))

    db.commit()

    return {
        "message": "ok",
        "vote": {
            "user_id": existing.user_id if existing else payload.user_id,
            "ranking": payload.ranking,
            "status": "submitted"
        }
    }

# =========================================
# SUBMIT FINAL VOTE ID == 1 et ADMIN
# =========================================
@router.post("/submit/final")
def submit_final(payload: FinalVoteCreate, db: Session = Depends(get_db)):

    db.query(FinalResultDB).delete()
    db.commit()

    safe_ranking = [
        dict(r) for r in payload.ranking
    ]

    final = FinalResultDB(
        results=json.dumps(safe_ranking),
        published=True
    )

    db.add(final)
    db.commit()
    db.refresh(final)

    return {
        "message": "final saved",
        "results": safe_ranking,
        "published": final.published
    }

# =========================================
# GET ALL VOTES
# =========================================
@router.get("/")
def get_votes(
    db: Session = Depends(get_db)
):

    votes = db.query(VoteDB).all()

    return [
        serialize_vote(vote)
        for vote in votes
    ]


@router.get("/final")
def get_final(db: Session = Depends(get_db)):

    final = db.query(FinalResultDB).order_by(FinalResultDB.id.desc()).first()

    if not final:
        return {
            "error": "no final results"
        }

    try:
        results = json.loads(final.results)
    except:
        results = []

    return {
        "published": final.published,
        "results": results
    }



# =========================================
# GET USER VOTE
# =========================================
@router.get("/{user_id}")
def get_vote(
    user_id: int,
    db: Session = Depends(get_db)
):

    vote = db.query(VoteDB).filter(
        VoteDB.user_id == user_id
    ).first()

    if not vote:
        return {
            "user_id": user_id,
            "status": "none",
            "ranking": []
        }

    return serialize_vote(vote)
