from pydantic import BaseModel


class StudentCreate(BaseModel):
    name: str
    email: str
    password: str
    age: int
    branch: str


class LoginRequest(BaseModel):
    email: str
    password: str