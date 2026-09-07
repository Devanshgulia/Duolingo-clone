'use client';

import React from 'react';

// Official Duolingo Mascot & Characters Vector Illustrations (Pure Dark Theme Compatible)

export function DuoHappy({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <img
      src="/images/duo-path.png"
      alt="Duolingo Owl Mascot"
      className={`inline-block object-contain drop-shadow-2xl select-none ${className}`}
    />
  );
}

// Lily - Iconic purple-haired goth girl standing next to the path with crossed arms
export function LilyCharacter({ className = 'w-32 h-44' }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 180" className={`inline-block ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="70" cy="172" rx="40" ry="6" fill="#000000" fillOpacity="0.4" />
      
      {/* Boots */}
      <rect x="52" y="145" width="14" height="24" rx="4" fill="#202124" />
      <rect x="74" y="145" width="14" height="24" rx="4" fill="#202124" />
      <rect x="50" y="162" width="18" height="8" rx="3" fill="#111215" />
      <rect x="72" y="162" width="18" height="8" rx="3" fill="#111215" />

      {/* Skirt / Dress */}
      <polygon points="70,105 44,146 96,146" fill="#2b1a3d" />
      <rect x="56" y="105" width="28" height="30" fill="#3e2059" />

      {/* Belt */}
      <rect x="54" y="112" width="32" height="5" fill="#55307b" />
      <rect x="66" y="111" width="8" height="7" rx="1" fill="#a855f7" />

      {/* Crossed Arms & Dark Purple Jacket */}
      <path d="M38 78C38 78 30 112 40 126C48 136 60 132 60 132L54 94Z" fill="#3e2059" />
      <path d="M102 78C102 78 110 112 100 126C92 136 80 132 80 132L86 94Z" fill="#3e2059" />
      <rect x="48" y="96" width="44" height="20" rx="8" fill="#2b1a3d" />

      {/* Neck & Face */}
      <rect x="62" y="65" width="16" height="14" fill="#ffd1bc" />
      <ellipse cx="70" cy="52" rx="22" ry="20" fill="#ffd1bc" />

      {/* Half-Closed Bored / Cool Eyes */}
      <path d="M54 50C57 47 64 47 67 50" stroke="#2b1a3d" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="52" r="3" fill="#4a2068" />
      <path d="M73 50C76 47 83 47 86 50" stroke="#2b1a3d" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="52" r="3" fill="#4a2068" />

      {/* Neutral small mouth */}
      <path d="M66 62C68 63 72 63 74 62" stroke="#a4597b" strokeWidth="2" strokeLinecap="round" />

      {/* Signature Purple Bob Haircut */}
      <path d="M70 20C46 20 36 34 36 64C36 82 46 88 48 88C52 88 50 68 56 60C62 52 78 52 84 60C90 68 88 88 92 88C94 88 104 82 104 64C104 34 94 20 70 20Z" fill="#b070f9" />
      {/* Bangs */}
      <path d="M42 46C52 38 68 38 78 46C86 42 96 46 98 50C92 36 82 28 70 28C56 28 46 36 42 46Z" fill="#9333ea" />
    </svg>
  );
}

// Iridescent Glowing Super Duo Owl (from Super Duolingo card in screenshot)
export function SuperDuoIridescent({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={`inline-block ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="superGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>
      </defs>
      <rect x="22" y="14" width="76" height="86" rx="38" fill="url(#superGrad)" />
      <ellipse cx="60" cy="68" rx="26" ry="28" fill="#38bdf8" fillOpacity="0.4" />
      {/* Big starry/cosmic eyes */}
      <ellipse cx="44" cy="40" rx="14" ry="14" fill="#ffffff" fillOpacity="0.9" />
      <circle cx="45" cy="40" r="7" fill="#1e1b4b" />
      <circle cx="48" cy="37" r="3" fill="#ffffff" />
      <ellipse cx="76" cy="40" rx="14" ry="14" fill="#ffffff" fillOpacity="0.9" />
      <circle cx="75" cy="40" r="7" fill="#1e1b4b" />
      <circle cx="78" cy="37" r="3" fill="#ffffff" />
      <polygon points="60,56 52,46 68,46" fill="#f43f5e" />
      {/* Little pink feet */}
      <ellipse cx="40" cy="102" rx="8" ry="4" fill="#f43f5e" />
      <ellipse cx="80" cy="102" rx="8" ry="4" fill="#f43f5e" />
    </svg>
  );
}

// Sleeping Duo on Green Hill (from Gold League card in screenshot)
export function SleepingDuoOnHill({ className = 'w-24 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={`inline-block ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Green Hill */}
      <path d="M10 65C30 50 90 50 110 65L110 75L10 75Z" fill="#58cc02" />
      {/* Sleeping Duo lying down */}
      <ellipse cx="60" cy="50" rx="24" ry="15" fill="#46a302" />
      <ellipse cx="60" cy="48" rx="22" ry="14" fill="#58cc02" />
      {/* Closed sleepy eyes */}
      <path d="M48 46C52 48 56 48 60 46" stroke="#1c1e21" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M64 46C68 48 72 48 76 46" stroke="#1c1e21" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="62,54 58,49 66,49" fill="#ff9600" />
      {/* Floating Zzz */}
      <text x="78" y="32" fill="#84cc16" fontSize="16" fontWeight="900" fontFamily="sans-serif">Z</text>
      <text x="88" y="24" fill="#84cc16" fontSize="12" fontWeight="900" fontFamily="sans-serif">z</text>
      <text x="96" y="16" fill="#84cc16" fontSize="9" fontWeight="900" fontFamily="sans-serif">z</text>
    </svg>
  );
}

// Ad Blocker Duo Peeking Mascot (from bottom right promo card in screenshot)
export function PeekingSuperDuo({ className = 'w-28 h-20' }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 90" className={`inline-block ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="peekGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      {/* Curved top head peeking up */}
      <path d="M20 90C20 40 45 15 70 15C95 15 120 40 120 90Z" fill="url(#peekGrad)" />
      {/* Huge curious eyes */}
      <ellipse cx="50" cy="50" rx="18" ry="18" fill="#ffffff" />
      <circle cx="52" cy="50" r="9" fill="#1e1b4b" />
      <circle cx="55" cy="46" r="3.5" fill="#ffffff" />
      <ellipse cx="90" cy="50" rx="18" ry="18" fill="#ffffff" />
      <circle cx="88" cy="50" r="9" fill="#1e1b4b" />
      <circle cx="91" cy="46" r="3.5" fill="#ffffff" />
      {/* Beak */}
      <polygon points="70,68 62,56 78,56" fill="#fb7185" />
    </svg>
  );
}

export function DuoCelebrating({ className = 'w-32 h-32' }: { className?: string }) {
  return (
    <img
      src="/images/duo-celebrating.png"
      alt="Duolingo Celebrating Owl"
      className={`inline-block object-contain drop-shadow-2xl select-none ${className}`}
    />
  );
}

export function DuoSad({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={`inline-block ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="112" rx="42" ry="7" fill="#000000" fillOpacity="0.3" />
      <rect x="22" y="20" width="76" height="84" rx="38" fill="#58CC02" stroke="#46A302" strokeWidth="3" />
      <ellipse cx="60" cy="72" rx="26" ry="28" fill="#89E219" />
      <ellipse cx="44" cy="46" rx="15" ry="15" fill="#FFFFFF" />
      <circle cx="44" cy="50" r="7" fill="#1C1E21" />
      <circle cx="46" cy="48" r="2.5" fill="#FFFFFF" />
      <ellipse cx="76" cy="46" rx="15" ry="15" fill="#FFFFFF" />
      <circle cx="76" cy="50" r="7" fill="#1C1E21" />
      <circle cx="78" cy="48" r="2.5" fill="#FFFFFF" />
      <path d="M86 56C86 60 83 64 80 64C77 64 76 60 78 57C80 54 86 52 86 56Z" fill="#1CB0F6" />
      <polygon points="60,66 52,56 68,56" fill="#FF9600" />
    </svg>
  );
}

export function DuolingoLogo({ className = 'h-8' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <span className="text-3xl font-black tracking-tight text-[#58cc02] font-sans">
        duolingo
      </span>
    </div>
  );
}
