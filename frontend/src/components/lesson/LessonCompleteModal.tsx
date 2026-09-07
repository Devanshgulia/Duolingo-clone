'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Zap, Flame, Target } from 'lucide-react';
import { CompleteLessonResult } from '@/types';
import { DuoCelebrating } from '@/components/ui/Mascots';
import { sound } from '@/lib/sound';

interface LessonCompleteModalProps {
  result: CompleteLessonResult;
  accuracyPercent?: number;
  onFinish: () => void;
}

export function LessonCompleteModal({ result, accuracyPercent = 100, onFinish }: LessonCompleteModalProps) {
  useEffect(() => {
    // Multi-angle confetti celebration burst
    const end = Date.now() + 1000;
    const colors = ['#58cc02', '#1cb0f6', '#ffc800', '#ff4b4b', '#ce82ff'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-[#131f24] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-2 border-[#37464f] animate-in zoom-in-95 duration-200 flex flex-col items-center text-white">
        {/* Celebratory Duo Mascot Artwork */}
        <div className="mb-4 relative flex items-center justify-center">
          <div className="absolute w-32 h-32 bg-[#58cc02]/20 rounded-full blur-2xl animate-pulse pointer-events-none"></div>
          <DuoCelebrating className="w-36 h-36 animate-bounce drop-shadow-[0_10px_20px_rgba(88,204,2,0.4)]" />
        </div>

        <h2 className="text-3xl font-black text-[#ffc800] mb-1 tracking-tight">Lesson Complete!</h2>
        <p className="text-xs sm:text-sm font-bold text-gray-400 mb-6">
          You made great progress on your language path!
        </p>

        {/* Stats Summary Grid */}
        <div className="grid grid-cols-3 gap-3 w-full mb-8">
          {/* XP Earned Card */}
          <div className="bg-amber-950/40 border-2 border-amber-800 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">TOTAL XP</span>
            <div className="flex items-center gap-1 mt-1 text-[#ffc800] font-black text-xl">
              <Zap className="w-5 h-5 fill-current" />
              <span>+{result.xp_earned}</span>
            </div>
          </div>

          {/* Accuracy Card */}
          <div className="bg-green-950/40 border-2 border-green-800 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-[10px] font-black text-green-400 uppercase tracking-wider">ACCURACY</span>
            <div className="flex items-center gap-1 mt-1 text-[#58cc02] font-black text-xl">
              <Target className="w-5 h-5" />
              <span>{accuracyPercent}%</span>
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-orange-950/40 border-2 border-orange-800 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider">STREAK</span>
            <div className="flex items-center gap-1 mt-1 text-[#ff9600] font-black text-xl">
              <Flame className="w-5 h-5 fill-current" />
              <span>{result.streak_count}</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            sound.playClick();
            onFinish();
          }}
          className="duo-button duo-button-green w-full py-4 text-base tracking-wider"
        >
          CONTINUE TO PATH
        </button>
      </div>
    </div>
  );
}
