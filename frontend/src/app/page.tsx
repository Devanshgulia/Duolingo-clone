'use client';

import Link from 'next/link';
import { sound } from '@/lib/sound';

export default function LandingPage() {
  const languages = [
    { label: 'ENGLISH', flag: '🇺🇸' },
    { label: 'CHESS', icon: '♟️' },
    { label: 'MATH', icon: '➗' },
    { label: 'SPANISH', flag: '🇪🇸' },
    { label: 'FRENCH', flag: '🇫🇷' },
    { label: 'GERMAN', flag: '🇩🇪' },
    { label: 'ITALIAN', flag: '🇮🇹' },
    { label: 'POR', flag: '🇧🇷' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#4b4b4b] flex flex-col font-sans select-none overflow-x-hidden">
      {/* 1. Header with centered/left Duolingo green logo and site language */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" onClick={() => sound.playClick()}>
          {/* Authentic Duolingo Logo SVG */}
          <svg viewBox="0 0 130 36" className="h-9 w-auto cursor-pointer">
            <text
              x="0"
              y="28"
              fill="#58cc02"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="34"
              fontWeight="900"
              letterSpacing="-0.5px"
            >
              duolingo
            </text>
          </svg>
        </Link>

        {/* Site Language Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600 transition">
          <span>SITE LANGUAGE: ENGLISH</span>
          <span className="text-[10px]">▼</span>
        </div>
      </header>

      {/* 2. Hero Section: "serious learning made fun." */}
      <section className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 sm:py-16 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Column: Headline & Start Learning Button */}
        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#58cc02] leading-[1.08] tracking-tight">
            serious<br />
            learning<br />
            made fun.
          </h1>
          <p className="text-base sm:text-lg font-bold text-[#777777] max-w-sm mt-5 leading-snug">
            Learn a language for free with the world&apos;s #1 education app.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/courses"
              onClick={() => sound.playClick()}
              className="duo-button duo-button-green text-sm sm:text-base py-4 px-10 uppercase tracking-wider inline-block text-center font-black shadow-lg"
            >
              START LEARNING
            </Link>
            <Link
              href="/login"
              onClick={() => sound.playClick()}
              className="duo-button duo-button-white text-xs sm:text-sm py-4 px-8 uppercase tracking-wider inline-block text-center font-black"
            >
              I ALREADY HAVE AN ACCOUNT
            </Link>
          </div>
        </div>

        {/* Right Column: Flying Green Duo Owl with Trailing Badges */}
        <div className="flex-1 flex justify-center relative w-full max-w-md">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            {/* Speed Ice Crystals */}
            <div className="absolute top-12 left-24 w-4 h-4 bg-[#38bdf8] rotate-45 rounded-[2px] opacity-80 animate-pulse"></div>
            <div className="absolute bottom-24 right-28 w-5 h-3 bg-[#38bdf8] rotate-12 rounded-[2px] opacity-80"></div>

            {/* Flying Duo Mascot Illustration */}
            <div className="absolute left-6 top-24 z-20 w-36 h-36 transform -rotate-12 transition-transform hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                {/* Duo Green Body */}
                <path
                  d="M50 10 C25 10, 10 30, 10 60 C10 85, 30 95, 50 95 C70 95, 90 85, 90 60 C90 30, 75 10, 50 10 Z"
                  fill="#58cc02"
                />
                {/* Belly patch */}
                <path
                  d="M50 45 C35 45, 25 58, 25 75 C25 88, 36 93, 50 93 C64 93, 75 88, 75 75 C75 58, 65 45, 50 45 Z"
                  fill="#78d800"
                />
                {/* Big White Eyes */}
                <circle cx="34" cy="38" r="16" fill="#ffffff" />
                <circle cx="66" cy="38" r="16" fill="#ffffff" />
                {/* Black Pupils */}
                <circle cx="32" cy="38" r="8" fill="#18252b" />
                <circle cx="68" cy="38" r="8" fill="#18252b" />
                {/* Eye Highlights */}
                <circle cx="30" cy="35" r="3" fill="#ffffff" />
                <circle cx="66" cy="35" r="3" fill="#ffffff" />
                {/* Orange Beak */}
                <polygon points="50,42 42,54 58,54" fill="#ff9600" />
                {/* Left Flapping Wing */}
                <path d="M12 48 C2 42, 0 65, 16 68 Z" fill="#46a302" />
                {/* Right Flapping Wing */}
                <path d="M88 48 C98 42, 100 65, 84 68 Z" fill="#46a302" />
                {/* Orange Feet */}
                <ellipse cx="38" cy="95" rx="8" ry="4" fill="#ff9600" />
                <ellipse cx="62" cy="95" rx="8" ry="4" fill="#ff9600" />
              </svg>
            </div>

            {/* Trailing Badge 1: Cyan Pinpoint Map */}
            <div className="absolute top-4 right-20 z-10 w-16 h-16 rounded-full bg-[#1cb0f6] border-4 border-white shadow-xl flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-white stroke-2">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
            </div>

            {/* Trailing Badge 2: Purple Egg / Creature */}
            <div className="absolute top-2 right-2 z-10 w-16 h-16 rounded-full bg-[#ce82ff] border-4 border-white shadow-xl flex items-center justify-center text-white">
              <div className="w-8 h-10 bg-white/90 rounded-full flex flex-col items-center justify-center p-1">
                <div className="w-3 h-3 rounded-full bg-[#a855f7] mb-1"></div>
                <div className="w-2 h-2 rounded-full bg-[#a855f7]"></div>
              </div>
            </div>

            {/* Trailing Badge 3: Gold Stepping Stone */}
            <div className="absolute top-24 right-24 z-10 w-16 h-16 rounded-full bg-[#ffc800] border-4 border-white shadow-xl flex items-center justify-center text-white">
              <div className="w-8 h-6 bg-white/80 rounded-lg flex items-center justify-center">
                <span className="text-amber-700 font-black text-xs">👑</span>
              </div>
            </div>

            {/* Trailing Badge 4: Yellow Star / Crown */}
            <div className="absolute top-20 right-0 z-10 w-18 h-18 rounded-full bg-[#ff9600] border-4 border-white shadow-xl flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            {/* Trailing Badge 5: Red Burger / Sandwich */}
            <div className="absolute bottom-10 right-10 z-10 w-18 h-18 rounded-full bg-[#ff4b4b] border-4 border-white shadow-xl flex items-center justify-center">
              <div className="text-2xl">🍔</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bottom Carousel / Languages Bar */}
      <div className="w-full border-t border-b border-gray-200 py-3 my-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-xs font-black text-gray-500 tracking-wider">
          <span className="text-gray-300 select-none cursor-default font-bold text-base">‹</span>
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto py-1 scrollbar-none">
            {languages.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 shrink-0 cursor-default opacity-85">
                <span className="text-base">{item.flag || item.icon}</span>
                <span className="text-[11px] uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
          <span className="text-gray-300 select-none cursor-default font-bold text-base">›</span>
        </div>
      </div>

      {/* 4. Green Statistics Banner */}
      <section className="max-w-5xl mx-auto w-full px-6 py-10">
        <div className="bg-[#58cc02] rounded-[36px] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-around gap-8 text-center">
          {/* Subtle Duolingo leaf watermark */}
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-black tracking-tight">100+</span>
            <span className="text-sm sm:text-base font-bold opacity-90 mt-1">language courses</span>
          </div>

          <div className="hidden md:block w-px h-16 bg-white/25"></div>

          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-black tracking-tight">#1</span>
            <span className="text-sm sm:text-base font-bold opacity-90 mt-1">downloaded education app</span>
          </div>

          <div className="hidden md:block w-px h-16 bg-white/25"></div>

          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-black tracking-tight">500m+</span>
            <span className="text-sm sm:text-base font-bold opacity-90 mt-1">learners</span>
          </div>
        </div>
      </section>

      {/* 5. Section: "fun. free. effective." */}
      <section className="max-w-5xl mx-auto w-full px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left: Mock Lesson Phone Screen */}
        <div className="flex-1 flex justify-center">
          <div className="w-80 sm:w-88 rounded-[36px] border-2 border-[#e5e5e5] bg-white p-5 shadow-2xl relative">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-gray-400 font-bold text-lg leading-none">✕</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#58cc02] w-1/3 rounded-full"></div>
              </div>
              <div className="flex items-center gap-1 text-[#ff4b4b] font-black text-xs">
                <span>❤️</span>
                <span>5</span>
              </div>
            </div>

            <h4 className="font-black text-gray-700 text-sm mb-4">Translate this sentence</h4>

            {/* Mascot Character & Dialogue */}
            <div className="flex items-center gap-3 mb-4">
              {/* Zari Mascot in Pink Hoodie */}
              <div className="w-14 h-16 bg-[#ff66b2] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-sm shrink-0">
                🧕
              </div>
              {/* Audio Prompt Bubble */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2 text-xs font-bold text-gray-700 shadow-xs">
                <span className="text-blue-500 text-base">🔊</span>
                <span>buenas noches</span>
              </div>
            </div>

            {/* Translation Field */}
            <div className="border-b-2 border-gray-200 min-h-[46px] flex items-center gap-2 pb-2 mb-6 px-1">
              <span className="bg-white border-2 border-gray-300 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
                good
              </span>
              <span className="bg-white border-2 border-gray-300 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
                evening
              </span>
            </div>

            {/* Word Bank Chips */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="h-8 bg-gray-100 rounded-xl"></div>
              <div className="h-8 bg-white border-2 border-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center rounded-xl shadow-xs">
                mom
              </div>
              <div className="h-8 bg-white border-2 border-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center rounded-xl shadow-xs">
                eat
              </div>
              <div className="h-8 bg-white border-2 border-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center rounded-xl shadow-xs">
                hello
              </div>
              <div className="h-8 bg-white border-2 border-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center rounded-xl shadow-xs">
                dog
              </div>
              <div className="h-8 bg-white border-2 border-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center rounded-xl shadow-xs">
                morning
              </div>
            </div>

            {/* Success Bottom Banner */}
            <div className="bg-[#d7ffb8] text-[#58a700] rounded-2xl p-3 flex flex-col gap-2 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-[#58a700]">You are correct!</span>
                <span className="text-xs">💬</span>
              </div>
              <div className="w-full bg-[#58cc02] text-white text-center font-black text-xs py-2.5 rounded-xl shadow-xs uppercase tracking-wider">
                CONTINUE
              </div>
            </div>
          </div>
        </div>

        {/* Right: Text */}
        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
          <h2 className="text-4xl sm:text-5xl font-black text-[#58cc02] leading-[1.08] tracking-tight">
            fun.<br />
            free.<br />
            effective.
          </h2>
          <p className="text-base sm:text-lg font-bold text-[#777777] max-w-sm mt-5 leading-snug">
            Make progress every day with bite-sized lessons designed to keep you motivated!
          </p>
        </div>
      </section>

      {/* 6. Section: "duolingo really works!" */}
      <section className="max-w-5xl mx-auto w-full px-6 py-16 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
          <h2 className="text-4xl sm:text-5xl font-black text-[#58cc02] leading-[1.08] tracking-tight">
            duolingo<br />
            really works!
          </h2>
          <p className="text-base sm:text-lg font-bold text-[#777777] max-w-sm mt-5 leading-snug">
            <span className="text-[#1cb0f6] underline cursor-default font-black">Research</span> shows Duolingo courses effectively and efficiently teach reading, listening, and speaking skills.
          </p>
        </div>

        {/* Right: Mock Path Phone Screen */}
        <div className="flex-1 flex justify-center">
          <div className="w-80 sm:w-88 rounded-[36px] border-2 border-[#e5e5e5] bg-white p-5 shadow-2xl relative">
            {/* Top Bar Status */}
            <div className="flex items-center justify-between text-xs font-black text-gray-700 mb-4 px-1">
              <span>🇪🇸</span>
              <span className="text-[#ffc800]">👑 211</span>
              <span className="text-[#ff9600]">🔥 78</span>
              <span className="text-[#ff4b4b]">❤️ 5</span>
              <div className="w-6 h-6 rounded-full bg-[#1cb0f6] text-white text-[10px] flex items-center justify-center font-black">
                PLUS
              </div>
            </div>

            {/* Unit Castle Banner */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-3 text-center mb-3 border border-gray-200">
              <div className="text-2xl mb-1">🏰</div>
              <div className="inline-block bg-[#ffc800] text-white text-[10px] font-black px-3 py-0.5 rounded-md uppercase tracking-wider">
                UNIT 4
              </div>
            </div>

            {/* Gold Popover Guide Card */}
            <div className="bg-[#ffc800] rounded-2xl p-4 text-white text-left shadow-md mb-4">
              <h5 className="font-black text-xs uppercase tracking-wider mb-1">Unit 4</h5>
              <p className="text-[11px] font-bold opacity-95 leading-tight">
                Learn to talk about your health, your studies, and what you do for fun. You can also describe people, places, and things more clearly.
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] font-black bg-amber-600/30 px-2.5 py-1 rounded-lg">
                <span>👑 CROWNS</span>
                <span>0/125</span>
              </div>
            </div>

            {/* Stepping Stones Preview */}
            <div className="flex justify-around text-center py-2 opacity-50">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-gray-300"></div>
                <span className="text-[9px] font-bold text-gray-500">Phrases</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-gray-300"></div>
                <span className="text-[9px] font-bold text-gray-500">Shopping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom Call To Action: "learn a language anytime, anywhere." */}
      <section className="w-full bg-white py-20 px-6 border-t border-gray-100 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl sm:text-5xl font-black text-[#58cc02] leading-tight tracking-tight">
            learn a language<br />
            anytime, anywhere.
          </h2>
          <p className="text-base sm:text-lg font-bold text-[#777777] mt-4 max-w-md">
            Join over half a billion learners on Duolingo.
          </p>

          <div className="mt-8">
            <Link
              href="/courses"
              onClick={() => sound.playClick()}
              className="duo-button duo-button-green text-sm sm:text-base py-4 px-10 uppercase tracking-wider inline-block text-center font-black shadow-lg"
            >
              START LEARNING
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="w-full border-t border-gray-200 py-8 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-8 text-xs font-black text-gray-400 uppercase tracking-widest">
          <span>DUOLINGO</span>
          <span>ABOUT</span>
          <span>CAREERS</span>
          <span>APPS</span>
          <span>INVESTORS</span>
          <span>HELP</span>
          <span>TERMS</span>
          <span>PRIVACY</span>
        </div>
      </footer>
    </div>
  );
}
