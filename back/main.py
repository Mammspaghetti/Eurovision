from fastapi import FastAPI
from services.artist_service import load_artists, get_artists
from routes.auth import router as auth_router

app = FastAPI()
app.include_router(auth_router)

# charger les artistes au démarrage
load_artists()

@app.get("/")
def read_root():
    artists = get_artists()
    artist_list = [a.to_dict() for a in artists]  # plus simple avec to_dict
    return {
        "message": "Hello World 🎤",
        "artists": artist_list
    }

@app.get("/artist")
def load_artist():
    artists = get_artists()
    artist_list = [a.to_dict() for a in artists]  # plus simple avec to_dict
    return {
        "message": "Hello World 🎤",
        "artists": artist_list
    }