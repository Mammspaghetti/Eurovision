from fastapi import FastAPI

from models.artist import Artist
from routes.auth import router as auth_router

app = FastAPI()

app.include_router(auth_router)

@app.get("/")
def read_root():

    artists = []

    a1 = Artist("Slimane", "France")
    a2 = Artist("Loreen", "Sweden")

    artists.append(a1)
    artists.append(a2)

    return {
        "message": "Hello World 🎤",
        "artists": artists
    }