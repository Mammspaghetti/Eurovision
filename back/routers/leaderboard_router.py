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

    final = db.query(FinalResultDB).first()
    if not final:
        return {"error": "no final results"}

    real_results = json.loads(final.results)

    votes = db.query(VoteDB).all()

    # 🧹 reset table propre
    db.query(LeaderboardDB).delete()
    db.commit()

    computed = []

    for v in votes:

        try:
            ranking = json.loads(v.ranking or "[]")
        except:
            ranking = []

        score = calculate_score(ranking, real_results)

        computed.append({
            "user_id": v.user_id,
            "score": score
        })

    # 🔥 sort
    computed.sort(key=lambda x: x["score"], reverse=True)

    # 💾 insert DB avec rank + status
    for i, u in enumerate(computed):

        db.add(LeaderboardDB(
            user_id=u["user_id"],
            score=u["score"],
            rank=i + 1,
            status=(
                "WINNER" if i == 0
                else "TOP_10" if i < max(1, int(len(computed) * 0.1))
                else "LOSER"
            )
        ))

    db.commit()

    return {
        "message": "leaderboard recalculated",
        "leaderboard": computed
    }

@leaderboard_router.get("/")
def get_leaderboard(db: Session = Depends(get_db)):

    rows = db.query(LeaderboardDB).order_by(LeaderboardDB.rank.asc()).all()

    return [
        {
            "user_id": r.user_id,
            "score": r.score,
            "rank": r.rank,
            "status": r.status
        }
        for r in rows
    ]