from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from database.db import Base

class LeaderboardDB(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True)

    data = Column(Text, nullable=False)  # JSON array of all users

    created_at = Column(DateTime, server_default=func.now())

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )

class UserScoreDB(Base):
    __tablename__ = "user_scores"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    score = Column(Integer, default=0)
    rank = Column(Integer, default=0)
    status = Column(String, default="LOSER")

    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())