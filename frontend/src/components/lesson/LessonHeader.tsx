'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Heart } from 'lucide-react';
import { sound } from '@/lib/sound';

interface LessonHeaderProps {
  progressPercent: number;
  hearts: number;
}

export function LessonHeader({ progressPercent, hearts }: LessonHeaderProps) {
  const router = useRouter();
  const [showQuitModal, setShowQuitModal] = useState(false);

  const handleQuit = () => {
    sound.playClick();
    router.push('/learn');
  };

  return (
    <>
      <header className="w-full max-w-4xl mx-auto px-4 py-6 flex items-center justify-between gap-4 select-none">
        {/* Exit 'X' Button */}
        <button
          onClick={() => {
            sound.playClick();
            setShowQuitModal(true);
          }}
          className="text-gray-400 hover:text-white p-2 rounded-2xl hover:bg-[#202f36] transition"
          title="Quit Lesson"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Glossy Progress Bar */}
        <div className="flex-1 bg-[#202f36] border border-[#37464f] h-4 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="bg-[#58cc02] h-full rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${Math.max(4, progressPercent)}%` }}
          >
            {/* Gloss highlight cap */}
            <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/40 rounded-full"></div>
          </div>
        </div>

        {/* Hearts Counter */}
        <div className="flex items-center gap-1.5 font-black text-[#ff4b4b] text-base">
          <Heart className="w-6 h-6 fill-current text-[#ff4b4b] animate-pulse" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* Quit Confirmation Modal */}
      {showQuitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-[#131f24] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border-2 border-[#37464f] text-white">
            <h3 className="text-2xl font-black text-white mb-2">Wait, don&apos;t go!</h3>
            <p className="text-sm font-bold text-gray-400 mb-6">
              You will lose all progress in this current lesson if you quit now.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowQuitModal(false);
                }}
                className="duo-button duo-button-blue w-full py-3.5 text-sm font-black"
              >
                KEEP LEARNING
              </button>

              <button
                onClick={handleQuit}
                className="duo-button duo-button-dark w-full py-3 text-xs text-red-400 hover:text-red-300"
              >
                END SESSION
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
