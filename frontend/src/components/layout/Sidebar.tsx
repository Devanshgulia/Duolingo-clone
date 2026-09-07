'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { DuolingoLogo } from '@/components/ui/Mascots';
import { sound } from '@/lib/sound';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isMoreHovered, setIsMoreHovered] = useState(false);
  const moreTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="w-64 fixed left-0 top-0 bottom-0 border-r-2 border-[#202f36] bg-[#131f24] flex flex-col justify-between px-4 py-6 z-40 hidden md:flex select-none">
        <div>
          {/* Brand Logo */}
          <div className="px-3 mb-7">
            <Link href="/learn" onClick={() => sound.playClick()}>
              <DuolingoLogo className="cursor-pointer hover:opacity-90 transition" />
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {/* LEARN */}
            <Link
              href="/learn"
              onClick={() => sound.playClick()}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider transition-all duration-100 border-2 ${
                pathname === '/learn' || pathname === '/'
                  ? 'bg-[#18394a] border-[#1cb0f6] text-[#1cb0f6]'
                  : 'border-transparent text-[#77868f] hover:bg-[#202f36]'
              }`}
            >
              {/* Cute House Icon with Orange Roof & Yellow Body */}
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <path d="M12 3L2 11H5V20C5 20.55 5.45 21 6 21H18C18.55 21 19 20.55 19 20V11H22L12 3Z" fill="#ff9600" />
                  <rect x="7" y="10" width="10" height="11" fill="#ffc800" rx="1" />
                  <rect x="9.5" y="14" width="5" height="7" fill="#e68700" rx="0.5" />
                </svg>
              </div>
              <span>LEARN</span>
            </Link>

            {/* PRACTICE */}
            <Link
              href="/practice"
              onClick={() => sound.playClick()}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider transition-all duration-100 border-2 ${
                pathname === '/practice'
                  ? 'bg-[#18394a] border-[#1cb0f6] text-[#1cb0f6]'
                  : 'border-transparent text-[#77868f] hover:bg-[#202f36]'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#1cb0f6]">
                  <path d="M20 7H22V17H20V15H18V17H16V13H8V17H6V15H4V17H2V7H4V9H6V7H8V11H16V7H18V9H20V7Z" />
                </svg>
              </div>
              <span>PRACTICE</span>
            </Link>

            {/* LEADERBOARDS */}
            <Link
              href="/leaderboard"
              onClick={() => sound.playClick()}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider transition-all duration-100 border-2 ${
                pathname === '/leaderboard'
                  ? 'bg-[#18394a] border-[#1cb0f6] text-[#1cb0f6]'
                  : 'border-transparent text-[#77868f] hover:bg-[#202f36]'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#ffc800]">
                  <path d="M12 2L4 5V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V5L12 2Z" />
                </svg>
              </div>
              <span>LEADERBOARDS</span>
            </Link>

            {/* QUESTS */}
            <Link
              href="/quests"
              onClick={() => sound.playClick()}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider transition-all duration-100 border-2 ${
                pathname === '/quests'
                  ? 'bg-[#18394a] border-[#1cb0f6] text-[#1cb0f6]'
                  : 'border-transparent text-[#77868f] hover:bg-[#202f36]'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <rect x="3" y="9" width="18" height="12" rx="2" fill="#ffc800" />
                  <rect x="2" y="5" width="20" height="5" rx="1.5" fill="#e6b400" />
                  <circle cx="12" cy="14" r="2.5" fill="#ff4b4b" />
                </svg>
              </div>
              <span>QUESTS</span>
            </Link>

            {/* SHOP */}
            <Link
              href="/shop"
              onClick={() => sound.playClick()}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider transition-all duration-100 border-2 ${
                pathname === '/shop'
                  ? 'bg-[#18394a] border-[#1cb0f6] text-[#1cb0f6]'
                  : 'border-transparent text-[#77868f] hover:bg-[#202f36]'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M4 4H20L22 9H2L4 4Z" fill="#ff4b4b" />
                  <rect x="4" y="9" width="16" height="12" rx="1" fill="#ffffff" />
                  <rect x="8" y="13" width="8" height="8" rx="1" fill="#ff4b4b" />
                </svg>
              </div>
              <span>SHOP</span>
            </Link>

            {/* PROFILE */}
            <Link
              href="/profile"
              onClick={() => sound.playClick()}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider transition-all duration-100 border-2 ${
                pathname === '/profile'
                  ? 'bg-[#18394a] border-[#1cb0f6] text-[#1cb0f6]'
                  : 'border-transparent text-[#77868f] hover:bg-[#202f36]'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#ff9600] flex items-center justify-center text-white text-xs font-black shrink-0 border border-white/40">
                👤
              </div>
              <span>PROFILE</span>
            </Link>

            {/* MORE (Hover Flyout Menu) */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
                setIsMoreHovered(true);
              }}
              onMouseLeave={() => {
                if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
                moreTimeoutRef.current = setTimeout(() => {
                  setIsMoreHovered(false);
                }, 150);
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider transition-all duration-100 border-2 cursor-pointer ${
                  isMoreHovered || pathname === '/settings'
                    ? 'bg-[#18394a] border-[#1cb0f6] text-[#1cb0f6]'
                    : 'border-transparent text-[#77868f] hover:bg-[#202f36]'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-[#ce82ff] flex items-center justify-center text-white text-xs font-black shrink-0">
                  •••
                </div>
                <span>MORE</span>
              </button>

              {/* Flyout Popover Menu on Hover (Screenshot 1) */}
              {isMoreHovered && (
                <div
                  onMouseEnter={() => {
                    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
                    setIsMoreHovered(true);
                  }}
                  onMouseLeave={() => {
                    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
                    moreTimeoutRef.current = setTimeout(() => {
                      setIsMoreHovered(false);
                    }, 150);
                  }}
                  className="absolute left-full ml-4 bottom-0 w-72 bg-[#19262c] border-2 border-[#2b3a42] rounded-3xl shadow-2xl z-50 p-3.5 animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* Left Arrow Pointer */}
                  <div className="absolute bottom-5 -left-2 w-4 h-4 bg-[#19262c] border-l-2 border-b-2 border-[#2b3a42] rotate-45"></div>

                  {/* Top Group with Icons */}
                  <div className="space-y-1">
                    {/* DUOLINGO ENGLISH TEST */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        showToast('Duolingo English Test: Certify your English proficiency online!', 'info');
                      }}
                      className="w-full flex items-center gap-4 px-3.5 py-3 rounded-2xl hover:bg-[#202f36] text-left transition"
                    >
                      <div className="w-7 h-7 rounded-xl bg-[#58cc02] flex items-center justify-center text-white text-sm shrink-0 shadow-xs">
                        🛡️
                      </div>
                      <span className="font-black text-xs text-white tracking-wider uppercase">
                        DUOLINGO ENGLISH TEST
                      </span>
                    </button>

                    {/* SCHOOLS */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        showToast('Duolingo for Schools: Free tools for teachers!', 'info');
                      }}
                      className="w-full flex items-center gap-4 px-3.5 py-3 rounded-2xl hover:bg-[#202f36] text-left transition"
                    >
                      <div className="w-7 h-7 rounded-xl bg-[#1cb0f6]/20 flex items-center justify-center text-base shrink-0">
                        🌍
                      </div>
                      <span className="font-black text-xs text-white tracking-wider uppercase">
                        SCHOOLS
                      </span>
                    </button>

                    {/* PODCAST */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        showToast('Duolingo Podcast: Fascinating stories in Spanish!', 'info');
                      }}
                      className="w-full flex items-center gap-4 px-3.5 py-3 rounded-2xl hover:bg-[#202f36] text-left transition"
                    >
                      <div className="w-7 h-7 rounded-xl bg-[#ce82ff]/20 flex items-center justify-center text-base shrink-0 text-[#ce82ff]">
                        🎧
                      </div>
                      <span className="font-black text-xs text-white tracking-wider uppercase">
                        PODCAST
                      </span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t-2 border-[#202f36] my-2"></div>

                  {/* Bottom Group (Coach/Edit Goal, Settings, Help, Log Out) */}
                  <div className="space-y-1">
                    {/* EDIT GOAL */}
                    <Link
                      href="/settings/coach"
                      onClick={() => {
                        sound.playClick();
                        setIsMoreHovered(false);
                      }}
                      className="w-full flex items-center px-3.5 py-2.5 rounded-2xl hover:bg-[#202f36] text-xs font-black text-[#58cc02] hover:text-[#58cc02] tracking-wider uppercase transition"
                    >
                      🎯 EDIT DAILY GOAL
                    </Link>

                    {/* SETTINGS */}
                    <Link
                      href="/settings"
                      onClick={() => {
                        sound.playClick();
                        setIsMoreHovered(false);
                      }}
                      className="w-full flex items-center px-3.5 py-2.5 rounded-2xl hover:bg-[#202f36] text-xs font-black text-gray-300 hover:text-white tracking-wider uppercase transition"
                    >
                      SETTINGS
                    </Link>

                    {/* HELP */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        showToast('Duolingo Help Center: Need assistance?', 'info');
                      }}
                      className="w-full flex items-center px-3.5 py-2.5 rounded-2xl hover:bg-[#202f36] text-xs font-black text-gray-300 hover:text-white tracking-wider uppercase transition text-left"
                    >
                      HELP
                    </button>

                    {/* LOG OUT / LOG IN */}
                    {user ? (
                      <button
                        onClick={() => {
                          sound.playClick();
                          setIsMoreHovered(false);
                          logout();
                          showToast('Logged out successfully.', 'info');
                          router.push('/');
                        }}
                        className="w-full flex items-center px-3.5 py-2.5 rounded-2xl hover:bg-[#202f36] text-xs font-black text-[#ff4b4b] hover:text-red-400 tracking-wider uppercase transition text-left"
                      >
                        LOG OUT
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => {
                          sound.playClick();
                          setIsMoreHovered(false);
                        }}
                        className="w-full flex items-center px-3.5 py-2.5 rounded-2xl hover:bg-[#202f36] text-xs font-black text-[#1cb0f6] hover:text-blue-400 tracking-wider uppercase transition"
                      >
                        LOG IN
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Navigation Items (End of top group) */}
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#131f24] border-t-2 border-[#202f36] z-40 flex items-center justify-around px-2">
        <Link href="/learn" onClick={() => sound.playClick()} className="p-2 text-[#1cb0f6]">
          <span className="text-2xl">🏠</span>
        </Link>
        <Link href="/practice" onClick={() => sound.playClick()} className="p-2 text-gray-400">
          <span className="text-2xl">🏋️</span>
        </Link>
        <Link href="/leaderboard" onClick={() => sound.playClick()} className="p-2 text-gray-400">
          <span className="text-2xl">🛡️</span>
        </Link>
        <Link href="/quests" onClick={() => sound.playClick()} className="p-2 text-gray-400">
          <span className="text-2xl">🗃️</span>
        </Link>
        <Link href="/profile" onClick={() => sound.playClick()} className="p-2 text-gray-400">
          <span className="text-2xl">👤</span>
        </Link>
      </nav>
    </>
  );
}
