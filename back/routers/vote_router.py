from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import SessionLocal

from models.vote import VoteDB
from models.final_result import FinalResultDB

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
# SUBMIT FINAL VOTE
# =========================================
@router.post("/submit")
def submit_vote(payload: VoteCreate, db: Session = Depends(get_db)):

    try:
        # 1. UPSERT vote user
        existing = db.query(VoteDB).filter(
            VoteDB.user_id == payload.user_id
        ).first()

        ranking_json = json.dumps(payload.ranking or [])

        if existing:
            existing.ranking = ranking_json
            existing.status = "submitted"
        else:
            vote = VoteDB(
                user_id=payload.user_id,
                ranking=ranking_json,
                status="submitted"
            )
            db.add(vote)

        db.commit()

        # 2. recalcul global leaderboard
        all_votes = db.query(VoteDB).filter(
            VoteDB.status == "submitted"
        ).all()

        aggregated = {}

        for v in all_votes:
            ranking = json.loads(v.ranking or "[]")

            for item in ranking:
                artist_id = item["artist_id"]
                position = item["position"]

                if artist_id not in aggregated:
                    aggregated[artist_id] = 0

                # score simple (inverse ranking)
                aggregated[artist_id] += (100 - position)

        # 3. transformer en liste triée
        results = sorted(
            aggregated.items(),
            key=lambda x: x[1],
            reverse=True
        )

        final = [
            {"artist_id": k, "score": v}
            for k, v in results
        ]

        # 4. UPSERT FinalResultDB
        existing_final = db.query(FinalResultDB).first()

        if existing_final:
            existing_final.results = json.dumps(final)
            existing_final.published = True
        else:
            db.add(FinalResultDB(
                results=json.dumps(final),
                published=True
            ))

        db.commit()

        return {
            "message": "vote submitted + leaderboard updated",
            "results": final
        }

    except Exception as e:
        print("ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# =========================================
# SAVE DRAFT
# =========================================
@router.post("/draft")
def save_draft(
    payload: VoteCreate,
    db: Session = Depends(get_db)
):

    vote = create_or_update_vote(
        db=db,
        payload=payload,
        status="draft"
    )

    return {
        "message": "draft saved",
        "vote": serialize_vote(vote)
    }


# =========================================
# PUBLISH RESULTS
# =========================================
@router.post("/publish")
def publish_results(
    payload: PublishResults,
    db: Session = Depends(get_db)
):

    existing = db.query(FinalResultDB).first()

    results_json = json.dumps(payload.results)

    # UPDATE
    if existing:
        existing.results = results_json
        existing.published = payload.published

        db.commit()

        return {
            "message": "results updated"
        }

    # CREATE
    result = FinalResultDB(
        results=results_json,
        published=payload.published
    )

    db.add(result)

    db.commit()

    return {
        "message": "results created"
    }


# =========================================
# GET LATEST RESULTS
# =========================================
@router.get("/latest")
def get_latest_results(
    db: Session = Depends(get_db)
):

    result = db.query(FinalResultDB).first()

    if not result:
        return {
            "published": False,
            "results": []
        }

    try:
        results = json.loads(result.results)
    except:
        results = []

    return {
        "published": result.published,
        "results": results
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