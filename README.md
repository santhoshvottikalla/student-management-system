# Student Management System

A full-stack student management system built with FastAPI,
PostgreSQL, SQLAlchemy, HTML, CSS and JavaScript.

## Features

- Student registration
- JWT authentication
- Login/logout
- Student CRUD operations
- PostgreSQL database
- Search
- Pagination
- REST API
- Password hashing

## Tech Stack

Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Python
- FastAPI
- SQLAlchemy
- JWT

Database:
- PostgreSQL

## Architecture

Frontend → FastAPI REST API → SQLAlchemy → PostgreSQL

## How to Run

### Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload