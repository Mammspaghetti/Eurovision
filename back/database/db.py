from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = "postgresql+psycopg://postgres:rcU80JGow37bomBI@db.nmurjtqvveijysaqyjog.supabase.co:5432/postgres"
DATABASE_URL = "postgresql+psycopg://postgres.nmurjtqvveijysaqyjog:rcU80JGow37bomBI@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"

engine = create_engine(
    DATABASE_URL,
    connect_args={"sslmode": "require"}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()