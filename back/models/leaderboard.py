from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from database.db import Base

class LeaderboardDB(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    score = Column(Integer, nullable=False)

    rank = Column(Integer, nullable=True)

    status = Column(String, default="LOSER")

    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())