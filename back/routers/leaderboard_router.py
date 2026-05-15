from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.vote import VoteDB
from models.user import UserDB
from models.leaderboard import LeaderboardDB
from models.final_result import FinalResultDB
import json

leaderboard_router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def calculate_score(ranking, real_results):

    score = 0

    for item in ranking:

        artist_id = str(item["artist_id"])
        user_pos = item["position"] - 1

        real_pos = next(
            (i for i, a in enumerate(real_results) if str(a["id"]) == artist_id),
            None
        )

        if real_pos is None:
            continue

        diff = abs(real_pos - user_pos)

        score += max(0, 100 - diff * 10)

    return score

@leaderboard_router.post("/recalculate")
def recalculate_leaderboard(db: Session = Depends(get_db)):

    # 1. GET FINAL RESULTS
    final = db.query(FinalResultDB).first()
    if not final:
        return {"error": "no final results"}

    real_results = json.loads(final.results)

    # 2. GET ALL VOTES
    votes = db.query(VoteDB).all()

    # 3. CLEAR OLD LEADERBOARD
    db.query(LeaderboardDB).delete()
    db.commit()

    leaderboard = []

    # 4. CALCUL SCORES
    for v in votes:

        try:
            ranking = json.loads(v.ranking or "[]")
        except:
            ranking = []

        score = calculate_score(ranking, real_results)

        lb = LeaderboardDB(
            user_id=v.user_id,
            score=score
        )

        db.add(lb)

        leaderboard.append({
            "user_id": v.user_id,
            "score": score
        })

    db.commit()

    # 5. SORT + RANK
    leaderboard.sort(key=lambda x: x["score"], reverse=True)

    for i, u in enumerate(leaderboard):
        u["rank"] = i + 1

        u["status"] = (
            "WINNER" if i == 0
            else "TOP_10" if i < len(leaderboard) * 0.1
            else "LOSER"
        )

    return {
        "message": "leaderboard recalculated",
        "leaderboard": leaderboard
    }

@leaderboard_router.get("/")
def get_leaderboard(db: Session = Depends(get_db)):

    rows = db.query(LeaderboardDB).all()

    rows.sort(key=lambda x: x.score, reverse=True)

    result = []

    for i, r in enumerate(rows):
        result.append({
            "user_id": r.user_id,
            "score": r.score,
            "rank": i + 1,
            "status": (
                "WINNER"
                if i == 0
                else "TOP_10" if i < len(rows) * 0.1
                else "LOSER"
            )
        })

    return result