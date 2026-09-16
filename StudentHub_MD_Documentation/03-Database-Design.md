# StudentHub — Database Design

**Database:** PostgreSQL  
**ORM:** SQLAlchemy

---

## 1. Purpose

This document defines the logical database model, constraints, relationships, indexes, and migration strategy.

---

## 2. Core Entities

Initial entities:

1. users
2. students
3. audit_logs

---

## 3. ER Model

```text
+-------------+          +---------------+
|    users    | 1      1 |    students   |
+-------------+----------+---------------+
| id PK       |          | id PK         |
| name        |          | user_id FK    |
| email UQ    |          | name          |
| password    |          | email         |
| role        |          | age           |
| created_at  |          | branch        |
| updated_at  |          | created_at    |
+------+------+          | updated_at    |
       |                 +---------------+
       |
       | 1
       |
       | N
+------v------+
| audit_logs  |
+-------------+
| id PK       |
| user_id FK  |
| action      |
| entity_type |
| entity_id   |
| timestamp   |
| metadata    |
+-------------+
```

---

## 4. users

| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK |
| name | VARCHAR | NOT NULL |
| email | VARCHAR | NOT NULL, UNIQUE |
| password_hash | VARCHAR | NOT NULL |
| role | VARCHAR | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

Recommended role values:

```text
ADMIN
STUDENT
```

---

## 5. students

| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK |
| user_id | BIGINT | FK |
| name | VARCHAR | NOT NULL |
| email | VARCHAR | NOT NULL |
| age | INTEGER | CHECK |
| branch | VARCHAR | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

If the business model requires one student account per student profile, `user_id` should be unique.

---

## 6. audit_logs

| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK |
| user_id | BIGINT | FK |
| action | VARCHAR | NOT NULL |
| entity_type | VARCHAR | NOT NULL |
| entity_id | BIGINT | Nullable where applicable |
| timestamp | TIMESTAMP | NOT NULL |
| metadata | JSONB | Optional |

---

## 7. Relationships

### User -> Student

Conceptually one user can map to one student profile when the application represents student accounts directly.

### User -> Audit Logs

One user can produce many audit records.

```text
users 1 ---- N audit_logs
```

---

## 8. Constraints

Required constraints include:

- Primary keys.
- Unique email.
- Foreign keys.
- NOT NULL for mandatory fields.
- Valid age range.
- Controlled role values.

Database constraints are required even when equivalent validation exists in the application.

---

## 9. Indexes

Potential indexes:

```text
users(email)
students(email)
students(branch)
students(name)
audit_logs(user_id)
audit_logs(timestamp)
```

Indexes should be created based on actual query patterns and measured performance.

---

## 10. Normalization

The schema should avoid unnecessary duplication.

User authentication information belongs in `users`.

Student-specific profile information belongs in `students`.

Audit information belongs in `audit_logs`.

The final design should generally satisfy at least third normal form for the core relational data unless a deliberate performance-driven exception is documented.

---

## 11. Transactions

Create/update/delete operations shall use transactions.

Example:

```text
BEGIN
  Update Student
  Write Audit Log
COMMIT
```

If either required operation fails:

```text
ROLLBACK
```

---

## 12. Migration Strategy

Alembic shall manage schema changes.

```text
Migration 001 -> users
Migration 002 -> students
Migration 003 -> audit_logs
Migration 004 -> indexes
```

Production databases shall not be modified manually for normal application schema changes.

---

## 13. Data Security

- Password hashes only.
- No plaintext credentials.
- Database credentials supplied through secrets.
- Least-privilege database account.
- Production database should not be directly exposed to the public internet.

---

## 14. Backup Requirements

Production database backups should be automated according to the hosting platform's capabilities.

Restore procedures should be tested periodically.

---

## 15. Data Retention

Retention periods for audit records and deleted student information must be defined by the institution/business owner before production use.

---

## 16. Sample Logical SQL

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

The exact production schema should be implemented through SQLAlchemy models and Alembic migrations.
