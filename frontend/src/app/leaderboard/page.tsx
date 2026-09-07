'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { api } from '@/lib/api';
import { LeaderboardEntry } from '@/types';
import { Trophy, Zap, Shield } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await api.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#131f24] flex">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6 sm:p-10 max-w-3xl mx-auto w-full">
        {/* Banner Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-4 border-4 border-amber-500/30 shadow-sm">
            <Trophy className="w-10 h-10 fill-current" />
          </div>
          <h1 className="text-3xl font-black text-white">Bronze League</h1>
          <p className="text-sm font-bold text-gray-500 mt-1">Top learners ranked by total XP</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-black text-gray-500 text-sm">Loading Leaderboard...</p>
          </div>
        ) : (
          <div className="duo-card overflow-hidden border-2 border-[#37464f]">
            <div className="divide-y-2 divide-[#37464f]">
              {leaderboard.map((entry) => (
                <div
                  key={entry.user_id}
                  className={`p-4 flex items-center justify-between transition ${
                    entry.is_current_user
                      ? 'bg-blue-500/10 border-l-4 border-l-blue-500 font-extrabold'
                      : 'hover:bg-[#202f36]'
                  }`}
                >
                  {/* Rank & User Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center font-black text-lg text-[#afafaf]">
                      {entry.rank === 1 ? (
                        <span className="text-2xl">🥇</span>
                      ) : entry.rank === 2 ? (
                        <span className="text-2xl">🥈</span>
                      ) : entry.rank === 3 ? (
                        <span className="text-2xl">🥉</span>
                      ) : (
                        <span>{entry.rank}</span>
                      )}
                    </div>

                    <img
                      src={entry.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=duo'}
                      alt="Avatar"
                      className="w-11 h-11 rounded-full border-2 border-[#37464f] bg-[#131f24]"
                    />

                    <div>
                      <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                        <span>{entry.display_name}</span>
                        {entry.is_current_user && (
                          <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                            YOU
                          </span>
                        )}
                      </h4>
                      <p className="text-xs font-bold text-gray-500">@{entry.username}</p>
                    </div>
                  </div>

                  {/* XP Total Badge */}
                  <div className="flex items-center gap-1.5 font-black text-amber-500 text-base">
                    <Zap className="w-5 h-5 fill-current" />
                    <span>{entry.xp_total} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
