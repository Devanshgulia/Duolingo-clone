from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db import Base, engine
from app.seed import seed_database
from app.routers import auth, path, lesson, user, leaderboard, guidebook, quest, shop, chest, practice

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure DB tables exist & seed data
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend REST API for modern Duolingo Web Application Clone",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router)
app.include_router(path.router)
app.include_router(lesson.router)
app.include_router(user.router)
app.include_router(leaderboard.router)
app.include_router(guidebook.router)
app.include_router(quest.router)
app.include_router(shop.router)
app.include_router(chest.router)
app.include_router(practice.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "project": settings.PROJECT_NAME}
