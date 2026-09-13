from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import engine, SessionLocal
from models import Base, Student
from schemas import StudentCreate, LoginRequest
from auth import create_access_token, verify_token

# =========================================
# CREATE DATABASE TABLES
# =========================================

Base.metadata.create_all(bind=engine)


# =========================================
# FASTAPI APP
# =========================================

app = FastAPI()


# =========================================
# CORS
# =========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================
# PASSWORD HASHING
# =========================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================================
# DATABASE
# =========================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================================
# HOME
# =========================================

@app.get("/")
def home():

    return {
        "message": "Student Management API"
    }


# =========================================
# REGISTER STUDENT
# =========================================

@app.post("/register")
def register_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):

    # Check whether email already exists

    existing_student = db.query(Student).filter(
        Student.email == student.email
    ).first()


    if existing_student:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    # Hash password

    hashed_password = pwd_context.hash(
        student.password
    )


    # Create student

    new_student = Student(

        name=student.name,

        email=student.email,

        password=hashed_password,

        age=student.age,

        branch=student.branch

    )


    db.add(new_student)

    db.commit()

    db.refresh(new_student)


    return {
        "message": "Registration successful"
    }


# =========================================
# LOGIN
# =========================================

@app.post("/login")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.email == login_data.email
    ).first()


    if student is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    password_correct = pwd_context.verify(
        login_data.password,
        student.password
    )


    if not password_correct:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    # Create JWT token

    access_token = create_access_token({
        "student_id": student.id
    })


    return {

        "access_token": access_token,

        "token_type": "bearer",

        "student_id": student.id,

        "name": student.name

    }

# =========================================
# CREATE STUDENT
# =========================================

@app.post("/students")
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):

    hashed_password = pwd_context.hash(
        student.password
    )


    new_student = Student(

        name=student.name,

        email=student.email,

        password=hashed_password,

        age=student.age,

        branch=student.branch

    )


    db.add(new_student)

    db.commit()

    db.refresh(new_student)


    return {
        "message": "Student created successfully"
    }


# =========================================
# GET ALL STUDENTS
# =========================================

@app.get("/students")
def get_students(
    db: Session = Depends(get_db),
    current_student_id: int = Depends(verify_token)
):

    students = db.query(Student).all()


    # Don't send passwords to frontend

    result = []


    for student in students:

        result.append({

            "id": student.id,

            "name": student.name,

            "email": student.email,

            "age": student.age,

            "branch": student.branch

        })


    return {
        "students": result
    }


# =========================================
# GET ONE STUDENT
# =========================================

@app.get("/students/{student_id}")
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_student_id: int = Depends(verify_token)
):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()


    if student is None:

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )


    return {

        "id": student.id,

        "name": student.name,

        "email": student.email,

        "age": student.age,

        "branch": student.branch

    }


# =========================================
# UPDATE STUDENT
# =========================================

@app.put("/students/{student_id}")
def update_student(
    student_id: int,
    student_data: StudentCreate,
    db: Session = Depends(get_db),
    current_student_id: int = Depends(verify_token)
):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()


    if student is None:

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )


    student.name = student_data.name

    student.email = student_data.email

    student.age = student_data.age

    student.branch = student_data.branch


    # Update password only if provided

    if student_data.password:

        student.password = pwd_context.hash(
            student_data.password
        )


    db.commit()

    db.refresh(student)


    return {
        "message": "Student updated successfully"
    }


# =========================================
# DELETE STUDENT
# =========================================

@app.delete("/students/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_student_id: int = Depends(verify_token)
):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()


    if student is None:

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )


    db.delete(student)

    db.commit()


    return {
        "message": "Student deleted successfully"
    }