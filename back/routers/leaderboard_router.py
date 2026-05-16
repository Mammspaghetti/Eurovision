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

    for user_idx, artist in enumerate(user_ranking):
        real_idx = next(
            (i for i, a in enumerate(real_results) if a["id"] == artist["artist_id"]),
            None
        )

        if real_idx is None:
            continue

        # =========================
        # PODIUM RULE (0,1,2)
        # =========================
        if user_idx < 3:

            if user_idx == real_idx:
                score += 300  # exact podium position

            elif real_idx < 3:
                score += 200  # dans le podium mais mauvaise position

            else:
                score += 100  # hors podium mais encore acceptable

        # =========================
        # RESTE DU CLASSEMENT
        # =========================
        else:
            diff = abs(real_idx - user_idx)
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

    rows = (
        db.query(LeaderboardDB, UserDB)
        .join(UserDB, UserDB.id == LeaderboardDB.user_id)
        .order_by(LeaderboardDB.score.desc())
        .all()
    )

    result = []

    for i, (lb, user) in enumerate(rows):
        result.append({
            "user_id": lb.user_id,
            "pseudo": user.pseudo,  # 👈 IMPORTANT
            "score": lb.score,
            "rank": i + 1,
            "status": lb.status
        })

    return result