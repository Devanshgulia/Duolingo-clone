import {
  PathData, StartLessonResponse, AnswerResult, CompleteLessonResult,
  UserSummary, LeaderboardEntry, UserProfileStats, GuidebookData,
  Quest, ShopItem, AuthResponse, RegisterRequest, LoginRequest
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('duo_auth_token');
  }
  return null;
}

export function setStoredToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('duo_auth_token', token);
    } else {
      localStorage.removeItem('duo_auth_token');
    }
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(errorData.detail || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  register: (req: RegisterRequest) =>
    fetchJson<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(req),
    }),

  login: (req: LoginRequest) =>
    fetchJson<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(req),
    }),

  demoLogin: () =>
    fetchJson<AuthResponse>('/auth/demo', {
      method: 'POST',
    }),

  getMe: () => fetchJson<UserSummary>('/auth/me'),

  logout: () => fetchJson<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),

  // Path & Curriculum
  getPath: () => fetchJson<PathData>('/path'),
  getGuidebook: (unitId: number) => fetchJson<GuidebookData>(`/guidebooks/unit/${unitId}`),
  claimChest: (chestId: number) => fetchJson<{ success: boolean; reward_gems: number; reward_xp: number; user_summary: UserSummary }>(`/chests/${chestId}/claim`, { method: 'POST' }),

  // Lessons & Exercises
  startLesson: (lessonId: number) =>
    fetchJson<StartLessonResponse>(`/lessons/${lessonId}/start`, { method: 'POST' }),

  submitAnswer: (lessonId: number, attemptId: number, exerciseId: number, userAnswer: any) =>
    fetchJson<AnswerResult>(`/lessons/${lessonId}/answer`, {
      method: 'POST',
      body: JSON.stringify({
        attempt_id: attemptId,
        exercise_id: exerciseId,
        user_answer: userAnswer,
      }),
    }),

  completeLesson: (lessonId: number, attemptId: number) =>
    fetchJson<CompleteLessonResult>(`/lessons/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ attempt_id: attemptId }),
    }),

  // Practice Mode
  startPractice: () => fetchJson<StartLessonResponse>('/practice/start', { method: 'POST' }),
  completePractice: (attemptId: number) => fetchJson<CompleteLessonResult>('/practice/complete', {
    method: 'POST',
    body: JSON.stringify({ attempt_id: attemptId }),
  }),

  // User & Gamification
  getUserSummary: () => fetchJson<UserSummary>('/user/summary'),
  incrementStreak: () => fetchJson<UserSummary>('/user/streak/increment', { method: 'POST' }),
  updateDailyGoal: (dailyGoalXp: number) =>
    fetchJson<UserSummary>('/user/goal', {
      method: 'PUT',
      body: JSON.stringify({ daily_goal_xp: dailyGoalXp }),
    }),
  refillHearts: () => fetchJson<{ success: boolean; hearts: number; gems: number; message: string }>('/user/hearts/refill', { method: 'POST' }),
  getUserProfile: () => fetchJson<UserProfileStats>('/user/profile'),
  switchCourse: (courseId: number) => fetchJson<UserSummary>('/user/course', {
    method: 'PUT',
    body: JSON.stringify({ course_id: courseId }),
  }),

  // Quests
  getQuests: () => fetchJson<Quest[]>('/quests'),
  claimQuest: (questId: number) => fetchJson<{ success: boolean; reward_gems: number; reward_xp: number; user_summary: UserSummary }>(`/quests/${questId}/claim`, { method: 'POST' }),

  // Shop
  getShopItems: () => fetchJson<ShopItem[]>('/shop'),
  purchaseShopItem: (itemId: string) => fetchJson<{ success: boolean; message: string; user_summary: UserSummary }>('/shop/purchase', {
    method: 'POST',
    body: JSON.stringify({ item_id: itemId }),
  }),

  // Leaderboard
  getLeaderboard: () => fetchJson<LeaderboardEntry[]>('/leaderboard'),

  // Dev tools
  simulateDay: (days: number = 1) =>
    fetchJson<{ message: string; new_last_activity_date: string; streak_count: number; streak_freeze_count: number }>(`/user/dev/simulate-day?days=${days}`, { method: 'POST' }),
};
