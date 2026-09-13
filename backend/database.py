from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker


DATABASE_URL = URL.create(
    drivername="postgresql+psycopg2",
    username="postgres",
    password="santhu@2007",
    host="localhost",
    port=5432,
    database="studentdb"
)


engine = create_engine(DATABASE_URL)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()