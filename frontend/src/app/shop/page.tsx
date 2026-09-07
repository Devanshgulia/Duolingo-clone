'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ShoppingBag, Heart, Gem, Sparkles, Snowflake, Zap, Shield, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { sound } from '@/lib/sound';
import { useToast } from '@/components/ui/Toast';

export default function ShopPage() {
  const [buying, setBuying] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleRefill = async () => {
    try {
      sound.playClick();
      setBuying('refill');
      const res = await api.refillHearts();
      sound.playChestReward();
      showToast(res.message, 'heart');
    } catch (err: any) {
      showToast(err.message || 'Refill failed', 'error');
    } finally {
      setBuying(null);
    }
  };

  const handleBuyItem = async (itemName: string) => {
    try {
      sound.playClick();
      setBuying(itemName);
      sound.playChestReward();
      showToast(`Successfully purchased ${itemName}!`, 'gem');
    } catch (err: any) {
      showToast(err.message || 'Purchase failed', 'error');
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex select-none">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6 sm:p-10 max-w-4xl mx-auto w-full">
        {/* Banner Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mx-auto mb-4 border-4 border-purple-500/30 shadow-sm">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white">Duolingo Shop</h1>
          <p className="text-sm font-bold text-gray-400 mt-1">Spend your earned gems on refills, boosts & power-ups</p>
        </div>

        <div className="space-y-4">
          {/* Heart Refill Card */}
          <div className="duo-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center text-[#ff4b4b] border-2 border-red-500/30 shrink-0">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">Full Heart Refill</h3>
                <p className="text-xs font-bold text-gray-400">Restore your health back to 5 full hearts instantly</p>
              </div>
            </div>

            <button
              onClick={handleRefill}
              disabled={buying === 'refill'}
              className="duo-button duo-button-blue px-6 py-3 text-xs flex items-center gap-2 self-end sm:self-auto shrink-0"
            >
              <Gem className="w-4 h-4 fill-current text-sky-200" />
              <span>100 GEMS</span>
            </button>
          </div>

          {/* Streak Freeze Card */}
          <div className="duo-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-sky-500/20 rounded-2xl flex items-center justify-center text-sky-400 border-2 border-sky-500/30 shrink-0">
                <Snowflake className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">Streak Freeze</h3>
                <p className="text-xs font-bold text-gray-400">Protects your streak if you miss a day of practice</p>
              </div>
            </div>

            <button
              onClick={() => handleBuyItem('Streak Freeze')}
              disabled={buying === 'Streak Freeze'}
              className="duo-button duo-button-blue px-6 py-3 text-xs flex items-center gap-2 self-end sm:self-auto shrink-0"
            >
              <Gem className="w-4 h-4 fill-current text-sky-200" />
              <span>200 GEMS</span>
            </button>
          </div>

          {/* Double XP Boost Card */}
          <div className="duo-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-[#ffc800] border-2 border-amber-500/30 shrink-0">
                <Zap className="w-8 h-8 fill-current" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">Double XP Boost (15 Min)</h3>
                <p className="text-xs font-bold text-gray-400">Earn 2x XP for all lesson and practice completions</p>
              </div>
            </div>

            <button
              onClick={() => handleBuyItem('Double XP Boost')}
              disabled={buying === 'Double XP Boost'}
              className="duo-button duo-button-yellow px-6 py-3 text-xs flex items-center gap-2 self-end sm:self-auto shrink-0"
            >
              <Gem className="w-4 h-4 fill-current text-amber-100" />
              <span>150 GEMS</span>
            </button>
          </div>

          {/* Super Duolingo Subscription Card */}
          <div className="duo-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-pink-950/40 border-purple-500/40">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#00f0ff] to-[#e879f9] rounded-2xl flex items-center justify-center text-white shadow-md shrink-0">
                <Sparkles className="w-8 h-8 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-white">Super Duolingo</h3>
                  <span className="bg-gradient-to-r from-[#00f0ff] to-[#e879f9] text-white text-[10px] font-black px-2 py-0.5 rounded-md italic">
                    POPULAR
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-300 mt-0.5">Unlimited hearts, zero ads, and progress mastery</p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                showToast('Super Duolingo free trial activated!', 'success');
              }}
              className="duo-button duo-button-super px-6 py-3 text-xs self-end sm:self-auto shrink-0"
            >
              START FREE TRIAL
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
