from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.vote import VoteDB
from models.user import UserDB
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

    for user_idx, artist in enumerate(ranking):

        real_idx = next(
            (i for i, a in enumerate(real_results) if a["id"] == artist["id"]),
            -1
        )

        if real_idx == -1:
            continue

        diff = abs(real_idx - user_idx)
        points = max(0, 100 - diff * 5)

        if real_idx <= 2:
            points += 50
        elif real_idx <= 9:
            points += 20

        score += points

    return score

@leaderboard_router.get("/")
def get_leaderboard(db: Session = Depends(get_db)):

    final = db.query(FinalResultDB).first()

    if not final:
        return []

    real_results = json.loads(final.results)

    votes = db.query(VoteDB).all()
    users = db.query(UserDB).all()

    user_map = {u.id: u for u in users}

    leaderboard = []

    for v in votes:

        try:
            ranking = json.loads(v.ranking or "[]")
        except:
            ranking = []

        score = calculate_score(ranking, real_results)

        user = user_map.get(v.user_id)

        if not user:
            continue

        leaderboard.append({
            "user_id": user.id,
            "pseudo": user.pseudo,
            "score": score
        })

    leaderboard.sort(key=lambda x: x["score"], reverse=True)

    for i, u in enumerate(leaderboard):
        u["rank"] = i + 1

        if i == 0:
            u["status"] = "WINNER"
        elif i < len(leaderboard) * 0.1:
            u["status"] = "TOP 10%"
        else:
            u["status"] = "LOSER"

    return leaderboard