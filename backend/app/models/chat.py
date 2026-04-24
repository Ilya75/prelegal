from typing import Literal

from pydantic import BaseModel


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class NdaFields(BaseModel):
    model_config = {"extra": "ignore"}

    purpose: str | None = None
    effectiveDate: str | None = None
    mndaTermType: Literal["expires", "until_terminated"] | None = None
    mndaTermYears: str | None = None
    confidentialityType: Literal["years", "perpetuity"] | None = None
    confidentialityYears: str | None = None
    governingLaw: str | None = None
    jurisdiction: str | None = None
    party1Company: str | None = None
    party1Name: str | None = None
    party1Title: str | None = None
    party1Address: str | None = None
    party2Company: str | None = None
    party2Name: str | None = None
    party2Title: str | None = None
    party2Address: str | None = None
    modifications: str | None = None


class ChatRequest(BaseModel):
    messages: list[Message]
    fields: NdaFields


class ChatResponse(BaseModel):
    reply: str
    fields: NdaFields
