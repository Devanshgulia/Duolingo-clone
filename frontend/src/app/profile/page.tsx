'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { api } from '@/lib/api';
import { UserProfileStats, UserSummary } from '@/types';
import { Flame, Zap, Shield, Trophy, Pencil, X, Search, Mail, ChevronRight } from 'lucide-react';
import { DuoHappy } from '@/components/ui/Mascots';
import { sound } from '@/lib/sound';
import { useToast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileStats | null>(null);
  const [userSummary, setUserSummary] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');
  const [dismissedSuggestion, setDismissedSuggestion] = useState<boolean>(false);
  const [celebrated, setCelebrated] = useState<boolean>(false);
  const { showToast } = useToast();

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [pData, uData] = await Promise.all([
        api.getUserProfile(),
        api.getUserSummary().catch(() => null)
      ]);
      setProfile(pData);
      setUserSummary(uData);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const friends = [
    { id: 1, name: 'Vinit', xp: 14494, color: '#1cb0f6' },
    { id: 2, name: 'Vanshika', xp: 6365, color: '#ff4b4b' },
    { id: 3, name: 'Anshika', xp: 1230, color: '#b865f8' },
  ];

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex select-none">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Right-aligned Topbar with Spanish Flag, Streak, Gems, Hearts */}
        <TopBar userSummary={userSummary} />

        <div className="flex-1 flex justify-center max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 gap-8">
          {/* Main Left Column (Profile & Stats) */}
          <main className="flex-1 max-w-2xl flex flex-col space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-[#58cc02] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-black text-gray-400 text-sm">Loading Profile...</p>
              </div>
            ) : profile ? (
              <>
                {/* 1. Large Avatar Card with Grey Backdrop and Edit Icon */}
                <div className="relative w-full h-64 bg-[#7a8691] rounded-3xl overflow-hidden flex items-end justify-center shadow-lg border-2 border-[#8b99a6]/30">
                  {/* Edit Pencil Button */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      showToast('You can change your avatar in Settings!', 'info');
                    }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#202f36]/70 hover:bg-[#202f36] border border-white/20 flex items-center justify-center text-white transition hover:scale-105 active:scale-95 shadow-md"
                    title="Edit profile avatar"
                  >
                    <Pencil className="w-5 h-5 stroke-[2.5]" />
                  </button>

                  {/* Character Illustration SVG */}
                  <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-2xl">
                    {/* Grey Turtleneck Sweater */}
                    <path d="M50 160 Q100 130 150 160 L160 200 L40 200 Z" fill="#2d3748" />
                    <rect x="75" y="130" width="50" height="35" rx="10" fill="#4a5568" />
                    {/* Head / Neck */}
                    <rect x="85" y="115" width="30" height="25" fill="#f6ad55" />
                    {/* Face */}
                    <rect x="65" y="55" width="70" height="70" rx="20" fill="#f6ad55" />
                    {/* Ears */}
                    <circle cx="65" cy="90" r="10" fill="#ed8936" />
                    <circle cx="135" cy="90" r="10" fill="#ed8936" />
                    {/* Black Hair */}
                    <path d="M60 70 Q100 25 140 70 Q145 50 130 40 Q100 30 70 40 Q55 50 60 70 Z" fill="#1a202c" />
                    <path d="M65 60 Q85 75 100 60 Q115 75 135 60" fill="#1a202c" />
                    {/* Wide Cartoon Eyes */}
                    <ellipse cx="85" cy="85" rx="7" ry="10" fill="#ffffff" />
                    <circle cx="87" cy="87" r="4.5" fill="#1a202c" />
                    <ellipse cx="115" cy="85" rx="7" ry="10" fill="#ffffff" />
                    <circle cx="113" cy="87" r="4.5" fill="#1a202c" />
                    {/* Nose & Smile */}
                    <circle cx="100" cy="96" r="2.5" fill="#dd6b20" />
                    <path d="M94 104 Q100 110 106 104" stroke="#1a202c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>

                {/* 2. User Info & Course Badges */}
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.display_name || profile.username || 'Learner'}</h1>
                    <p className="text-sm font-bold text-gray-400 mt-0.5">@{profile.username || 'learner'}</p>
                    <p className="text-xs font-bold text-gray-500 mt-1">Joined January 2026</p>

                    <div className="flex items-center gap-4 mt-3 text-sm font-black">
                      <span className="text-[#1cb0f6] hover:underline cursor-pointer">3 Following</span>
                      <span className="text-[#1cb0f6] hover:underline cursor-pointer">3 Followers</span>
                    </div>
                  </div>

                  {/* Course Flags: Spanish Only */}
                  <div className="flex items-center gap-2 pt-1">
                    {/* Spanish Flag */}
                    <div className="w-8 h-5.5 rounded-md border border-white/20 flex flex-col shadow-sm overflow-hidden" title="Spanish Course">
                      <div className="w-full h-1/4 bg-[#de2010]"></div>
                      <div className="w-full h-2/4 bg-[#ffc400] flex items-center pl-1">
                        <div className="w-1.5 h-2 bg-[#de2010] rounded-[1px]"></div>
                      </div>
                      <div className="w-full h-1/4 bg-[#de2010]"></div>
                    </div>
                  </div>
                </div>

                {/* 3. Statistics 2x2 Grid */}
                <div>
                  <h2 className="text-xl font-black text-white mb-4">Statistics</h2>
                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Day Streak */}
                    <div className="bg-[#131f24] border-2 border-[#202f36] rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center text-gray-500">
                        <Flame className="w-8 h-8 fill-current text-gray-600" />
                      </div>
                      <div>
                        <span className="text-xl font-black text-white">{profile.streak_count}</span>
                        <p className="text-xs font-bold text-gray-400 mt-0.5">Day streak</p>
                      </div>
                    </div>

                    {/* Total XP */}
                    <div className="bg-[#131f24] border-2 border-[#202f36] rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center text-[#ffc800]">
                        <Zap className="w-8 h-8 fill-current text-[#ffc800]" />
                      </div>
                      <div>
                        <span className="text-xl font-black text-white">{profile.xp_total}</span>
                        <p className="text-xs font-bold text-gray-400 mt-0.5">Total XP</p>
                      </div>
                    </div>

                    {/* Current League */}
                    <div className="bg-[#131f24] border-2 border-[#202f36] rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center text-[#ffc800]">
                        <Shield className="w-8 h-8 fill-current text-[#ffc800]" />
                      </div>
                      <div>
                        <span className="text-xl font-black text-white">{profile.league || 'Bronze'}</span>
                        <p className="text-xs font-bold text-gray-400 mt-0.5">Current league</p>
                      </div>
                    </div>

                    {/* Top 3 Finishes */}
                    <div className="bg-[#131f24] border-2 border-[#202f36] rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center text-gray-500">
                        <Trophy className="w-8 h-8 fill-current text-gray-600" />
                      </div>
                      <div>
                        <span className="text-xl font-black text-white">0</span>
                        <p className="text-xs font-bold text-gray-400 mt-0.5">Top 3 finishes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Friend Suggestions Card */}
                {!dismissedSuggestion && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xl font-black text-white">Friend suggestions</h2>
                      <button
                        onClick={() => {
                          sound.playClick();
                          showToast('Search friends using the sidebar search!', 'info');
                        }}
                        className="text-xs font-black text-[#1cb0f6] hover:text-[#38bdf8] uppercase tracking-wider"
                      >
                        VIEW ALL
                      </button>
                    </div>

                    <div className="bg-[#131f24] border-2 border-[#202f36] rounded-2xl p-4 flex items-center justify-between relative">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-[#b865f8] flex items-center justify-center text-white font-black text-lg shadow-sm">
                          V
                        </div>
                        <div>
                          <h4 className="font-black text-base text-white">vani jha</h4>
                          <p className="text-xs font-bold text-gray-400">Followed by Vinit</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setDismissedSuggestion(true)}
                        className="text-gray-500 hover:text-gray-300 p-1 rounded-lg transition"
                        title="Dismiss suggestion"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </main>

          {/* Right Column: Celebration, Following list, Add friends */}
          <aside className="hidden lg:block w-80 space-y-4 select-none">
            {/* 1. Friend Celebration Card */}
            <div className="bg-[#131f24] border-2 border-[#202f36] rounded-3xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-200 border-2 border-orange-300 flex items-center justify-center text-lg">
                    👧
                  </div>
                  <div>
                    <h5 className="font-black text-sm text-white">Vanshika</h5>
                    <p className="text-[11px] font-bold text-gray-400">2 days</p>
                  </div>
                </div>

                <div className="w-10 h-10 shrink-0">
                  <DuoHappy className="w-10 h-10" />
                </div>
              </div>

              <p className="text-xs font-bold text-gray-300 mb-4 leading-relaxed">
                Came back to learn English after 1 month!
              </p>

              <button
                onClick={() => {
                  sound.playVictory();
                  setCelebrated(true);
                }}
                disabled={celebrated}
                className={`w-full py-2.5 rounded-2xl border-2 font-black text-xs flex items-center justify-center gap-2 uppercase tracking-wider transition ${
                  celebrated
                    ? 'bg-amber-500/20 border-amber-500/50 text-[#ffc800]'
                    : 'bg-[#202f36] border-[#37464f] hover:bg-[#2b3a42] text-white'
                }`}
              >
                <span>🎉</span>
                <span>{celebrated ? 'CELEBRATED!' : 'CELEBRATE'}</span>
              </button>
            </div>

            {/* 2. Following / Followers List */}
            <div className="bg-[#131f24] border-2 border-[#202f36] rounded-3xl overflow-hidden shadow-sm">
              {/* Tabs */}
              <div className="flex border-b-2 border-[#202f36]">
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('following');
                  }}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-wider text-center border-b-2 transition ${
                    activeTab === 'following'
                      ? 'border-[#1cb0f6] text-[#1cb0f6]'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  FOLLOWING
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('followers');
                  }}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-wider text-center border-b-2 transition ${
                    activeTab === 'followers'
                      ? 'border-[#1cb0f6] text-[#1cb0f6]'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  FOLLOWERS
                </button>
              </div>

              {/* Friends List */}
              <div className="p-3 space-y-2">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#202f36] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm"
                        style={{ backgroundColor: friend.color }}
                      >
                        {friend.name[0]}
                      </div>
                      <div>
                        <h5 className="font-black text-sm text-white">{friend.name}</h5>
                        <p className="text-[11px] font-bold text-gray-400">{friend.xp} XP</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Add Friends Card */}
            <div className="bg-[#131f24] border-2 border-[#202f36] rounded-3xl p-5 shadow-sm">
              <h4 className="font-black text-base text-white mb-3">Add friends</h4>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    showToast('Find Friends: Search learners by username or email!', 'info');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#202f36] transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-950 flex items-center justify-center text-[#1cb0f6]">
                      <Search className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs text-white">Find friends</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    showToast('Share your referral link to earn 1 week of Super Duolingo free!', 'success');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#202f36] transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-green-950 flex items-center justify-center text-[#58cc02]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs text-white">Invite friends</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
