from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days
    db_path: str = "/data/prelegal.db"
    openrouter_api_key: str = ""

    model_config = {"env_file": ".env"}


settings = Settings()
