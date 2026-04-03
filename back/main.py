from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.user_router import user_router
from database.db import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()
# ======= CORS =======
origins = [
    "http://localhost:3000",  # ton front React par défaut
    "http://127.0.0.1:3000",
    "http://localhost:8080",  # ajoute ton port actuel
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # front autorisé
    allow_credentials=True,
    allow_methods=["*"],     # autorise GET, POST, OPTIONS...
    allow_headers=["*"],     # autorise Content-Type, Authorization...
)

# ======= Routers =======
app.include_router(user_router)

@app.get("/")
def root():
    return {"message": "Backend is running"}