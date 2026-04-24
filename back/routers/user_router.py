from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models.user import UserCreate, UserDB, UserLogin
from core.security import hash_password, verify_password, create_token
from database.db import SessionLocal

user_router = APIRouter(prefix="/users", tags=["users"])

# Dépendance pour obtenir la session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Créer un user
@user_router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Vérifie si pseudo ou email existe déjà
    if db.query(UserDB).filter((UserDB.pseudo == user.pseudo) | (UserDB.email == user.email)).first():
        raise HTTPException(status_code=400, detail="User already exists")
    
    db_user = UserDB(
        pseudo=user.pseudo,
        email=user.email,
        password=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created", "id": db_user.id}

# Authentification
@user_router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Cherche le user dans la DB
    print("Received from front:", user)  # <-- ajoute ça

    db_user = db.query(UserDB).filter(UserDB.pseudo == user.pseudo).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token()

    return {
        "data": user,
        "id": db_user.id,   # ✅ IMPORTANT
        "pseudo": db_user.pseudo, 
        "email": db_user.email,
        "token": token, 
    }

# Liste des users
@user_router.get("/")
def list_users(db: Session = Depends(get_db)):
    users = db.query(UserDB).all()
    return [{"id": u.id, "pseudo": u.pseudo, "email": u.email} for u in users]
