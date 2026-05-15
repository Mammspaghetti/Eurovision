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
        user_pos = item["position"] - 1  # position commence à 1

        real_idx = next(
            (i for i, a in enumerate(real_results) if str(a["id"]) == artist_id),
            -1
        )

        if real_idx == -1:
            continue

        diff = abs(real_idx - user_pos)

        points = max(0, 100 - diff * 5)

        if real_idx <= 2:
            points += 50
        elif real_idx <= 9:
            points += 20

        score += points

    return score

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