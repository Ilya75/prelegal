from pydantic import BaseModel
from typing import Literal


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    fields: dict[str, str | None] = {}
    document_type: str = "mutual-nda"


class ChatResponse(BaseModel):
    reply: str
    fields: dict[str, str | None] = {}
