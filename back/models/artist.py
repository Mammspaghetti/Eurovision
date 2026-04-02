class Artist:
    _id_counter = 1  # compteur automatique d'ID

    def __init__(self, name, song, country, link):
        self.id = Artist._id_counter
        Artist._id_counter += 1
        self.name = name
        self.song = song
        self.country = country
        self.link = link

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "song": self.song,
            "country": self.country,
            "link": self.link
        }

    def __repr__(self):
        return f"{self.id}: {self.name} ({self.country}) – {self.song}"