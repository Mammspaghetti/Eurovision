from sqlalchemy import Column, Integer, String, Boolean
from database.db import Base
from pydantic import BaseModel, EmailStr

# Modèle SQLAlchemy pour la DB
class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    pseudo = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)
    voted = Column(Boolean, default=False)

# Pour register
class UserCreate(BaseModel):
    pseudo: str
    email: EmailStr
    password: str

# Pour login
class UserLogin(BaseModel):
    pseudo: str
    password: str