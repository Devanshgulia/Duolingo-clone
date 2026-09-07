'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dumbbell, Heart, Zap, Sparkles, ArrowRight, RotateCcw, Clock } from 'lucide-react';
import { sound } from '@/lib/sound';

export function PracticePage() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  const startHeartPractice = () => {
    sound.playClick();
    // Use lesson 1 or dynamic practice
    router.push('/lesson/1');
  };

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex select-none">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6 sm:p-10 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-3xl bg-[#1cb0f6]/20 border-2 border-[#1cb0f6]/30 flex items-center justify-center text-[#1cb0f6]">
            <Dumbbell className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#1cb0f6]">PRACTICE HUB</span>
            <h1 className="text-3xl font-black text-white mt-0.5">Strengthen Your Skills</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Heart Recovery Practice Card */}
          <div className="duo-card p-6 flex flex-col justify-between hover:border-[#ff4b4b] transition group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border-2 border-red-500/30 flex items-center justify-center text-[#ff4b4b] mb-4">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">Heart Recovery Practice</h3>
              <p className="text-sm font-bold text-gray-400 mb-6">
                Review key vocabulary and restore +1 Heart without spending any gems.
              </p>
            </div>

            <button
              onClick={startHeartPractice}
              className="duo-button duo-button-green w-full py-3.5 text-sm gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>START FREE PRACTICE</span>
            </button>
          </div>

          {/* Timed Challenge Card */}
          <div className="duo-card p-6 flex flex-col justify-between hover:border-[#ffc800] transition group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center text-[#ffc800] mb-4">
                <Clock className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">Timed Match Challenge</h3>
              <p className="text-sm font-bold text-gray-400 mb-6">
                Race against the clock to match pairs and earn bonus +20 XP!
              </p>
            </div>

            <button
              onClick={startHeartPractice}
              className="duo-button duo-button-yellow w-full py-3.5 text-sm gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>START TIMED MATCH (+20 XP)</span>
            </button>
          </div>

          {/* Unit Review Card */}
          <div className="duo-card p-6 flex flex-col justify-between hover:border-[#ce82ff] transition group md:col-span-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border-2 border-purple-500/30 flex items-center justify-center text-[#ce82ff]">
                  <RotateCcw className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Mistakes & Weak Words Review</h3>
                  <p className="text-sm font-bold text-gray-400">
                    Focus specifically on questions you missed in past lessons.
                  </p>
                </div>
              </div>

              <button
                onClick={startHeartPractice}
                className="duo-button duo-button-purple px-6 py-3 text-sm shrink-0 gap-2 w-full sm:w-auto"
              >
                <span>REVIEW MISTAKES</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PracticePage;
