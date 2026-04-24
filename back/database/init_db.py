from database.db import engine, Base

from models.user import UserDB
from models.vote import VoteDB

print("🚀 Creating database tables...")

Base.metadata.create_all(bind=engine)

print("✅ Done!")