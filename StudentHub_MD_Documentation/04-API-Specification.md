# StudentHub — REST API Specification

**API Version:** v1  
**Base Path:** `/api/v1`

---

## 1. API Conventions

### Content Type

```http
Content-Type: application/json
```

### Authentication

Protected endpoints use:

```http
Authorization: Bearer <access_token>
```

---

## 2. Response Conventions

Successful responses should use resource-oriented JSON.

Errors should follow a consistent structure:

```json
{
  "error": {
    "code": "STUDENT_NOT_FOUND",
    "message": "Student was not found."
  }
}
```

---

# 3. Authentication APIs

## POST /auth/register

Creates a user/student account.

### Request

```json
{
  "name": "Santhosh",
  "email": "santhosh@example.com",
  "password": "StrongPassword",
  "age": 20,
  "branch": "CSE"
}
```

### Responses

`201 Created`

```json
{
  "message": "Registration successful"
}
```

`409 Conflict` for an existing email.

`422 Unprocessable Entity` for validation errors.

---

## POST /auth/login

Authenticates a user.

### Request

```json
{
  "email": "santhosh@example.com",
  "password": "StrongPassword"
}
```

### Response

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer"
}
```

Invalid credentials:

`401 Unauthorized`

---

## GET /auth/me

Returns the authenticated user's profile.

Requires authentication.

---

# 4. Student APIs

## POST /students

Creates a student.

Requires appropriate authorization.

### Request

```json
{
  "name": "Rahul",
  "email": "rahul@example.com",
  "age": 20,
  "branch": "CSE"
}
```

### Response

`201 Created`

```json
{
  "id": 101,
  "name": "Rahul",
  "email": "rahul@example.com",
  "age": 20,
  "branch": "CSE"
}
```

---

## GET /students

Returns a paginated student list.

### Query Parameters

```text
page
page_size
search
branch
```

Example:

```http
GET /api/v1/students?page=1&page_size=20&search=rahul&branch=CSE
```

### Response

```json
{
  "items": [
    {
      "id": 101,
      "name": "Rahul",
      "email": "rahul@example.com",
      "age": 20,
      "branch": "CSE"
    }
  ],
  "page": 1,
  "page_size": 20,
  "total": 1,
  "total_pages": 1
}
```

---

## GET /students/{student_id}

Returns one student.

### Errors

- `401` unauthenticated
- `403` unauthorized
- `404` not found

---

## PUT /students/{student_id}

Updates a student.

### Request

```json
{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "age": 21,
  "branch": "CSE"
}
```

### Response

`200 OK`

---

## DELETE /students/{student_id}

Deletes a student when authorized.

### Response

Recommended:

`204 No Content`

or a documented confirmation response.

---

# 5. Health API

## GET /health

Returns application health.

```json
{
  "status": "healthy"
}
```

A deeper readiness endpoint may check database connectivity separately.

---

# 6. HTTP Status Codes

| Code | Use |
|---|---|
| 200 | Successful operation |
| 201 | Resource created |
| 204 | Successful deletion/no body |
| 400 | Invalid request |
| 401 | Authentication failure |
| 403 | Authorization failure |
| 404 | Resource not found |
| 409 | Resource conflict |
| 422 | Validation failure |
| 500 | Unexpected server error |

---

# 7. API Security Rules

1. Authentication must be checked server-side.
2. Authorization must be checked for every protected resource.
3. Tokens must have expiration.
4. Sensitive fields must not be returned.
5. Error responses must not expose secrets or stack traces.
6. Production APIs must use HTTPS.

---

# 8. API Versioning

Public API routes use:

```text
/api/v1/...
```

Breaking changes should be introduced through a new API version rather than silently changing existing contracts.

---

# 9. API Documentation

FastAPI's generated OpenAPI/Swagger documentation should reflect the current implementation.

The implementation and this document must be kept synchronized.
