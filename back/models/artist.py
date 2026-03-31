class Artist:
    _id_counter = 1  # variable de classe

    def __init__(self, name, country):
        self.id = Artist._id_counter
        Artist._id_counter += 1

        self.name = name
        self.country = country