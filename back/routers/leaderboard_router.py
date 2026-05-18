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

    # =========================
    # MAP REAL RESULTS
    # =========================
    real_map = {
        str(item["artist_id"]): item["position"]
        for item in real_results
        if isinstance(item, dict)
    }

    score = 0
    n = len(real_results)

    for user_item in user_ranking:

        artist_id = str(user_item.get("artist_id"))
        user_pos = user_item.get("position")

        if artist_id not in real_map:
            continue

        real_pos = real_map[artist_id]
        diff = abs(user_pos - real_pos)

        # =========================
        # BASE SCORE (amélioré)
        # =========================
        if diff == 0:
            score += 300

        elif diff <= 2:
            score += 200

        elif diff <= 5:
            score += 100

        else:
            # 🔥 remplace ton linear fallback par une décroissance plus propre
            score += max(0, 80 - (diff * 3))

        # =========================
        # BONUS SYSTEM (nouveau)
        # =========================

        # TOP 3 bonus
        if real_pos <= 3:
            score += 50

        # LAST bonus (anti-oubli stratégique)
        if real_pos == n:
            score += 100

        # 🔥 bonus de "bonne direction"
        # (petit bonus si pas trop loin même hors threshold)
        if diff <= 8:
            score += 10

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

    # =========================
    # RESET LEADERBOARD
    # =========================
    db.query(LeaderboardDB).delete(synchronize_session=False)
    db.commit()

    db_rows = []

    # =========================
    # CREATE SCORES
    # =========================
    for v in votes:

        try:
            ranking = json.loads(v.ranking or "[]")
        except:
            ranking = []

        score = calculate_score(ranking, real_results)

        row = LeaderboardDB(
            user_id=v.user_id,
            score=score
        )

        db.add(row)
        db_rows.append(row)

    db.commit()

    # =========================
    # SORT + RANK + STATUS
    # =========================
    db_rows.sort(key=lambda x: x.score, reverse=True)

    total = len(db_rows)

    for i, row in enumerate(db_rows):

        row.rank = i + 1

        if i == 0:
            row.status = "WINNER"
        elif i < total * 0.1:
            row.status = "TOP_10"
        else:
            row.status = "LOSER"

    db.commit()

    return {
        "message": "leaderboard updated",
        "total_users": total
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