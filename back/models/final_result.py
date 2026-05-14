from sqlalchemy import Column, Boolean, Integer, ForeignKey, DateTime, Text, String
from sqlalchemy.sql import func
from database.db import Base

class FinalResultDB(Base):
    __tablename__ = "final_results"

    id = Column(Integer, primary_key=True)
    published = Column(Boolean, default=False)
    results = Column(Text)  # JSON string
    created_at = Column(DateTime, server_default=func.now())