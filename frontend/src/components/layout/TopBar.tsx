'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Lock, Heart, RefreshCw, Sparkles, Calendar as CalendarIcon, Flame } from 'lucide-react';
import { UserSummary, CourseOverview } from '@/types';
import { sound } from '@/lib/sound';
import { StreakCalendarModal } from '@/components/calendar/StreakCalendarModal';

interface TopBarProps {
  userSummary?: UserSummary | null;
  onRefillHearts?: () => void;
  availableCourses?: CourseOverview[];
  currentCourseId?: number;
  onCourseSwitch?: (courseId: number) => void;
}

export function TopBar({
  userSummary,
  onRefillHearts,
  availableCourses = [],
  currentCourseId,
  onCourseSwitch
}: TopBarProps) {
  const [activePopover, setActivePopover] = useState<'course' | 'streak' | 'gems' | 'hearts' | null>(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (popover: 'course' | 'streak' | 'gems' | 'hearts') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActivePopover(popover);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActivePopover(null);
    }, 150);
  };

  if (!userSummary) {
    return (
      <header className="sticky top-0 bg-[#131f24] h-16 z-30 px-6 flex items-center justify-end max-w-6xl mx-auto w-full">
        <div className="flex gap-4">
          <div className="h-9 w-16 bg-[#202f36] rounded-2xl animate-pulse"></div>
          <div className="h-9 w-16 bg-[#202f36] rounded-2xl animate-pulse"></div>
          <div className="h-9 w-20 bg-[#202f36] rounded-2xl animate-pulse"></div>
          <div className="h-9 w-16 bg-[#202f36] rounded-2xl animate-pulse"></div>
        </div>
      </header>
    );
  }

  const renderFlag = () => {
    return (
      <div className="w-8 h-5.5 rounded-md border border-white/20 flex flex-col shadow-sm shrink-0 overflow-hidden relative">
        <div className="w-full h-1/4 bg-[#de2010]"></div>
        <div className="w-full h-2/4 bg-[#ffc400] flex items-center pl-1">
          {/* Spanish Emblem */}
          <div className="w-1.5 h-2 bg-[#de2010] rounded-[1px] border-[0.5px] border-[#a01000]"></div>
        </div>
        <div className="w-full h-1/4 bg-[#de2010]"></div>
      </div>
    );
  };

  // Real-time current week calculation (Sunday to Saturday)
  const now = new Date();
  const todayDayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - todayDayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const activeDatesSet = new Set<string>(userSummary.active_dates || []);
  if (userSummary.last_activity_date) {
    activeDatesSet.add(userSummary.last_activity_date);
  }

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isPracticedToday = (userSummary.today_xp || 0) > 0 || userSummary.last_activity_date === todayStr;

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isToday = i === todayDayOfWeek;
    const isPast = d < new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isFuture = d > new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isCompleted = activeDatesSet.has(dateStr) || (isToday && isPracticedToday);

    return {
      label: dayLabels[i],
      dayOfMonth: d.getDate(),
      dateStr,
      isToday,
      isPast,
      isFuture,
      isCompleted,
    };
  });

  return (
    <header className="sticky top-0 bg-[#131f24] h-16 z-30 px-4 sm:px-8 flex items-center justify-end max-w-6xl mx-auto w-full select-none">
      {/* Right-aligned Stats Cluster: [ Language | Streak | Gems | Hearts ] */}
      <div className="flex items-center gap-2 sm:gap-5 font-black text-sm select-none">
        
        {/* 1. Language Flag Button with Hover Popover */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('course')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl transition border-2 cursor-pointer ${
              activePopover === 'course'
                ? 'bg-[#202f36] border-[#37464f]'
                : 'hover:bg-[#202f36] border-transparent hover:border-[#37464f]'
            }`}
            title="Spanish"
          >
            {renderFlag()}
            <span className="font-black text-base text-white">5</span>
          </button>

          {/* Course Popover */}
          {activePopover === 'course' && (
            <div 
              onMouseEnter={() => handleMouseEnter('course')}
              onMouseLeave={handleMouseLeave}
              className="absolute top-full right-0 mt-3 w-64 bg-[#19262c] border-2 border-[#2b3a42] rounded-3xl shadow-2xl z-50 overflow-hidden p-3 animate-in fade-in zoom-in-95 duration-150"
            >
              {/* Arrow Pointer */}
              <div className="absolute -top-2 right-6 w-4 h-4 bg-[#19262c] border-l-2 border-t-2 border-[#2b3a42] rotate-45"></div>

              <p className="px-3 pt-2 pb-2 text-[11px] font-black uppercase tracking-wider text-gray-400">MY COURSES</p>
              
              <div className="space-y-1">
                <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#18394a] text-[#1cb0f6]">
                  <div className="flex items-center gap-3.5">
                    {renderFlag()}
                    <span className="text-base font-black text-[#1cb0f6]">
                      Spanish
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#1cb0f6]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Streak Counter with Hover Popover & Calendar Modal */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('streak')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              sound.playClick();
              setShowCalendarModal(true);
              setActivePopover(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl transition border-2 cursor-pointer ${
              activePopover === 'streak'
                ? 'bg-[#202f36] border-[#37464f] text-[#ff9600]'
                : isPracticedToday
                ? 'hover:bg-[#202f36] border-transparent text-[#ff9600]'
                : userSummary.streak_count > 0
                ? 'hover:bg-[#202f36] border-transparent text-[#ff9600]/80'
                : 'hover:bg-[#202f36] border-transparent text-gray-400 hover:text-[#ff9600]'
            }`}
            title="Streak & Calendar"
          >
            {/* Duolingo Flame Icon */}
            {userSummary.streak_count > 0 ? (
              <Flame className={`w-6 h-6 ${isPracticedToday ? 'fill-[#ff9600] text-[#ffc800] animate-pulse' : 'fill-[#ff9600] text-[#ff9600]'}`} />
            ) : (
              <Flame className="w-6 h-6 fill-[#3b4e58] text-[#3b4e58]" />
            )}
            <span className={userSummary.streak_count > 0 ? 'text-[#ff9600] font-black text-base' : 'text-[#5a6f7b] font-black text-base'}>
              {userSummary.streak_count}
            </span>
          </button>

          {/* Streak Popover */}
          {activePopover === 'streak' && (
            <div 
              onMouseEnter={() => handleMouseEnter('streak')}
              onMouseLeave={handleMouseLeave}
              className="absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 mt-3 w-88 bg-[#19262c] border-2 border-[#2b3a42] rounded-3xl shadow-2xl z-50 p-5 animate-in fade-in zoom-in-95 duration-150"
            >
              {/* Arrow Pointer */}
              <div className="absolute -top-2 right-8 sm:left-1/2 sm:-translate-x-1/2 w-4 h-4 bg-[#19262c] border-l-2 border-t-2 border-[#2b3a42] rotate-45"></div>

              {/* Title & Flame outline */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-black text-xl text-white">{userSummary.streak_count} day streak</h4>
                  <p className="text-xs text-gray-400 font-bold mt-0.5">
                    {isPracticedToday
                      ? '🔥 You extended your streak today!'
                      : 'Do a lesson today to keep your streak!'}
                  </p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center">
                  <Flame className={`w-10 h-10 ${isPracticedToday ? 'fill-[#ff9600] text-[#ffc800]' : 'fill-[#202f36] text-[#37464f]'}`} />
                </div>
              </div>

              {/* Real-time Days Row: S M T W T F S */}
              <div className="grid grid-cols-7 gap-1.5 text-center my-4 py-2.5 bg-[#131f24] rounded-2xl px-2 border border-[#202f36]">
                {weekDays.map((d, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className={`text-[11px] font-black ${d.isToday ? 'text-[#ff9600]' : 'text-gray-400'}`}>
                      {d.label}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        d.isCompleted
                          ? 'bg-gradient-to-tr from-[#ff4b4b] to-[#ff9600] text-white shadow-sm shadow-[#ff9600]/40'
                          : d.isToday
                          ? 'border-2 border-[#ff9600] bg-[#ff9600]/15 text-[#ff9600] animate-pulse font-bold'
                          : d.isPast
                          ? 'bg-[#202f36] text-gray-500'
                          : 'bg-[#152026] text-gray-600'
                      }`}
                      title={`${d.dateStr}${d.isCompleted ? ' (Practiced 🔥)' : d.isToday ? ' (Today)' : ''}`}
                    >
                      {d.isCompleted ? (
                        <Flame className="w-3.5 h-3.5 fill-white text-white" />
                      ) : (
                        d.dayOfMonth
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Button: Open Full Streak Calendar */}
              <button
                onClick={() => {
                  sound.playClick();
                  setShowCalendarModal(true);
                  setActivePopover(null);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 mb-3 rounded-2xl bg-[#202f36] hover:bg-[#2b3a42] border border-[#37464f] text-[#1cb0f6] text-xs font-black uppercase tracking-wider transition"
              >
                <CalendarIcon className="w-4 h-4 text-[#ff9600]" />
                <span>VIEW FULL CALENDAR</span>
              </button>

              {/* Orange Card: Friend Streaks */}
              <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff9600] rounded-2xl p-4 text-white mb-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <h5 className="font-black text-sm">Friend Streaks</h5>
                    <p className="text-xs font-bold text-orange-100 mt-0.5">1 active Friend Streak</p>
                  </div>
                  <div className="text-2xl">🔥👭</div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => {
                    sound.playClick();
                    setActivePopover(null);
                  }}
                  className="block text-center w-full mt-3 bg-white text-[#ff6b00] hover:bg-orange-50 font-black text-xs py-2 rounded-xl transition uppercase tracking-wider shadow-sm"
                >
                  VIEW LIST
                </Link>
              </div>

              {/* Card: Streak Society */}
              <div className="bg-[#131f24] border-2 border-[#202f36] rounded-2xl p-4 flex items-center gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#202f36] flex items-center justify-center text-gray-500 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-black text-sm text-white">Streak Society</h5>
                  <p className="text-[11px] font-bold text-gray-400 mt-0.5 leading-tight">
                    Reach a 7 day streak to join the Streak Society and earn exclusive rewards.
                  </p>
                </div>
              </div>

              {/* Bottom Button */}
              <Link
                href="/profile"
                onClick={() => {
                  sound.playClick();
                  setActivePopover(null);
                }}
                className="duo-button duo-button-blue block text-center w-full py-3 text-xs tracking-wider"
              >
                VIEW MORE
              </Link>
            </div>
          )}
        </div>

        {/* 3. Gems Balance with Hover Popover */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('gems')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl transition border-2 cursor-pointer ${
              activePopover === 'gems'
                ? 'bg-[#202f36] border-[#37464f] text-[#1cb0f6]'
                : 'hover:bg-[#202f36] border-transparent text-[#1cb0f6]'
            }`}
          >
            {/* Duolingo Glowing Hexagon Gem */}
            <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0">
              <polygon points="14,2 25,7 25,21 14,26 3,21 3,7" fill="#1cb0f6" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
              <polygon points="14,5 22,9 14,14 6,9" fill="#70d7ff" opacity="0.9" />
              <polygon points="6,9 14,14 14,23 5,19" fill="#0099e5" opacity="0.6" />
              <polygon points="22,9 14,14 14,23 23,19" fill="#0080c6" opacity="0.8" />
            </svg>
            <span className="font-black text-base text-[#1cb0f6]">{userSummary.gems}</span>
          </button>

          {/* Gems Popover */}
          {activePopover === 'gems' && (
            <div 
              onMouseEnter={() => handleMouseEnter('gems')}
              onMouseLeave={handleMouseLeave}
              className="absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 mt-3 w-80 bg-[#19262c] border-2 border-[#2b3a42] rounded-3xl shadow-2xl z-50 p-5 animate-in fade-in zoom-in-95 duration-150"
            >
              {/* Arrow Pointer */}
              <div className="absolute -top-2 right-8 sm:left-1/2 sm:-translate-x-1/2 w-4 h-4 bg-[#19262c] border-l-2 border-t-2 border-[#2b3a42] rotate-45"></div>

              <div className="flex items-center gap-4">
                {/* Chest with Blue Diamonds */}
                <div className="w-18 h-18 shrink-0">
                  <svg viewBox="0 0 80 80" className="w-18 h-18">
                    <rect x="12" y="32" width="56" height="34" rx="4" fill="#a16207" />
                    <rect x="14" y="34" width="52" height="30" rx="3" fill="#ca8a04" />
                    <polygon points="26,30 34,22 42,30 34,36" fill="#38bdf8" />
                    <polygon points="38,28 46,20 54,28 46,34" fill="#0284c7" />
                    <polygon points="30,34 38,26 46,34 38,40" fill="#7dd3fc" />
                    <rect x="22" y="32" width="6" height="34" fill="#eab308" />
                    <rect x="52" y="32" width="6" height="34" fill="#eab308" />
                    <circle cx="40" cy="46" r="4" fill="#713f12" />
                    <rect x="38" y="46" width="4" height="6" fill="#713f12" />
                  </svg>
                </div>

                <div className="flex-1">
                  <h4 className="font-black text-xl text-white">Gems</h4>
                  <p className="text-xs font-bold text-gray-400 mt-0.5">
                    You have {userSummary.gems} gems
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => {
                      sound.playClick();
                      setActivePopover(null);
                    }}
                    className="inline-block mt-3 text-xs font-black text-[#1cb0f6] hover:text-[#38bdf8] uppercase tracking-wider"
                  >
                    GO TO SHOP
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Hearts Balance Counter with Hover Popover */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('hearts')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl transition border-2 cursor-pointer ${
              activePopover === 'hearts'
                ? 'bg-[#202f36] border-[#37464f] text-[#ff4b4b]'
                : 'hover:bg-[#202f36] border-transparent text-[#ff4b4b]'
            }`}
            title="Hearts"
          >
            {/* Duolingo Red Heart with White Border & Highlight */}
            <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0">
              <path
                d="M14 24.5l-1.8-1.6C5.8 17.2 2 13.5 2 9a6.5 6.5 0 0 1 11-4.7A6.5 6.5 0 0 1 24 9c0 4.5-3.8 8.2-10.2 13.9L14 24.5z"
                fill="#ff4b4b"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <ellipse cx="8.5" cy="7.5" rx="2" ry="1.2" transform="rotate(-30 8.5 7.5)" fill="#ffffff" opacity="0.75" />
            </svg>
            <span className="font-black text-base text-[#ff4b4b]">{userSummary.is_super ? '∞' : userSummary.hearts}</span>
          </button>

          {/* Hearts Popover */}
          {activePopover === 'hearts' && (
            <div 
              onMouseEnter={() => handleMouseEnter('hearts')}
              onMouseLeave={handleMouseLeave}
              className="absolute top-full right-0 mt-3 w-80 bg-[#19262c] border-2 border-[#2b3a42] rounded-3xl shadow-2xl z-50 p-5 animate-in fade-in zoom-in-95 duration-150"
            >
              {/* Arrow Pointer */}
              <div className="absolute -top-2 right-6 w-4 h-4 bg-[#19262c] border-l-2 border-t-2 border-[#2b3a42] rotate-45"></div>

              {/* Title & Hearts Display */}
              <div className="mb-4">
                <h4 className="font-black text-xl text-white">Hearts</h4>
                <p className="text-xs font-bold text-gray-400 mt-1">
                  {userSummary.is_super
                    ? 'You have Unlimited Hearts with Super!'
                    : userSummary.hearts >= 5
                    ? 'You have full hearts'
                    : `You have ${userSummary.hearts} of 5 hearts`}
                </p>
              </div>

              {/* 5 Hearts Icons Grid */}
              <div className="flex items-center justify-center gap-3 my-4 py-3 bg-[#131f24] rounded-2xl border border-[#202f36]">
                {[0, 1, 2, 3, 4].map((idx) => {
                  const isFilled = userSummary.is_super || idx < userSummary.hearts;
                  return (
                    <div key={idx} className="transition-transform hover:scale-110">
                      <svg viewBox="0 0 24 24" className={`w-8 h-8 ${isFilled ? 'fill-[#ff4b4b] drop-shadow-sm' : 'fill-[#202f36] stroke-[#37464f] stroke-2'}`}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 mt-4">
                {userSummary.hearts < 5 && onRefillHearts ? (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onRefillHearts();
                      setActivePopover(null);
                    }}
                    className="duo-button duo-button-blue w-full py-3 text-xs tracking-wider flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 stroke-[2.5]" />
                    REFILL FOR 100 GEMS
                  </button>
                ) : null}

                <Link
                  href="/practice"
                  onClick={() => {
                    sound.playClick();
                    setActivePopover(null);
                  }}
                  className="duo-button duo-button-green block text-center w-full py-3 text-xs tracking-wider flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  PRACTICE
                </Link>

                <Link
                  href="/shop"
                  onClick={() => {
                    sound.playClick();
                    setActivePopover(null);
                  }}
                  className="block text-center text-xs font-black text-[#1cb0f6] hover:text-[#38bdf8] uppercase tracking-wider py-1.5"
                >
                  GET UNLIMITED HEARTS
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Streak Calendar Modal */}
      <StreakCalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        userSummary={userSummary}
      />
    </header>
  );
}
