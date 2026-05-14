from sqlalchemy import Column, Integer, ForeignKey, DateTime, Text, String
from sqlalchemy.sql import func
from database.db import Base

class VoteDB(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ranking = Column(Text, nullable=False)  # JSON string
    status = Column(String, default="draft")  # draft | submitted | locked
    created_at = Column(DateTime, server_default=func.now())