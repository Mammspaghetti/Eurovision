from sqlalchemy import Column, Integer, String
from database.db import Base
from pydantic import BaseModel, EmailStr

# Modèle SQLAlchemy pour la DB
class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    pseudo = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

# Pour register
class UserCreate(BaseModel):
    pseudo: str
    email: EmailStr
    password: str

# Pour login
class UserLogin(BaseModel):
    pseudo: str
    password: str