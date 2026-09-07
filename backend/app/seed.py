import json
from datetime import datetime, date, timedelta, timezone
from app.db import engine, SessionLocal, Base
from app.models import (
    User, Course, Unit, Skill, Lesson, Exercise, UserSkillProgress,
    XpLog, LessonAttempt, Guidebook, Quest, UserQuestProgress,
    Achievement, UserAchievement, ChestReward, UserChestClaim
)

from app.auth import hash_password

def seed_database():
    db = SessionLocal()
    try:
        # Check if database has already been seeded
        course_count = db.query(Course).count()
        if course_count > 0:
            print("Database already contains data. Skipping full seed.")
            return

        print("Initializing and seeding database...")
        Base.metadata.create_all(bind=engine)

        today = date.today()

        # 1. Create Main Demo Learner (Fresh start state)
        demo_user = User(
            username="learner",
            email="learner@duolingo.clone",
            password_hash=hash_password("password"),
            display_name="",
            avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=duo_learner&backgroundColor=58cc02",
            xp_total=0,
            streak_count=0,
            hearts=5,
            max_hearts=5,
            gems=500,
            daily_goal_xp=30,
            streak_freeze_count=1,
            is_super=False,
            league="Bronze",
            last_activity_date=None,
            outfit="classic"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        # 2. Create Seeded Leaderboard Users
        leaderboard_users = [
            {"username": "sofia_polyglot", "display_name": "Sofia R.", "xp_total": 450, "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&backgroundColor=b6e3f4"},
            {"username": "marco_lingo", "display_name": "Marco V.", "xp_total": 390, "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco&backgroundColor=ffdfbf"},
            {"username": "elena_es", "display_name": "Elena Torres", "xp_total": 310, "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=d1d4f9"},
            {"username": "lucas_b", "display_name": "Lucas Berg", "xp_total": 210, "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas&backgroundColor=ffd5dc"},
            {"username": "chloe_paris", "display_name": "Chloé M.", "xp_total": 180, "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe&backgroundColor=c0aede"},
            {"username": "kenji_t", "display_name": "Kenji Sato", "xp_total": 150, "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji&backgroundColor=b6e3f4"},
            {"username": "maya_quest", "display_name": "Maya Lin", "xp_total": 110, "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya&backgroundColor=ffdfbf"},
            {"username": "alex_d", "display_name": "Alex Dupont", "xp_total": 70, "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=d1d4f9"},
        ]
        for u in leaderboard_users:
            seeded_u = User(
                username=u["username"],
                display_name=u["display_name"],
                avatar_url=u["avatar"],
                xp_total=u["xp_total"],
                streak_count=max(2, u["xp_total"] // 50),
                hearts=5,
                gems=300,
                league="Bronze",
                last_activity_date=today
            )
            db.add(seeded_u)
        db.commit()

        # 3. Create Daily Quests (Matching Screenshot 10 XP quest)
        q1 = Quest(
            title="Earn 10 XP",
            description="Complete lessons to earn XP and strengthen your skills.",
            quest_type="earn_xp",
            target_amount=10,
            reward_gems=15,
            reward_xp=10,
            icon="zap"
        )
        q2 = Quest(
            title="Complete 2 Lessons",
            description="Finish 2 lesson sessions today.",
            quest_type="complete_lessons",
            target_amount=2,
            reward_gems=25,
            reward_xp=15,
            icon="book-open"
        )
        q3 = Quest(
            title="Score 90% or Higher",
            description="Complete a lesson with 90% or higher accuracy.",
            quest_type="perfect_lesson",
            target_amount=1,
            reward_gems=20,
            reward_xp=10,
            icon="target"
        )
        db.add_all([q1, q2, q3])
        db.commit()
        db.refresh(q1)
        db.refresh(q2)
        db.refresh(q3)

        # Add quest progress for demo user (Fresh 0/10 progress)
        db.add_all([
            UserQuestProgress(user_id=demo_user.id, quest_id=q1.id, current_amount=0, is_completed=False, is_claimed=False),
            UserQuestProgress(user_id=demo_user.id, quest_id=q2.id, current_amount=0, is_completed=False, is_claimed=False),
            UserQuestProgress(user_id=demo_user.id, quest_id=q3.id, current_amount=0, is_completed=False, is_claimed=False),
        ])

        # 4. Achievements
        ach_wildfire = Achievement(
            code="wildfire",
            title="Wildfire",
            description="Reach a streak milestone",
            max_level=5,
            icon="flame",
            tiers_json=json.dumps([
                {"level": 1, "target": 3, "reward_gems": 20},
                {"level": 2, "target": 7, "reward_gems": 50},
                {"level": 3, "target": 14, "reward_gems": 100},
                {"level": 4, "target": 30, "reward_gems": 200},
                {"level": 5, "target": 50, "reward_gems": 500},
            ])
        )
        ach_sage = Achievement(
            code="sage",
            title="Sage",
            description="Earn total XP milestones",
            max_level=5,
            icon="zap",
            tiers_json=json.dumps([
                {"level": 1, "target": 100, "reward_gems": 20},
                {"level": 2, "target": 250, "reward_gems": 50},
                {"level": 3, "target": 500, "reward_gems": 100},
                {"level": 4, "target": 1000, "reward_gems": 200},
                {"level": 5, "target": 2500, "reward_gems": 500},
            ])
        )
        ach_scholar = Achievement(
            code="scholar",
            title="Scholar",
            description="Complete skill crowns",
            max_level=3,
            icon="award",
            tiers_json=json.dumps([
                {"level": 1, "target": 1, "reward_gems": 30},
                {"level": 2, "target": 5, "reward_gems": 75},
                {"level": 3, "target": 10, "reward_gems": 150},
            ])
        )
        ach_champion = Achievement(
            code="champion",
            title="Champion",
            description="Place top 3 in a leaderboard league",
            max_level=1,
            icon="trophy",
            tiers_json=json.dumps([
                {"level": 1, "target": 1, "reward_gems": 100}
            ])
        )
        db.add_all([ach_wildfire, ach_sage, ach_scholar, ach_champion])
        db.commit()

        db.add_all([
            UserAchievement(user_id=demo_user.id, achievement_id=ach_wildfire.id, current_level=0, current_progress=0),
            UserAchievement(user_id=demo_user.id, achievement_id=ach_sage.id, current_level=0, current_progress=0),
            UserAchievement(user_id=demo_user.id, achievement_id=ach_scholar.id, current_level=0, current_progress=0),
            UserAchievement(user_id=demo_user.id, achievement_id=ach_champion.id, current_level=0, current_progress=0),
        ])

        # -------------------------------------------------------------
        # 5. COURSES: SPANISH ONLY
        # -------------------------------------------------------------
        spanish_course = Course(
            title="Spanish",
            language_code="es",
            icon_code="es"
        )
        db.add(spanish_course)
        db.commit()
        db.refresh(spanish_course)
        demo_user.active_course_id = spanish_course.id

        # -------------------------------------------------------------
        # UNIT 1: Order at a café (Green Theme - Screenshot 4)
        # -------------------------------------------------------------
        unit1_es = Unit(
            course_id=spanish_course.id,
            title="Order at a café",
            description="Order food, drinks, coffee, and handle café conversations.",
            order_index=1,
            color_theme="green"
        )
        # UNIT 2: Greet people and say goodbye (Purple Theme - Screenshot 5)
        unit2_es = Unit(
            course_id=spanish_course.id,
            title="Greet people and say goodbye",
            description="Introduce yourself, say where you are from, and make friends.",
            order_index=2,
            color_theme="purple"
        )
        # UNIT 3: Say where you are from (Upcoming Timeline - Screenshot 5)
        unit3_es = Unit(
            course_id=spanish_course.id,
            title="Say where you are from",
            description="Talk about countries, cities, and travel directions.",
            order_index=3,
            color_theme="teal"
        )
        db.add_all([unit1_es, unit2_es, unit3_es])
        db.commit()
        db.refresh(unit1_es)
        db.refresh(unit2_es)
        db.refresh(unit3_es)

        # Guidebooks
        gb1 = Guidebook(
            unit_id=unit1_es.id,
            title="Unit 1 Guidebook: Ordering at a Café",
            summary="Master ordering coffee, tea, pastries, asking for the bill, and using polite phrases.",
            key_phrases_json=json.dumps([
                {"phrase": "Un café con leche, por favor", "translation": "A coffee with milk, please", "audio_text": "Un café con leche, por favor", "context": "Ordering coffee"},
                {"phrase": "¿Tiene té caliente?", "translation": "Do you have hot tea?", "audio_text": "¿Tiene té caliente?", "context": "Asking about drinks"},
                {"phrase": "Una mesa para dos", "translation": "A table for two", "audio_text": "Una mesa para dos", "context": "Entering café"},
                {"phrase": "La cuenta, por favor", "translation": "The check, please", "audio_text": "La cuenta, por favor", "context": "Paying the bill"},
                {"phrase": "Muchas gracias", "translation": "Thank you very much", "audio_text": "Muchas gracias", "context": "Polite expression"}
            ]),
            grammar_tips_json=json.dumps([
                {
                    "title": "Articles: Un vs. Una",
                    "explanation": "Use 'un' with masculine nouns (un café, un vaso) and 'una' with feminine nouns (una mesa, una taza).",
                    "examples": [
                        {"es": "Un café con azúcar.", "en": "A coffee with sugar."},
                        {"es": "Una taza de té.", "en": "A cup of tea."}
                    ]
                },
                {
                    "title": "Using 'Por favor'",
                    "explanation": "Always add 'por favor' at the end of requests in Spanish when ordering food and drinks.",
                    "examples": [
                        {"es": "Agua, por favor.", "en": "Water, please."}
                    ]
                }
            ])
        )

        gb2 = Guidebook(
            unit_id=unit2_es.id,
            title="Unit 2 Guidebook: Greetings & Introductions",
            summary="Learn how to introduce yourself, ask how someone is doing, and say goodbye.",
            key_phrases_json=json.dumps([
                {"phrase": "¡Hola! ¿Cómo estás?", "translation": "Hello! How are you?", "audio_text": "¡Hola! ¿Cómo estás?"},
                {"phrase": "Mucho gusto", "translation": "Nice to meet you", "audio_text": "Mucho gusto"},
                {"phrase": "Me llamo Maria", "translation": "My name is Maria", "audio_text": "Me llamo Maria"},
                {"phrase": "Hasta luego", "translation": "See you later", "audio_text": "Hasta luego"}
            ]),
            grammar_tips_json=json.dumps([
                {
                    "title": "Verb 'Ser' (To Be)",
                    "explanation": "Use 'Yo soy' to state who you are or where you are from (Yo soy de España).",
                    "examples": [
                        {"es": "Yo soy un estudiante.", "en": "I am a student."}
                    ]
                }
            ])
        )
        db.add_all([gb1, gb2])
        db.commit()

        # Chest Rewards
        chest1 = ChestReward(unit_id=unit1_es.id, order_index=1, reward_gems=35, reward_xp=20)
        chest2 = ChestReward(unit_id=unit2_es.id, order_index=2, reward_gems=50, reward_xp=30)
        db.add_all([chest1, chest2])
        db.commit()

        # =============================================================
        # 5 WORKING PLATFORMS FOR UNIT 1 (ORDER AT A CAFÉ)
        # =============================================================

        # PLATFORM 1: Café Basics (Skill 1)
        skill_cafe = Skill(unit_id=unit1_es.id, title="Café Basics", icon="coffee", order_index=1, total_lessons=3)
        # PLATFORM 2: Greetings & Politeness (Skill 2)
        skill_greetings = Skill(unit_id=unit1_es.id, title="Greetings & Polite Words", icon="message-circle", order_index=2, total_lessons=3)
        # PLATFORM 3: Food & Snacks (Skill 3)
        skill_food = Skill(unit_id=unit1_es.id, title="Food & Snacks", icon="utensils", order_index=3, total_lessons=3)
        # PLATFORM 4: Audio & Listening (Skill 4)
        skill_listening = Skill(unit_id=unit1_es.id, title="Listening Practice", icon="headphones", order_index=4, total_lessons=2)
        # PLATFORM 5: Unit 1 Trophy Mastery (Skill 5)
        skill_trophy = Skill(unit_id=unit1_es.id, title="Unit 1 Trophy Challenge", icon="trophy", order_index=5, total_lessons=1)

        db.add_all([skill_cafe, skill_greetings, skill_food, skill_listening, skill_trophy])
        db.commit()
        db.refresh(skill_cafe)
        db.refresh(skill_greetings)
        db.refresh(skill_food)
        db.refresh(skill_listening)
        db.refresh(skill_trophy)

        # -------------------------------------------------------------
        # LESSONS & EXERCISES FOR PLATFORM 1: Café Basics
        # -------------------------------------------------------------
        l1_cafe = Lesson(skill_id=skill_cafe.id, title="Coffee & Tea", order_index=1, xp_reward=10)
        l2_cafe = Lesson(skill_id=skill_cafe.id, title="Milk & Water", order_index=2, xp_reward=15)
        l3_cafe = Lesson(skill_id=skill_cafe.id, title="Sugar & Cups", order_index=3, xp_reward=15)
        db.add_all([l1_cafe, l2_cafe, l3_cafe])
        db.commit()
        db.refresh(l1_cafe)
        db.refresh(l2_cafe)
        db.refresh(l3_cafe)

        # Exercises for Lesson 1 (All 5 types)
        db.add_all([
            Exercise(
                lesson_id=l1_cafe.id,
                type="multiple_choice",
                prompt="Which one of these is 'coffee'?",
                correct_answer="el café",
                options_json=json.dumps([
                    {"id": "1", "text": "el café", "subtext": "the coffee"},
                    {"id": "2", "text": "el té", "subtext": "the tea"},
                    {"id": "3", "text": "el agua", "subtext": "the water"}
                ]),
                order_index=1,
                hint="Look for the accent on 'é'"
            ),
            Exercise(
                lesson_id=l1_cafe.id,
                type="translate",
                prompt="Translate: 'A coffee, please'",
                correct_answer="Un café por favor",
                options_json=json.dumps(["Un", "café", "por", "favor", "té", "con", "leche", "gracias"]),
                order_index=2
            ),
            Exercise(
                lesson_id=l1_cafe.id,
                type="match_pairs",
                prompt="Match the café words",
                correct_answer=json.dumps({"Café": "Coffee", "Té": "Tea", "Agua": "Water", "Por favor": "Please", "Gracias": "Thank you"}),
                options_json=json.dumps({
                    "left": ["Café", "Té", "Agua", "Por favor", "Gracias"],
                    "right": ["Tea", "Coffee", "Please", "Thank you", "Water"],
                    "pairs": {"Café": "Coffee", "Té": "Tea", "Agua": "Water", "Por favor": "Please", "Gracias": "Thank you"}
                }),
                order_index=3
            ),
            Exercise(
                lesson_id=l1_cafe.id,
                type="fill_blank",
                prompt="Yo quiero un _____ caliente.",
                correct_answer="café",
                options_json=json.dumps(["café", "mesa", "niño", "manzana"]),
                order_index=4
            ),
            Exercise(
                lesson_id=l1_cafe.id,
                type="type_answer",
                prompt="Type 'tea' in Spanish:",
                correct_answer="té",
                options_json=json.dumps([]),
                order_index=5
            )
        ])

        # Exercises for Lesson 2
        db.add_all([
            Exercise(
                lesson_id=l2_cafe.id,
                type="multiple_choice",
                prompt="Which one of these is 'milk'?",
                correct_answer="la leche",
                options_json=json.dumps([
                    {"id": "1", "text": "la leche", "subtext": "the milk"},
                    {"id": "2", "text": "el agua", "subtext": "the water"},
                    {"id": "3", "text": "el pan", "subtext": "the bread"}
                ]),
                order_index=1
            ),
            Exercise(
                lesson_id=l2_cafe.id,
                type="translate",
                prompt="Translate: 'Coffee with milk'",
                correct_answer="Café con leche",
                options_json=json.dumps(["Café", "con", "leche", "sin", "té", "agua", "por"]),
                order_index=2
            ),
            Exercise(
                lesson_id=l2_cafe.id,
                type="fill_blank",
                prompt="Un vaso de _____ fría, por favor.",
                correct_answer="agua",
                options_json=json.dumps(["agua", "café", "mesa", "libro"]),
                order_index=3
            ),
            Exercise(
                lesson_id=l2_cafe.id,
                type="type_answer",
                prompt="Type 'water' in Spanish:",
                correct_answer="agua",
                options_json=json.dumps([]),
                order_index=4
            )
        ])

        # Exercises for Lesson 3
        db.add_all([
            Exercise(
                lesson_id=l3_cafe.id,
                type="translate",
                prompt="Translate: 'A coffee with sugar, please'",
                correct_answer="Un café con azúcar por favor",
                options_json=json.dumps(["Un", "café", "con", "azúcar", "por", "favor", "leche", "té"]),
                order_index=1
            ),
            Exercise(
                lesson_id=l3_cafe.id,
                type="match_pairs",
                prompt="Match the café items",
                correct_answer=json.dumps({"Azúcar": "Sugar", "Vaso": "Glass", "Taza": "Cup", "Leche": "Milk"}),
                options_json=json.dumps({
                    "left": ["Azúcar", "Vaso", "Taza", "Leche"],
                    "right": ["Cup", "Sugar", "Milk", "Glass"],
                    "pairs": {"Azúcar": "Sugar", "Vaso": "Glass", "Taza": "Cup", "Leche": "Milk"}
                }),
                order_index=2
            ),
            Exercise(
                lesson_id=l3_cafe.id,
                type="type_answer",
                prompt="Type 'please' in Spanish:",
                correct_answer="por favor",
                options_json=json.dumps([]),
                order_index=3
            )
        ])

        # -------------------------------------------------------------
        # LESSONS & EXERCISES FOR PLATFORM 2: Greetings & Polite Words
        # -------------------------------------------------------------
        l1_greet = Lesson(skill_id=skill_greetings.id, title="Hello & Goodbye", order_index=1, xp_reward=10)
        l2_greet = Lesson(skill_id=skill_greetings.id, title="Good Morning & Night", order_index=2, xp_reward=15)
        l3_greet = Lesson(skill_id=skill_greetings.id, title="Polite Expressions", order_index=3, xp_reward=15)
        db.add_all([l1_greet, l2_greet, l3_greet])
        db.commit()
        db.refresh(l1_greet)

        db.add_all([
            Exercise(
                lesson_id=l1_greet.id,
                type="multiple_choice",
                prompt="Which one means 'Good morning'?",
                correct_answer="Buenos días",
                options_json=json.dumps([
                    {"id": "1", "text": "Buenos días", "subtext": "Good morning"},
                    {"id": "2", "text": "Buenas noches", "subtext": "Good night"},
                    {"id": "3", "text": "Adiós", "subtext": "Goodbye"}
                ]),
                order_index=1
            ),
            Exercise(
                lesson_id=l1_greet.id,
                type="translate",
                prompt="Translate: 'Hello, good morning!'",
                correct_answer="¡Hola, buenos días!",
                options_json=json.dumps(["¡Hola,", "buenos", "días!", "buenas", "tardes", "adiós"]),
                order_index=2
            ),
            Exercise(
                lesson_id=l1_greet.id,
                type="match_pairs",
                prompt="Match the greetings",
                correct_answer=json.dumps({"Hola": "Hello", "Adiós": "Goodbye", "Buenos días": "Good morning", "Buenas noches": "Good night"}),
                options_json=json.dumps({
                    "left": ["Hola", "Adiós", "Buenos días", "Buenas noches"],
                    "right": ["Goodbye", "Hello", "Good night", "Good morning"],
                    "pairs": {"Hola": "Hello", "Adiós": "Goodbye", "Buenos días": "Good morning", "Buenas noches": "Good night"}
                }),
                order_index=3
            ),
            Exercise(
                lesson_id=l1_greet.id,
                type="type_answer",
                prompt="Type 'Hello' in Spanish:",
                correct_answer="hola",
                options_json=json.dumps([]),
                order_index=4
            )
        ])

        # -------------------------------------------------------------
        # LESSONS & EXERCISES FOR PLATFORM 3: Food & Snacks
        # -------------------------------------------------------------
        l1_food = Lesson(skill_id=skill_food.id, title="Bread & Sandwiches", order_index=1, xp_reward=10)
        l2_food = Lesson(skill_id=skill_food.id, title="Cheese & Apples", order_index=2, xp_reward=15)
        l3_food = Lesson(skill_id=skill_food.id, title="Ordering at the Table", order_index=3, xp_reward=15)
        db.add_all([l1_food, l2_food, l3_food])
        db.commit()
        db.refresh(l1_food)

        db.add_all([
            Exercise(
                lesson_id=l1_food.id,
                type="multiple_choice",
                prompt="Which one is 'the sandwich'?",
                correct_answer="el sándwich",
                options_json=json.dumps([
                    {"id": "1", "text": "el sándwich", "subtext": "the sandwich"},
                    {"id": "2", "text": "el queso", "subtext": "the cheese"},
                    {"id": "3", "text": "la manzana", "subtext": "the apple"}
                ]),
                order_index=1
            ),
            Exercise(
                lesson_id=l1_food.id,
                type="translate",
                prompt="Translate: 'I want a sandwich with cheese'",
                correct_answer="Quiero un sándwich con queso",
                options_json=json.dumps(["Quiero", "un", "sándwich", "con", "queso", "pan", "sin", "leche"]),
                order_index=2
            ),
            Exercise(
                lesson_id=l1_food.id,
                type="match_pairs",
                prompt="Match the food items",
                correct_answer=json.dumps({"Pan": "Bread", "Queso": "Cheese", "Sándwich": "Sandwich", "Manzana": "Apple"}),
                options_json=json.dumps({
                    "left": ["Pan", "Queso", "Sándwich", "Manzana"],
                    "right": ["Cheese", "Bread", "Apple", "Sandwich"],
                    "pairs": {"Pan": "Bread", "Queso": "Cheese", "Sándwich": "Sandwich", "Manzana": "Apple"}
                }),
                order_index=3
            ),
            Exercise(
                lesson_id=l1_food.id,
                type="type_answer",
                prompt="Type 'bread' in Spanish:",
                correct_answer="pan",
                options_json=json.dumps([]),
                order_index=4
            )
        ])

        # -------------------------------------------------------------
        # LESSONS & EXERCISES FOR PLATFORM 4: Listening & Audio Phrases
        # -------------------------------------------------------------
        l1_audio = Lesson(skill_id=skill_listening.id, title="Audio Café Ordering", order_index=1, xp_reward=15)
        l2_audio = Lesson(skill_id=skill_listening.id, title="Speed Listening Match", order_index=2, xp_reward=15)
        db.add_all([l1_audio, l2_audio])
        db.commit()
        db.refresh(l1_audio)

        db.add_all([
            Exercise(
                lesson_id=l1_audio.id,
                type="translate",
                prompt="Translate: 'Una mesa para dos, por favor'",
                correct_answer="A table for two please",
                options_json=json.dumps(["A", "table", "for", "two", "please", "coffee", "with", "milk"]),
                order_index=1
            ),
            Exercise(
                lesson_id=l1_audio.id,
                type="fill_blank",
                prompt="La cuenta, por _____.",
                correct_answer="favor",
                options_json=json.dumps(["favor", "gracias", "leche", "café"]),
                order_index=2
            ),
            Exercise(
                lesson_id=l1_audio.id,
                type="match_pairs",
                prompt="Match the spoken phrases",
                correct_answer=json.dumps({"La cuenta": "The check", "Mesa": "Table", "Caliente": "Hot", "Frío": "Cold"}),
                options_json=json.dumps({
                    "left": ["La cuenta", "Mesa", "Caliente", "Frío"],
                    "right": ["Table", "The check", "Cold", "Hot"],
                    "pairs": {"La cuenta": "The check", "Mesa": "Table", "Caliente": "Hot", "Frío": "Cold"}
                }),
                order_index=3
            )
        ])

        # -------------------------------------------------------------
        # LESSONS & EXERCISES FOR PLATFORM 5: Unit 1 Trophy Mastery Challenge
        # -------------------------------------------------------------
        l1_trophy = Lesson(skill_id=skill_trophy.id, title="Unit 1 Final Challenge", order_index=1, xp_reward=25)
        db.add(l1_trophy)
        db.commit()
        db.refresh(l1_trophy)

        db.add_all([
            Exercise(
                lesson_id=l1_trophy.id,
                type="multiple_choice",
                prompt="How do you ask for a cup of coffee with milk and sugar?",
                correct_answer="Un café con leche y azúcar, por favor",
                options_json=json.dumps([
                    {"id": "1", "text": "Un café con leche y azúcar, por favor", "subtext": "Coffee with milk and sugar, please"},
                    {"id": "2", "text": "Un té frío sin leche", "subtext": "Cold tea without milk"},
                    {"id": "3", "text": "Una manzana roja", "subtext": "A red apple"}
                ]),
                order_index=1
            ),
            Exercise(
                lesson_id=l1_trophy.id,
                type="translate",
                prompt="Translate: 'Hello, a table for two and a coffee, please'",
                correct_answer="Hola una mesa para dos y un café por favor",
                options_json=json.dumps(["Hola", "una", "mesa", "para", "dos", "y", "un", "café", "por", "favor", "té", "leche"]),
                order_index=2
            ),
            Exercise(
                lesson_id=l1_trophy.id,
                type="match_pairs",
                prompt="Mastery Match: Connect all terms",
                correct_answer=json.dumps({"Café": "Coffee", "Leche": "Milk", "Azúcar": "Sugar", "Cuenta": "Check", "Mesa": "Table"}),
                options_json=json.dumps({
                    "left": ["Café", "Leche", "Azúcar", "Cuenta", "Mesa"],
                    "right": ["Milk", "Coffee", "Check", "Sugar", "Table"],
                    "pairs": {"Café": "Coffee", "Leche": "Milk", "Azúcar": "Sugar", "Cuenta": "Check", "Mesa": "Table"}
                }),
                order_index=3
            ),
            Exercise(
                lesson_id=l1_trophy.id,
                type="type_answer",
                prompt="Type 'Thank you very much' in Spanish:",
                correct_answer="muchas gracias",
                options_json=json.dumps([]),
                order_index=4
            )
        ])

        # =============================================================
        # UNIT 2 SKILLS (Greet people and say goodbye)
        # =============================================================
        u2_s1 = Skill(unit_id=unit2_es.id, title="Introductions", icon="user", order_index=1, total_lessons=2)
        u2_s2 = Skill(unit_id=unit2_es.id, title="Asking Names", icon="message-square", order_index=2, total_lessons=2)
        u2_s3 = Skill(unit_id=unit2_es.id, title="Daily Talk", icon="headphones", order_index=3, total_lessons=2)
        u2_s4 = Skill(unit_id=unit2_es.id, title="Unit 2 Trophy", icon="trophy", order_index=4, total_lessons=1)
        db.add_all([u2_s1, u2_s2, u2_s3, u2_s4])
        db.commit()
        db.refresh(u2_s1)

        u2_l1 = Lesson(skill_id=u2_s1.id, title="My Name Is...", order_index=1, xp_reward=10)
        db.add(u2_l1)
        db.commit()
        db.refresh(u2_l1)
        db.add_all([
            Exercise(
                lesson_id=u2_l1.id,
                type="translate",
                prompt="Translate: 'Hello, my name is Maria'",
                correct_answer="Hola me llamo Maria",
                options_json=json.dumps(["Hola", "me", "llamo", "Maria", "soy", "de", "España"]),
                order_index=1
            )
        ])

        # =============================================================
        # UNIT 3 SKILLS (Say where you are from - Upcoming)
        # =============================================================
        u3_s1 = Skill(unit_id=unit3_es.id, title="Countries & Cities", icon="globe", order_index=1, total_lessons=2)
        u3_s2 = Skill(unit_id=unit3_es.id, title="Travel & Places", icon="map-pin", order_index=2, total_lessons=2)
        db.add_all([u3_s1, u3_s2])
        db.commit()

        # =============================================================
        # 6. INITIAL USER PROGRESS (FRESH START: Only Skill 1 Available, 0 Done)
        # =============================================================
        prog_cafe = UserSkillProgress(
            user_id=demo_user.id,
            skill_id=skill_cafe.id,
            status="available",
            crowns=0,
            completed_lessons_count=0
        )
        prog_greet = UserSkillProgress(user_id=demo_user.id, skill_id=skill_greetings.id, status="locked", crowns=0, completed_lessons_count=0)
        prog_food = UserSkillProgress(user_id=demo_user.id, skill_id=skill_food.id, status="locked", crowns=0, completed_lessons_count=0)
        prog_listen = UserSkillProgress(user_id=demo_user.id, skill_id=skill_listening.id, status="locked", crowns=0, completed_lessons_count=0)
        prog_trophy = UserSkillProgress(user_id=demo_user.id, skill_id=skill_trophy.id, status="locked", crowns=0, completed_lessons_count=0)

        prog_u2_1 = UserSkillProgress(user_id=demo_user.id, skill_id=u2_s1.id, status="locked", crowns=0, completed_lessons_count=0)
        prog_u2_2 = UserSkillProgress(user_id=demo_user.id, skill_id=u2_s2.id, status="locked", crowns=0, completed_lessons_count=0)
        prog_u2_3 = UserSkillProgress(user_id=demo_user.id, skill_id=u2_s3.id, status="locked", crowns=0, completed_lessons_count=0)
        prog_u2_4 = UserSkillProgress(user_id=demo_user.id, skill_id=u2_s4.id, status="locked", crowns=0, completed_lessons_count=0)

        prog_u3_1 = UserSkillProgress(user_id=demo_user.id, skill_id=u3_s1.id, status="locked", crowns=0, completed_lessons_count=0)
        prog_u3_2 = UserSkillProgress(user_id=demo_user.id, skill_id=u3_s2.id, status="locked", crowns=0, completed_lessons_count=0)

        db.add_all([
            prog_cafe, prog_greet, prog_food, prog_listen, prog_trophy,
            prog_u2_1, prog_u2_2, prog_u2_3, prog_u2_4,
            prog_u3_1, prog_u3_2
        ])
        db.commit()
        print("Database freshly seeded with 5 full platforms in Unit 1 and fresh progressive unlocking!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
