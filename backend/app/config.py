import os

class Settings:
    PROJECT_NAME: str = "Duolingo Clone API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./duolingo.db")
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
