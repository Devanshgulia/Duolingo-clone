'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Target, Zap, Gem, Check, Gift, Sparkles, Trophy } from 'lucide-react';
import { Quest } from '@/types';
import { api } from '@/lib/api';
import { sound } from '@/lib/sound';
import { useToast } from '@/components/ui/Toast';

export function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const loadQuests = async () => {
    try {
      setLoading(true);
      const data = await api.getQuests();
      setQuests(data);
    } catch (err) {
      console.error('Failed to load quests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuests();
  }, []);

  const handleClaim = async (questId: number) => {
    try {
      sound.playChestReward();
      await api.claimQuest(questId);
      await loadQuests();
    } catch (err: any) {
      showToast(err.message || 'Failed to claim quest', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex select-none">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6 sm:p-10 max-w-4xl mx-auto w-full">
        {/* Header Banner */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center text-[#ffc800]">
            <Target className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#ffc800]">REWARDS & CHALLENGES</span>
            <h1 className="text-3xl font-black text-white mt-0.5">Quests</h1>
          </div>
        </div>

        {/* Monthly Badge Challenge Banner */}
        <div className="duo-card p-6 bg-gradient-to-r from-purple-900/60 to-indigo-950/60 border-purple-500/40 mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ce82ff] mb-1">
                <Sparkles className="w-4 h-4 fill-current" />
                <span>MONTHLY CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-black text-white">Lily&apos;s Badge Quest</h2>
              <p className="text-xs sm:text-sm font-bold text-gray-300 mt-1 max-w-md">
                Complete daily quests this month to unlock the exclusive Champion Badge!
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-xs border border-white/10">
              <Trophy className="w-7 h-7 text-[#ffc800] fill-current" />
              <div>
                <span className="text-xs font-extrabold text-gray-300 block">Progress</span>
                <span className="text-base font-black text-white">3 / 20 Quests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Quests List */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>Daily Quests</span>
            <span className="text-xs font-bold text-gray-500">• Resets every night</span>
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 font-bold text-gray-500 text-sm">Loading quests...</p>
            </div>
          ) : (
            quests.map((quest) => {
              const percent = Math.min(100, Math.round((quest.current_amount / quest.target_amount) * 100));

              return (
                <div
                  key={quest.id}
                  className="duo-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center text-[#ffc800] shrink-0">
                      <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-black text-base text-white">{quest.title}</h4>
                        <span className="text-xs font-black text-gray-400">
                          {quest.current_amount} / {quest.target_amount}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-400 mb-2">{quest.description}</p>
                      {/* Progress Bar */}
                      <div className="w-full h-3 bg-[#202f36] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ffc800] rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Rewards & Claim Button */}
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <div className="flex items-center gap-2 text-xs font-black text-[#1cb0f6] bg-[#202f36] px-3 py-1.5 rounded-xl border border-[#37464f]">
                      <Gem className="w-4 h-4 fill-current" />
                      <span>+{quest.reward_gems}</span>
                    </div>

                    {quest.is_claimed ? (
                      <span className="text-xs font-black text-green-500 flex items-center gap-1 px-3 py-1.5">
                        <Check className="w-4 h-4 stroke-[3]" /> CLAIMED
                      </span>
                    ) : quest.is_completed ? (
                      <button
                        onClick={() => handleClaim(quest.id)}
                        className="duo-button duo-button-yellow px-5 py-2 text-xs gap-1.5"
                      >
                        <Gift className="w-4 h-4" />
                        CLAIM REWARD
                      </button>
                    ) : (
                      <button
                        disabled
                        className="duo-button duo-button-gray px-4 py-2 text-xs"
                      >
                        IN PROGRESS
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

export default QuestsPage;
