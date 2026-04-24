from fastapi import APIRouter, Depends
from litellm import completion

from app.api.deps import current_user
from app.core.config import settings
from app.models.chat import ChatRequest, ChatResponse
from app.models.user import User

router = APIRouter(prefix="/chat")

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["Cerebras"]}}

SYSTEM_PROMPT = """You are a legal assistant helping users complete a Mutual Non-Disclosure Agreement (NDA).
Gather the following fields through natural, friendly conversation:

- purpose: How confidential information may be used
- effectiveDate: Agreement start date (YYYY-MM-DD format)
- mndaTermType: "expires" (fixed term) or "until_terminated" (ongoing)
- mndaTermYears: Number of years as a string (only when mndaTermType is "expires")
- confidentialityType: "years" (fixed period) or "perpetuity" (forever)
- confidentialityYears: Number of years as a string (only when confidentialityType is "years")
- governingLaw: US state name
- jurisdiction: City/county and state for courts, e.g. "New Castle, DE"
- party1Company, party1Name, party1Title, party1Address: First party details
- party2Company, party2Name, party2Title, party2Address: Second party details
- modifications: Any modifications to standard NDA terms (optional, can be empty string)

Ask for a few fields at a time in a conversational way. Only include a field in your response once you have a confirmed value from the user. Never invent or assume values.

Always respond with valid JSON: {"reply": "your message", "fields": {"fieldName": "value"}}
Only include fields in "fields" that you just learned. Omit fields you do not yet know."""


@router.post("/message", response_model=ChatResponse)
def message(body: ChatRequest, user: User = Depends(current_user)):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages += [{"role": m.role, "content": m.content} for m in body.messages]

    response = completion(
        model=MODEL,
        messages=messages,
        response_format=ChatResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
        api_key=settings.openrouter_api_key,
    )
    return ChatResponse.model_validate_json(response.choices[0].message.content)
