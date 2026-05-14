from sqlalchemy import Column, Integer, Boolean, Text, DateTime
from sqlalchemy.sql import func
from database.db import Base

class FinalResultDB(Base):
    __tablename__ = "final_results"

    id = Column(Integer, primary_key=True)
    results = Column(Text, nullable=False)  # JSON string (top ranking)
    published = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())