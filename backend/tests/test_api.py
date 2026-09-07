import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import Base, engine
from app.seed import seed_database

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    seed_database()

def test_health():
    with TestClient(app) as client:
        res = client.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"

def test_get_path():
    with TestClient(app) as client:
        res = client.get("/api/path")
        assert res.status_code == 200
        data = res.json()
        assert "units" in data
        assert "user_summary" in data
        assert len(data["units"]) > 0
        assert len(data["units"][0]["chests"]) > 0

def test_user_summary():
    with TestClient(app) as client:
        res = client.get("/api/user/summary")
        assert res.status_code == 200
        data = res.json()
        assert data["username"] == "learner"
        assert "xp_total" in data
        assert "streak_freeze_count" in data

def test_leaderboard():
    with TestClient(app) as client:
        res = client.get("/api/leaderboard")
        assert res.status_code == 200
        data = res.json()
        assert len(data) >= 1

def test_guidebook():
    with TestClient(app) as client:
        res = client.get("/api/guidebooks/unit/1")
        assert res.status_code == 200
        data = res.json()
        assert "key_phrases" in data
        assert len(data["key_phrases"]) > 0
        assert "grammar_tips" in data

def test_quests_flow():
    with TestClient(app) as client:
        res = client.get("/api/quests")
        assert res.status_code == 200
        quests = res.json()
        assert len(quests) >= 1
        completed_q = next((q for q in quests if q["is_completed"] and not q["is_claimed"]), None)
        if completed_q:
            claim_res = client.post(f"/api/quests/{completed_q['id']}/claim")
            assert claim_res.status_code == 200
            assert claim_res.json()["success"] is True

def test_shop_flow():
    with TestClient(app) as client:
        res = client.get("/api/shop")
        assert res.status_code == 200
        items = res.json()
        assert len(items) >= 3

        # Purchase streak freeze
        buy_res = client.post("/api/shop/purchase", json={"item_id": "streak_freeze"})
        assert buy_res.status_code == 200
        assert buy_res.json()["success"] is True

def test_practice_flow():
    with TestClient(app) as client:
        res = client.post("/api/practice/start")
        assert res.status_code == 200
        data = res.json()
        assert "attempt_id" in data
        assert len(data["lesson"]["exercises"]) > 0

        comp_res = client.post("/api/practice/complete", json={"attempt_id": data["attempt_id"]})
        assert comp_res.status_code == 200
        assert comp_res.json()["xp_earned"] == 10

def test_lesson_flow():
    with TestClient(app) as client:
        # Start lesson 1
        res = client.post("/api/lessons/1/start")
        assert res.status_code == 200
        data = res.json()
        attempt_id = data["attempt_id"]
        assert "lesson" in data

        # Submit answer to exercise 1
        exercise = data["lesson"]["exercises"][0]
        ans_res = client.post("/api/lessons/1/answer", json={
            "attempt_id": attempt_id,
            "exercise_id": exercise["id"],
            "user_answer": "el café"
        })
        assert ans_res.status_code == 200
        assert ans_res.json()["is_correct"] is True

        # Complete lesson
        comp_res = client.post("/api/lessons/1/complete", json={
            "attempt_id": attempt_id
        })
        assert comp_res.status_code == 200
        assert comp_res.json()["xp_earned"] > 0
