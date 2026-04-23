from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.database import get_conn
from app.core.security import decode_token
from app.models.user import User

bearer = HTTPBearer()


def current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer)) -> User:
    email = decode_token(credentials.credentials)
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id, email, hashed_password FROM users WHERE email = ?", (email,)
        ).fetchone()
    if not row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return User(**dict(row))
