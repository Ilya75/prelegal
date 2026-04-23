from dataclasses import dataclass

from pydantic import BaseModel, Field, field_validator


@dataclass
class User:
    id: int
    email: str
    hashed_password: str


class UserCreate(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=8)

    @field_validator("email")
    @classmethod
    def valid_email(cls, v: str) -> str:
        if "@" not in v or v.startswith("@") or v.endswith("@"):
            raise ValueError("Invalid email address")
        return v.lower()


class UserRead(BaseModel):
    id: int
    email: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
