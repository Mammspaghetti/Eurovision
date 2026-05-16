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

def calculate_score(user_ranking, real_results):

    score = 0

    # map final positions (0-based)
    final_map = {
        str(a["artist_id"]): a["position"] - 1
        for a in real_results
    }

    for item in user_ranking:

        artist_id = str(item["artist_id"])
        user_pos = item["position"] - 1

        real_pos = final_map.get(artist_id)

        if real_pos is None:
            continue

        diff = abs(real_pos - user_pos)

        score += max(0, 100 - diff * 10)

    return score

@leaderboard_router.post("/recalculate")
def recalculate_leaderboard(db: Session = Depends(get_db)):

    final = db.query(FinalResultDB).order_by(FinalResultDB.id.desc()).first()

    if not final:
        return {"error": "no final results"}

    try:
        real_results = json.loads(final.results or "[]")
    except Exception as e:
        return {"error": f"invalid final json: {str(e)}"}

    votes = db.query(VoteDB).all()

    db.query(LeaderboardDB).delete()
    db.commit()

    leaderboard = []

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

    leaderboard.sort(key=lambda x: x["score"], reverse=True)

    total = len(leaderboard)

    for i, u in enumerate(leaderboard):
        u["rank"] = i + 1
        u["total"] = total

        u["status"] = (
            "WINNER" if i == 0
            else "TOP_10" if i < total * 0.1
            else "LOSER"
        )

    return {
        "message": "ok",
        "leaderboard": leaderboard
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