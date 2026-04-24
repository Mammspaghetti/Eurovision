from sqlalchemy import Column, Integer, ForeignKey, JSON
from database.db import Base

class VoteDB(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    ranking = Column(JSON, nullable=False)