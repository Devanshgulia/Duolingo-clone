'use client';

import { useRouter } from 'next/navigation';
import { RefreshCw, Sparkles, Home } from 'lucide-react';
import { DuoSad } from '@/components/ui/Mascots';
import { sound } from '@/lib/sound';

interface OutOfHeartsModalProps {
  onRefill: () => void;
  onQuit: () => void;
}

export function OutOfHeartsModal({ onRefill, onQuit }: OutOfHeartsModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-[#131f24] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-2 border-[#37464f] animate-in zoom-in-95 duration-200 flex flex-col items-center text-white">
        {/* Sad Crying Duo Mascot */}
        <div className="mb-4">
          <DuoSad className="w-28 h-28" />
        </div>

        <h2 className="text-3xl font-black text-[#ff4b4b] mb-1">You ran out of hearts!</h2>
        <p className="text-xs sm:text-sm font-bold text-gray-400 mb-6">
          Keep practicing without pressure by refilling hearts or completing a quick review.
        </p>

        <div className="space-y-3 w-full">
          {/* Refill Button */}
          <button
            onClick={() => {
              sound.playClick();
              onRefill();
            }}
            className="duo-button duo-button-blue w-full py-4 text-sm gap-2"
          >
            <RefreshCw className="w-4 h-4 stroke-[3]" />
            REFILL HEARTS (100 GEMS)
          </button>

          {/* Free Practice Button */}
          <button
            onClick={() => {
              sound.playClick();
              router.push('/practice');
            }}
            className="duo-button duo-button-green w-full py-3.5 text-sm gap-2"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            FREE PRACTICE (+1 HEART)
          </button>

          {/* Quit Button */}
          <button
            onClick={() => {
              sound.playClick();
              onQuit();
            }}
            className="duo-button duo-button-dark w-full py-3 text-xs text-gray-400"
          >
            <Home className="w-4 h-4" />
            QUIT TO PATH
          </button>
        </div>
      </div>
    </div>
  );
}
