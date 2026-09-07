'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { UserSummary, Quest } from '@/types';
import { SuperDuoIridescent } from '@/components/ui/Mascots';
import { sound } from '@/lib/sound';
import { useAuth } from '@/context/AuthContext';

interface RightSidebarProps {
  userSummary?: UserSummary | null;
  quests?: Quest[];
  onClaimQuest?: (questId: number) => void;
}

export function RightSidebar({ userSummary, quests = [], onClaimQuest }: RightSidebarProps) {
  const { user: authUser } = useAuth();
  const effectiveUser = authUser || userSummary;

  const quest = quests[0] || {
    id: 1,
    title: 'Earn 10 XP',
    current_amount: 0,
    target_amount: 10,
    is_completed: false,
    is_claimed: false,
  };
  const questPercent = Math.min(100, Math.round((quest.current_amount / quest.target_amount) * 100));

  // Daily XP Goal data
  const dailyGoal = effectiveUser?.daily_goal_xp || 30;
  const todayXp = effectiveUser?.today_xp || 0;
  const goalPercent = Math.min(100, Math.round((todayXp / dailyGoal) * 100));
  const goalReached = todayXp >= dailyGoal;

  // SVG circle math for the progress ring
  const ringSize = 80;
  const strokeWidth = 8;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (goalPercent / 100) * circumference;

  return (
    <aside className="w-[360px] hidden lg:flex flex-col gap-4 p-4 select-none">
      {/* 1. Daily XP Goal Card */}
      <div className="duo-card p-5 bg-[#131f24] border-2 border-[#202f36]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-white text-base">Daily Goal</h3>
          <Link
            href="/settings/coach"
            onClick={() => sound.playClick()}
            className="text-xs font-black text-[#1cb0f6] hover:underline uppercase tracking-wider"
          >
            EDIT GOAL
          </Link>
        </div>

        <div className="flex items-center gap-5">
          {/* Circular Progress Ring */}
          <div className="relative shrink-0">
            <svg width={ringSize} height={ringSize} className="transform -rotate-90">
              {/* Background Ring */}
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="transparent"
                stroke="#202f36"
                strokeWidth={strokeWidth}
              />
              {/* Progress Ring */}
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="transparent"
                stroke={goalReached ? '#58cc02' : '#ffc800'}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Zap className={`w-5 h-5 ${goalReached ? 'fill-[#58cc02] text-[#58cc02]' : 'fill-[#ffc800] text-[#ffc800]'}`} />
              <span className={`text-xs font-black mt-0.5 ${goalReached ? 'text-[#58cc02]' : 'text-[#ffc800]'}`}>
                {goalPercent}%
              </span>
            </div>
          </div>

          {/* Goal Text */}
          <div className="flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black ${goalReached ? 'text-[#58cc02]' : 'text-white'}`}>
                {todayXp}
              </span>
              <span className="text-sm font-black text-gray-500">/ {dailyGoal} XP</span>
            </div>
            <p className="text-xs font-bold text-gray-400 mt-1">
              {goalReached
                ? '🎉 Daily goal complete! Great job!'
                : `${dailyGoal - todayXp} XP to reach your daily goal`}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Super Duolingo Card */}
      <div className="duo-card p-5 bg-[#131f24] border-2 border-[#202f36] relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            {/* SUPER Badge */}
            <div className="inline-block bg-gradient-to-r from-[#00f0ff] via-[#4968fe] to-[#e879f9] text-white text-[11px] font-black italic px-2.5 py-0.5 rounded-md mb-2 tracking-wider">
              SUPER
            </div>
            <h3 className="font-black text-lg text-white leading-snug">Try Super for free</h3>
            <p className="text-xs font-bold text-gray-400 mt-1 leading-relaxed">
              No ads, personalized practice, and unlimited Legendary!
            </p>
          </div>
          {/* Iridescent Super Duo Artwork */}
          <SuperDuoIridescent className="w-20 h-20 shrink-0" />
        </div>

        {/* 3D Button */}
        <Link
          href="/shop"
          onClick={() => sound.playClick()}
          className="duo-button duo-button-super w-full py-3 text-xs tracking-wider mt-4"
        >
          TRY 1 WEEK FREE
        </Link>
      </div>

      {/* 3. Daily Quests Card */}
      <div className="duo-card p-5 bg-[#131f24] border-2 border-[#202f36]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-white text-base">Daily Quests</h3>
          <Link
            href="/quests"
            onClick={() => sound.playClick()}
            className="text-xs font-black text-[#1cb0f6] hover:underline uppercase tracking-wider"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Lightning Bolt Icon */}
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-[#ffc800] shrink-0">
            <Zap className="w-6 h-6 fill-current text-[#ffc800]" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-black text-xs text-white mb-1.5">{quest.title}</h4>
            {/* Progress Bar Container */}
            <div className="w-full h-3 bg-[#202f36] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-[#ffc800] rounded-full transition-all duration-300"
                style={{ width: `${questPercent}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-gray-400">
                {quest.current_amount} / {quest.target_amount}
              </span>
            </div>
          </div>

          {/* Wooden Chest Icon */}
          <div className="w-9 h-9 rounded-xl bg-[#202f36] border border-[#37464f] flex items-center justify-center text-amber-500 shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <rect x="3" y="8" width="18" height="12" rx="2" fill="#c27803" />
              <rect x="2" y="5" width="20" height="4" rx="1" fill="#8c4f00" />
              <circle cx="12" cy="13" r="2" fill="#ffc800" />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
}
