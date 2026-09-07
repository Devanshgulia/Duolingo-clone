# 🦉 Duolingo Web Application Clone

A full-stack, production-grade functional clone of the modern Duolingo web application. Built with **Next.js (TypeScript)** on the frontend, **FastAPI (Python)** on the backend, and **SQLite (SQLAlchemy)** for persistence.

The application faithfully replicates Duolingo's signature visual style, learning path progression, interactive lesson engine, and gamification mechanics (XP, daily streak, hearts depletion & refill system, and leaderboard).

---

## 🌟 Key Features

1. **Learning Path & Skill Tree**:
   - Visual Duolingo-style home path with Units, Skills, and Lesson nodes.
   - Skill status states (`completed`, `available`, `locked`) with progression locking.
   - Curved sinusoidal path layout with progress rings and crown badges.
   - Top Navigation bar tracking Daily Streak, Total XP, Hearts, and Gems.
2. **Interactive Lesson Engine**:
   - Sequential lesson runner supporting **5 distinct exercise types**:
     - 1. **Multiple Choice** (Grid card selection with keyboard shortcuts)
     - 2. **Translate / Word Bank** (Interactive tap-the-words builder)
     - 3. **Match Pairs** (Side-by-side matching grid)
     - 4. **Fill in the Blank** (Sentence context with inline highlighted slot)
     - 5. **Type the Answer** (Free-form text input with instant Enter submit)
   - Server-validated answer evaluation with accent/diacritic normalization.
   - Signature Duolingo bottom feedback bar (Green for correct, Red with correct solution for errors).
   - Hearts deduction on wrong answers & Out-Of-Hearts flow.
   - Celebratory completion screen with particle confetti (`canvas-confetti`), XP awarded summary, and streak update.
3. **Gamification & Progress Persistence**:
   - **XP Engine**: Persistent XP accumulation per completed lesson.
   - **Daily Streak**: Date-driven streak calculation logic (`last_activity_date`).
   - **Hearts Mechanics**: Depletion on error, refill via practice or gems.
   - **Leaderboard**: Seeded polyglot learner ranking.
4. **Learner Profile**:
   - Stats dashboard, streak history, and unlocked achievements.

---

## 🏗 System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js Frontend                              │
│   (App Router, TypeScript, Tailwind CSS, Lucide Icons, Canvas-Confetti) │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTP / JSON (REST API)
┌──────────────────────────────────▼─────────────────────────────────────┐
│                          FastAPI Backend                               │
│  ┌───────────────────┐  ┌────────────────────┐  ┌───────────────────┐  │
│  │   API Routers     │  │  Domain Services   │  │ Pydantic Schemas  │  │
│  │ (Path, Lesson,    │─►│ (Gamification,     │─►│ (Validation &     │  │
│  │  Profile, User)   │  │  Streak, Progress) │  │  Serialization)   │  │
│  └───────────────────┘  └─────────┬──────────┘  └───────────────────┘  │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ ORM (SQLAlchemy)
┌───────────────────────────────────▼────────────────────────────────────┐
│                           SQLite Database                              │
│         (courses, units, skills, lessons, exercises, users,            │
│          user_skill_progress, lesson_attempts, xp_logs)                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas-Confetti.
- **Backend**: Python 3.13, FastAPI, SQLAlchemy ORM, Pydantic V2, Pytest.
- **Database**: SQLite.

---

## 🗄 Database Schema Design

1. `users`: Stores learner credentials, `xp_total`, `streak_count`, `hearts`, `max_hearts`, `gems`, and `last_activity_date`.
2. `courses`: Curriculum metadata (`title`, `language_code`).
3. `units`: Units in a course (`order_index`, `title`, `description`).
4. `skills`: Skills within a unit (`title`, `icon`, `order_index`, `total_lessons`).
5. `lessons`: Lessons in a skill (`title`, `order_index`, `xp_reward`).
6. `exercises`: Unified polymorphic table (`type`, `prompt`, `correct_answer`, `options_json`).
7. `user_skill_progress`: Per-user skill progress state (`status`, `crowns`, `completed_lessons_count`).
8. `lesson_attempts`: Tracks individual lesson attempts, timestamps, XP earned, hearts lost.
9. `xp_logs`: Append-only XP log table for daily goal tracking.

---

## 🔌 API Reference

### Path & Curriculum
- `GET /api/path`: Returns curriculum units, skills, lessons, and per-user progress status.

### Lesson Engine
- `GET /api/lessons/{id}`: Returns lesson exercises.
- `POST /api/lessons/{id}/start`: Initiates a `LessonAttempt` session.
- `POST /api/lessons/{id}/answer`: Evaluates exercise submission and deducts heart if incorrect.
- `POST /api/lessons/{id}/complete`: Finalizes lesson, awards XP, updates streak, and unlocks next skill.

### Gamification & Profile
- `GET /api/user/summary`: Returns top bar stats (Streak, XP, Hearts, Gems).
- `POST /api/user/hearts/refill`: Refills user hearts to maximum.
- `GET /api/user/profile`: Returns user profile stats and achievements.
- `GET /api/leaderboard`: Returns top ranked learners by total XP.
- `POST /api/user/dev/simulate-day`: Simulates date passage for testing streak retention.

---

## 🚀 Quickstart & Local Setup

### 1. Backend Setup (FastAPI + SQLite)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run pytest suite
PYTHONPATH=. pytest tests/

# Run FastAPI server (Auto-seeds SQLite database on boot)
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎓 Interview & Architectural Rationale

1. **Single Source of Truth**: All progress, XP calculation, hearts deduction, and streak incrementing take place strictly server-side in FastAPI to prevent client-side tampering.
2. **Polymorphic Exercise Schema (`options_json`)**: Storing option arrays and word banks as JSON inside `exercises` enables one table to serve all 5 exercise types without unnecessary schema complexity.
3. **Diacritic & Accent Normalization**: Spanish text inputs are normalized using Unicode `NFKD` decomposition so minor accent typos (`días` vs `dias`) are handled gracefully.
4. **Append-Only XP Logging**: Using an `xp_logs` table allows computing daily XP goals cleanly without adding mutable date fields to the `users` table.
