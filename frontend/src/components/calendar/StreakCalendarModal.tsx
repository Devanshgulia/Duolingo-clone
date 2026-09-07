'use client';

import React, { useState } from 'react';
import { UserSummary } from '@/types';
import { sound } from '@/lib/sound';
import { Flame, X, ChevronLeft, ChevronRight, Snowflake, Trophy, Zap, Check, Calendar as CalendarIcon } from 'lucide-react';

interface StreakCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSummary?: UserSummary | null;
  onPracticeClick?: () => void;
}

export function StreakCalendarModal({
  isOpen,
  onClose,
  userSummary,
  onPracticeClick
}: StreakCalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  if (!isOpen) return null;

  const now = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Days in current month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Active dates set for instant lookup
  const activeDatesSet = new Set<string>(userSummary?.active_dates || []);
  if (userSummary?.last_activity_date) {
    activeDatesSet.add(userSummary.last_activity_date);
  }

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isPracticedToday = (userSummary?.today_xp || 0) > 0 || userSummary?.last_activity_date === todayStr;

  const streakCount = userSummary?.streak_count || 0;
  const streakFreezeCount = userSummary?.streak_freeze_count ?? 1;

  // Next streak milestone
  const milestones = [3, 7, 14, 30, 50, 100, 365];
  const nextMilestone = milestones.find((m) => m > streakCount) || 365;
  const prevMilestone = [...milestones].reverse().find((m) => m <= streakCount) || 0;
  const milestoneProgress = Math.min(
    100,
    Math.round(((streakCount - prevMilestone) / (nextMilestone - prevMilestone)) * 100)
  );

  const handlePrevMonth = () => {
    sound.playClick();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    sound.playClick();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleResetToToday = () => {
    sound.playClick();
    setCurrentDate(new Date());
  };

  // Count practiced days in this viewed month
  let practicedInViewedMonth = 0;
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (activeDatesSet.has(dStr) || (dStr === todayStr && isPracticedToday)) {
      practicedInViewedMonth++;
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-[#131f24] border-2 border-[#2b3a42] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col text-white animate-in zoom-in-95 duration-200 overflow-hidden max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#ff9600]/15 blur-3xl pointer-events-none"></div>

        {/* Top Bar / Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#202f36] relative z-10">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#ff9600]" />
            <h3 className="text-lg font-black text-white">Streak Calendar</h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#202f36] hover:bg-[#2b3a42] flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Streak Hero Banner */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-[#202f36] to-[#18252b] border-2 border-[#ff9600]/30 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-[#ff9600]">{streakCount}</span>
              <span className="text-sm font-black text-white uppercase tracking-wider">Day Streak</span>
            </div>
            <p className="text-xs font-bold text-gray-300">
              {isPracticedToday
                ? '🔥 You extended your streak today!'
                : '⏳ Complete a lesson today to keep the flame alive!'}
            </p>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <div className={`absolute inset-0 rounded-full blur-md ${isPracticedToday ? 'bg-[#ff9600]/40 animate-pulse' : 'bg-gray-700/20'}`}></div>
            <Flame className={`w-12 h-12 ${isPracticedToday ? 'fill-[#ff9600] text-[#ffc800] animate-bounce' : 'fill-gray-600 text-gray-500'}`} />
          </div>
        </div>

        {/* Streak Freeze & Month Stats Cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="bg-[#19262c] border border-[#2b3a42] rounded-2xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1cb0f6]/20 flex items-center justify-center text-[#1cb0f6] shrink-0">
              <Snowflake className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-black text-white">{streakFreezeCount} / 2</span>
              <p className="text-[11px] font-bold text-gray-400 truncate">Streak Freezes</p>
            </div>
          </div>

          <div className="bg-[#19262c] border border-[#2b3a42] rounded-2xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#58cc02]/20 flex items-center justify-center text-[#58cc02] shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-black text-white">{practicedInViewedMonth} Days</span>
              <p className="text-[11px] font-bold text-gray-400 truncate">This Month</p>
            </div>
          </div>
        </div>

        {/* Month Navigation Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h4 className="font-black text-base text-white">
              {monthNames[month]} {year}
            </h4>
            {(year !== now.getFullYear() || month !== now.getMonth()) && (
              <button
                onClick={handleResetToToday}
                className="text-[10px] font-black text-[#1cb0f6] bg-[#1cb0f6]/10 hover:bg-[#1cb0f6]/20 px-2 py-0.5 rounded-md uppercase tracking-wider"
              >
                Today
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-xl bg-[#202f36] hover:bg-[#2b3a42] flex items-center justify-center text-gray-300 hover:text-white transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-xl bg-[#202f36] hover:bg-[#2b3a42] flex items-center justify-center text-gray-300 hover:text-white transition"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Column Calendar Grid */}
        <div className="bg-[#19262c] border-2 border-[#2b3a42] rounded-2xl p-3 mb-4">
          {/* Day Headers: SUN MON TUE WED THU FRI SAT */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2 pb-1 border-b border-[#202f36]">
            {dayHeaders.map((dh) => (
              <span key={dh} className="text-[10px] font-black text-gray-400">
                {dh}
              </span>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty padding cells for days before the 1st */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-9"></div>
            ))}

            {/* Real Month Days */}
            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              
              const isToday = dateStr === todayStr;
              const isPast = new Date(year, month, dayNum) < new Date(now.getFullYear(), now.getMonth(), now.getDate());
              const isFuture = new Date(year, month, dayNum) > new Date(now.getFullYear(), now.getMonth(), now.getDate());

              const isCompleted = activeDatesSet.has(dateStr) || (isToday && isPracticedToday);

              return (
                <div
                  key={dayNum}
                  className={`h-9 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                    isToday
                      ? isCompleted
                        ? 'bg-gradient-to-tr from-[#ff4b4b] to-[#ff9600] text-white shadow-md shadow-[#ff9600]/30 font-black'
                        : 'border-2 border-[#ff9600] bg-[#ff9600]/10 text-[#ff9600] font-black animate-pulse'
                      : isCompleted
                      ? 'bg-[#ff9600]/20 border border-[#ff9600]/50 text-[#ff9600] font-black'
                      : isPast
                      ? 'text-gray-500 hover:bg-[#202f36]'
                      : 'text-gray-600 opacity-60'
                  }`}
                  title={`${monthNames[month]} ${dayNum}, ${year}${isCompleted ? ' (Practiced 🔥)' : isToday ? ' (Today)' : ''}`}
                >
                  <span className="text-xs font-black">{dayNum}</span>
                  {isCompleted && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffc800] -mt-0.5"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone / Streak Society Progress */}
        <div className="bg-[#19262c] border border-[#2b3a42] rounded-2xl p-3.5 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#ffc800]" />
              <span className="text-xs font-black text-white">Next Goal: {nextMilestone} Day Streak</span>
            </div>
            <span className="text-xs font-black text-[#ff9600]">{streakCount} / {nextMilestone}</span>
          </div>

          <div className="w-full h-2.5 bg-[#131f24] rounded-full overflow-hidden border border-[#202f36]">
            <div
              className="h-full bg-gradient-to-r from-[#ff9600] to-[#ffc800] transition-all duration-500 rounded-full"
              style={{ width: `${milestoneProgress}%` }}
            ></div>
          </div>
          <p className="text-[11px] font-bold text-gray-400 mt-1.5 leading-tight">
            {nextMilestone - streakCount > 0
              ? `${nextMilestone - streakCount} more days to unlock the ${nextMilestone}-day streak badge!`
              : '🎉 Milestone achieved! Keep the fire burning!'}
          </p>
        </div>

        {/* Bottom Action Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
            if (onPracticeClick) {
              onPracticeClick();
            }
          }}
          className="duo-button duo-button-green w-full py-3.5 text-xs uppercase tracking-wider font-black shadow-lg"
        >
          {isPracticedToday ? 'CONTINUE LEARNING' : 'PRACTICE TODAY (+1 STREAK)'}
        </button>
      </div>
    </div>
  );
}
