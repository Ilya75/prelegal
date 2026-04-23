import sqlite3

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import current_user
from app.core.database import get_conn
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import Token, User, UserCreate, UserRead

router = APIRouter(prefix="/auth")


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(body: UserCreate):
    with get_conn() as conn:
        try:
            conn.execute(
                "INSERT INTO users (email, hashed_password) VALUES (?, ?)",
                (body.email, hash_password(body.password)),
            )
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    return Token(access_token=create_access_token(body.email))


@router.post("/signin", response_model=Token)
def signin(body: UserCreate):
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id, email, hashed_password FROM users WHERE email = ?", (body.email,)
        ).fetchone()
    if not row or not verify_password(body.password, row["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return Token(access_token=create_access_token(body.email))


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(current_user)):
    return UserRead(id=user.id, email=user.email)
