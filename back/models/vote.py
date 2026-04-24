from sqlalchemy import Column, Integer, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from database.db import Base

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ranking = Column(Text)  # JSON string
    created_at = Column(DateTime, server_default=func.now())
    status = Column(String, default="draft")  # 👈 ajout