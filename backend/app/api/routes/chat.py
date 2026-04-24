from fastapi import APIRouter, Depends, HTTPException
from litellm import completion

from app.api.deps import current_user
from app.core.config import settings
from app.core.document_configs import DOCUMENT_CONFIGS
from app.models.chat import ChatRequest, ChatResponse
from app.models.user import User

router = APIRouter(prefix="/chat")

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["Cerebras"]}}


@router.post("/message", response_model=ChatResponse)
def message(body: ChatRequest, user: User = Depends(current_user)):
    config = DOCUMENT_CONFIGS.get(body.document_type)
    if not config:
        raise HTTPException(status_code=400, detail=f"Unknown document type: {body.document_type}")

    messages = [{"role": "system", "content": config.system_prompt}]
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
