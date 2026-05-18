from sqlalchemy import Column, Integer, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from database.db import Base


class LeaderboardDB(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    score = Column(Integer, nullable=False, default=0)

    rank = Column(Integer, nullable=True)

    status = Column(String, nullable=False, default="LOSER")

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )