import json
from models.artist import Artist

artists = []

def load_artists(file_path="database/artist_2026.json"):
    global artists
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    artists = [Artist(d["name"], d["song"], d["country"], d["link"]) for d in data]
    print(f"{len(artists)} artistes chargés")  # juste pour vérifier

def get_artists():
    return artists

def add_artist(name, song, country, link):
    new_artist = Artist(name, song, country, link)
    artists.append(new_artist)
    return new_artist