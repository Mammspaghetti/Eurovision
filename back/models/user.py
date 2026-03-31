from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

class User:
    _id_counter = 1

    def __init__(self, name, password):
        self.id = User._id_counter
        User._id_counter += 1

        self.name = name
        # plus besoin de tronquer, argon2 accepte tout
        self.hashed_password = pwd_context.hash(password)
        self.points = 0

    def verify_password(self, password):
        return pwd_context.verify(password, self.hashed_password)