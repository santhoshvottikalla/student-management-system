from sqlalchemy import Column, Integer, String
from database import Base


class Student(Base):

    __tablename__ = "students"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        nullable=False
    )

    password = Column(
        String(255),
        nullable=False
    )

    age = Column(
        Integer,
        nullable=False
    )

    branch = Column(
        String(50),
        nullable=False
    )