export interface UserSummary {
  id: number;
  username: string;
  display_name: string;
  avatar_url?: string;
  xp_total: number;
  streak_count: number;
  hearts: number;
  max_hearts: number;
  gems: number;
  daily_goal_xp: number;
  today_xp: number;
  streak_freeze_count: number;
  double_xp_active: boolean;
  is_super: boolean;
  league: string;
  outfit: string;
  last_activity_date?: string;
  active_course_id?: number;
  active_dates?: string[];
}

export interface CourseOverview {
  id: number;
  title: string;
  language_code: string;
  icon_code: string;
}

export interface LessonOverview {
  id: number;
  title: string;
  order_index: number;
  xp_reward: number;
  is_completed: boolean;
}

export interface SkillNode {
  id: number;
  unit_id: number;
  title: string;
  icon: string;
  order_index: number;
  total_lessons: number;
  status: 'locked' | 'available' | 'completed';
  crowns: number;
  completed_lessons_count: number;
  lessons: LessonOverview[];
}

export interface ChestReward {
  id: number;
  unit_id: number;
  order_index: number;
  reward_gems: number;
  reward_xp: number;
  is_unlocked: boolean;
  is_claimed: boolean;
}

export interface Unit {
  id: number;
  title: string;
  description?: string;
  order_index: number;
  color_theme: 'green' | 'blue' | 'purple' | 'yellow' | 'orange' | 'teal';
  has_guidebook: boolean;
  skills: SkillNode[];
  chests: ChestReward[];
}

export interface PathData {
  course_id: number;
  course_title: string;
  language_code: string;
  units: Unit[];
  user_summary: UserSummary;
  available_courses: CourseOverview[];
}

export interface KeyPhrase {
  phrase: string;
  translation: string;
  audio_text?: string;
  context?: string;
}

export interface GrammarTip {
  title: string;
  explanation: string;
  examples: { es?: string; fr?: string; de?: string; en: string }[];
}

export interface GuidebookData {
  id: number;
  unit_id: number;
  unit_title: string;
  title: string;
  summary?: string;
  key_phrases: KeyPhrase[];
  grammar_tips: GrammarTip[];
}

export interface Exercise {
  id: number;
  lesson_id: number;
  type: 'multiple_choice' | 'translate' | 'match_pairs' | 'fill_blank' | 'type_answer';
  prompt: string;
  options_json?: string;
  order_index: number;
  hint?: string;
}

export interface LessonDetail {
  id: number;
  skill_id: number;
  skill_title: string;
  title: string;
  xp_reward: number;
  exercises: Exercise[];
}

export interface StartLessonResponse {
  attempt_id: number;
  lesson: LessonDetail;
  hearts_remaining: number;
}

export interface AnswerResult {
  is_correct: boolean;
  correct_answer: string;
  explanation?: string;
  hearts_remaining: number;
  out_of_hearts: boolean;
}

export interface CompleteLessonResult {
  xp_earned: number;
  total_xp: number;
  streak_count: number;
  streak_incremented: boolean;
  crowns_awarded: number;
  next_skill_unlocked: boolean;
  hearts_remaining: number;
  quests_updated?: any[];
}

export interface LeaderboardEntry {
  user_id: number;
  username: string;
  display_name: string;
  avatar_url?: string;
  xp_total: number;
  league: string;
  rank: number;
  is_current_user: boolean;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  quest_type: string;
  target_amount: number;
  reward_gems: number;
  reward_xp: number;
  icon: string;
  current_amount: number;
  is_completed: boolean;
  is_claimed: boolean;
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  category: 'refill' | 'powerup' | 'subscription' | 'outfit';
  cost_gems: number;
  icon: string;
  is_owned: boolean;
  is_active: boolean;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  current_progress: number;
  target: number;
  current_level: number;
  max_level: number;
  unlocked: boolean;
}

export interface UserProfileStats {
  id: number;
  username: string;
  display_name: string;
  avatar_url?: string;
  xp_total: number;
  streak_count: number;
  hearts: number;
  gems: number;
  league: string;
  is_super: boolean;
  outfit: string;
  skills_completed: number;
  total_lessons_completed: number;
  achievements: UserAchievement[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserSummary;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  display_name?: string;
  age?: number;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface UpdateGoalRequest {
  daily_goal_xp: number;
}
