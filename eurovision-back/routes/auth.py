from fastapi import APIRouter, HTTPException
from models.user import User
from database.fake_db import users
from core.security import create_token

router = APIRouter()

@router.post("/register")
def register(name: str, password: str):
    for u in users:
        if u.name == name:
            raise HTTPException(status_code=400, detail="User already exists")

    user = User(name, password)
    users.append(user)

    return {"message": "User created"}

@router.post("/login")
def login(name: str, password: str):
    for user in users:
        if user.name == name and user.verify_password(password):
            token = create_token({"sub": user.name})
            return {"access_token": token}

    raise HTTPException(status_code=401, detail="Invalid credentials")