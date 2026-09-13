from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer


# =========================================
# JWT SETTINGS
# =========================================

SECRET_KEY = "my-super-secret-key-change-later"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# =========================================
# OAUTH2
# =========================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)


# =========================================
# CREATE TOKEN
# =========================================

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# =========================================
# VERIFY TOKEN
# =========================================

def verify_token(
    token: str = Depends(oauth2_scheme)
):

    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid or expired token",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        student_id = payload.get(
            "student_id"
        )

        if student_id is None:

            raise credentials_exception

        return int(student_id)

    except (JWTError, ValueError):

        raise credentials_exception