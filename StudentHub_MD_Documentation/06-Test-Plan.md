# StudentHub — Software Test Plan

**Version:** 1.0

---

## 1. Purpose

This document defines the testing strategy for StudentHub.

The objective is to verify functional correctness, security, reliability, API contracts, database behavior, and frontend behavior.

---

## 2. Testing Levels

```text
Unit Tests
    |
    v
Integration Tests
    |
    v
API Tests
    |
    v
Frontend Tests
    |
    v
Security Tests
    |
    v
End-to-End Tests
```

---

# 3. Unit Testing

Test isolated functions such as:

- Password verification
- JWT creation
- JWT validation
- Input validation
- Business rules
- Service methods

Framework:

```text
pytest
```

---

# 4. Integration Testing

Verify interactions between:

```text
FastAPI
   |
SQLAlchemy
   |
PostgreSQL
```

Tests should use a controlled test database/environment.

---

# 5. API Test Cases

| ID | Test | Expected |
|---|---|---|
| AUTH-001 | Valid registration | 201 |
| AUTH-002 | Duplicate email | 409 |
| AUTH-003 | Invalid email | 422 |
| AUTH-004 | Valid login | 200 |
| AUTH-005 | Wrong password | 401 |
| AUTH-006 | Missing token | 401 |
| AUTH-007 | Invalid token | 401 |
| AUTH-008 | Expired token | 401 |
| AUTH-009 | Unauthorized role | 403 |
| STU-001 | Create student | 201 |
| STU-002 | List students | 200 |
| STU-003 | Get existing student | 200 |
| STU-004 | Get missing student | 404 |
| STU-005 | Update student | 200 |
| STU-006 | Delete student | 204/200 |
| STU-007 | Duplicate student email | 409 |
| STU-008 | Search | Correct results |
| STU-009 | Filter | Correct results |
| STU-010 | Pagination | Correct page metadata |

---

# 6. Authentication Testing

Verify:
- Correct credentials succeed.
- Incorrect credentials fail.
- Missing tokens fail.
- Invalid tokens fail.
- Expired tokens fail.
- Protected routes cannot be bypassed.
- Logout/session invalidation behavior matches the chosen token strategy.

---

# 7. Authorization Testing

Test every role against every sensitive operation.

Example:

```text
ADMIN -> DELETE student -> allowed according to policy
STUDENT -> DELETE another student -> denied
STUDENT -> READ own profile -> allowed
STUDENT -> READ another student's private data -> denied
```

---

# 8. Validation Testing

Test:
- Missing fields
- Empty strings
- Invalid email
- Invalid age
- Oversized input
- Invalid branch values
- Duplicate email

---

# 9. Database Testing

Verify:
- Primary keys.
- Unique constraints.
- Foreign keys.
- NOT NULL constraints.
- Transactions.
- Rollback behavior.
- Migration correctness.

---

# 10. Security Testing

Test for:
- SQL injection attempts
- Broken authorization
- Token manipulation
- Sensitive information exposure
- Password storage mistakes
- Missing HTTPS in production configuration
- Excessive error details

Automated dependency/security scanning should be incorporated into CI where practical.

---

# 11. Frontend Testing

Test:
- Login form
- Registration form
- Dashboard rendering
- Search
- Filtering
- Pagination
- Create/edit/delete flows
- Authentication state
- Error states
- Loading states

---

# 12. End-to-End Testing

Example scenario:

```text
Register
  ↓
Login
  ↓
Receive token
  ↓
Open dashboard
  ↓
Create student
  ↓
Search student
  ↓
Edit student
  ↓
Delete student
  ↓
Logout
```

The entire workflow should complete successfully.

---

# 13. Regression Testing

Every major release should rerun critical tests to ensure existing functionality has not regressed.

---

# 14. Performance Testing

Measure:
- API latency
- Throughput
- Database query time
- Concurrent requests
- Pagination performance

Performance targets should be based on expected production workload.

---

# 15. Test Environments

Recommended:

```text
Development
Test/CI
Staging
Production
```

Production data should not be used for ordinary automated tests.

---

# 16. CI Quality Gates

CI should fail when critical checks fail.

Example:

```text
Install
  ↓
Lint
  ↓
Unit Tests
  ↓
Integration Tests
  ↓
Build
  ↓
Security Checks
```

---

# 17. Defect Severity

| Severity | Meaning |
|---|---|
| Critical | Security/data loss/system unavailable |
| High | Major feature unusable |
| Medium | Important but workaround exists |
| Low | Minor UI/documentation issue |

---

# 18. Exit Criteria

Testing may be considered release-ready when:
- Critical tests pass.
- No unresolved critical security defects exist.
- Major workflows pass.
- Database migrations succeed.
- CI passes.
- Production smoke tests pass after deployment.
