'use client';

import React, { useEffect, useState } from 'react';
import { sound } from '@/lib/sound';
import { Flame, Sparkles, Zap, Check } from 'lucide-react';

interface StreakIgniteModalProps {
  streakCount: number;
  onContinue: () => void;
}

export function StreakIgniteModal({ streakCount, onContinue }: StreakIgniteModalProps) {
  const [ignited, setIgnited] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 1. Initial ember ignite sequence
    const timer1 = setTimeout(() => {
      setIgnited(true);
      sound.playFireIgnite();
    }, 150);

    // 2. Reveal text & details
    const timer2 = setTimeout(() => {
      setShowContent(true);
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Real-time current week calculation (Sunday to Saturday)
  const now = new Date();
  const todayDayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - todayDayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const isToday = i === todayDayOfWeek;
    const isPast = i < todayDayOfWeek;
    return {
      label: dayLabels[i],
      dayOfMonth: d.getDate(),
      isToday,
      isPast,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 select-none">
      {/* Dynamic Background Radial Fire Glow */}
      <div
        className={`absolute w-[420px] sm:w-[540px] h-[420px] sm:h-[540px] rounded-full pointer-events-none transition-all duration-1000 ${
          ignited
            ? 'bg-gradient-to-tr from-[#ff4b4b]/30 via-[#ff9600]/30 to-[#ffc800]/20 blur-3xl scale-125 opacity-100'
            : 'scale-75 opacity-0'
        }`}
      />

      {/* Floating Fiery Spark Particles */}
      {ignited && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#ffc800] shadow-[0_0_8px_#ff9600] animate-bounce"
              style={{
                left: `${15 + ((i * 19) % 70)}%`,
                top: `${30 + ((i * 23) % 45)}%`,
                animationDuration: `${1.2 + (i % 5) * 0.3}s`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      )}

      {/* Modal Card */}
      <div
        className={`relative max-w-sm w-full bg-[#131f24] border-2 border-[#ff9600]/60 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl shadow-[#ff9600]/20 transform transition-all duration-500 ${
          ignited ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-6 opacity-0'
        }`}
      >
        {/* Animated Central Fire Mascot Graphic */}
        <div className="relative mb-6">
          {/* Outer Pulsing Flame Aura */}
          <div
            className={`absolute -inset-4 bg-[#ff9600]/30 rounded-full blur-xl transition-all duration-700 ${
              ignited ? 'animate-pulse scale-110 opacity-100' : 'scale-75 opacity-0'
            }`}
          />

          {/* Large Multi-Layered Flame SVG */}
          <div
            className={`relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center transform transition-transform duration-700 ${
              ignited ? 'scale-110' : 'scale-50'
            }`}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_25px_rgba(255,150,0,0.5)]">
              <defs>
                {/* Outer Flame Gradient */}
                <linearGradient id="flameOuter" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#ff4b4b" />
                  <stop offset="60%" stopColor="#ff9600" />
                  <stop offset="100%" stopColor="#ffc800" />
                </linearGradient>
                {/* Inner Core Flame Gradient */}
                <linearGradient id="flameInner" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#ff9600" />
                  <stop offset="60%" stopColor="#ffc800" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>

              {/* Main Outer Flame */}
              <path
                d="M50 5 C55 20, 75 35, 75 60 C75 78, 62 95, 50 95 C38 95, 25 78, 25 60 C25 40, 42 22, 50 5 Z"
                fill="url(#flameOuter)"
                className="animate-pulse"
              />

              {/* Secondary Flame Tongue (Right Wave) */}
              <path
                d="M62 45 C68 55, 74 65, 70 75 C66 85, 55 92, 50 92 C60 88, 65 75, 60 62 C58 55, 60 50, 62 45 Z"
                fill="#ff4b4b"
                opacity="0.85"
              />

              {/* Middle Yellow Flame */}
              <path
                d="M50 25 C54 38, 66 50, 66 68 C66 80, 58 90, 50 90 C42 90, 34 80, 34 68 C34 52, 45 40, 50 25 Z"
                fill="url(#flameInner)"
              />

              {/* White-Hot Core Spark */}
              <path
                d="M50 48 C52 56, 58 64, 58 74 C58 82, 54 86, 50 86 C46 86, 42 82, 42 74 C42 64, 48 56, 50 48 Z"
                fill="#ffffff"
                className="animate-pulse"
              />
            </svg>

            {/* Glowing Big Streak Count In Core */}
            <div className="absolute inset-0 flex items-center justify-center pt-8">
              <span className="text-3xl sm:text-4xl font-black text-black drop-shadow-md">
                {streakCount}
              </span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div
          className={`space-y-2 transition-all duration-500 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff9600]/20 border border-[#ff9600]/40 text-[#ff9600] text-xs font-black uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 fill-[#ff9600]" />
            <span>Streak Extended!</span>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight">
            {streakCount} DAY STREAK!
          </h2>

          <p className="text-xs sm:text-sm font-bold text-gray-300 leading-relaxed max-w-xs mx-auto">
            You completed your first question and lit the fire! Practice every day to build your streak.
          </p>
        </div>

        {/* Real-time Weekly Calendar Progress Strip */}
        <div
          className={`w-full mt-6 mb-6 p-3 bg-[#19262c] border-2 border-[#2b3a42] rounded-2xl flex items-center justify-between transition-all duration-500 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {weekDays.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className={`text-[11px] font-black ${d.isToday ? 'text-[#ff9600]' : 'text-gray-400'}`}>
                {d.label}
              </span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  d.isToday
                    ? 'bg-gradient-to-tr from-[#ff4b4b] to-[#ffc800] text-black shadow-md shadow-[#ff9600]/40 scale-110'
                    : d.isPast
                    ? 'bg-[#202f36] text-[#58cc02]'
                    : 'bg-[#152026] text-gray-600 border border-[#202f36]'
                }`}
              >
                {d.isToday ? (
                  <Flame className="w-4 h-4 fill-black text-black" />
                ) : d.isPast ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  d.dayOfMonth
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            sound.playClick();
            onContinue();
          }}
          className={`duo-button duo-button-green w-full py-4 uppercase font-black text-sm tracking-wider shadow-lg shadow-[#58cc02]/20 transition-all duration-500 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
