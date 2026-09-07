'use client';

import { useEffect } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/sound';

interface FeedbackBarProps {
  status: 'idle' | 'correct' | 'incorrect';
  correctAnswer?: string;
  explanation?: string;
  hasSelection: boolean;
  isEvaluating: boolean;
  onCheck: () => void;
  onContinue: () => void;
}

export function FeedbackBar({
  status,
  correctAnswer,
  explanation,
  hasSelection,
  isEvaluating,
  onCheck,
  onContinue,
}: FeedbackBarProps) {
  const isCorrect = status === 'correct';
  const isIncorrect = status === 'incorrect';

  // Global Enter key handler for instant keyboard continuation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (status === 'idle' && hasSelection && !isEvaluating) {
          e.preventDefault();
          onCheck();
        } else if (status !== 'idle') {
          e.preventDefault();
          onContinue();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, hasSelection, isEvaluating, onCheck, onContinue]);

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 py-6 px-6 z-40 transition-colors duration-200 border-t-2 select-none bg-[#131f24] ${
        isCorrect
          ? 'border-[#58cc02]'
          : isIncorrect
          ? 'border-[#ff4b4b]'
          : 'border-[#37464f]'
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Feedback Message */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {isCorrect && (
            <>
              <div className="w-12 h-12 rounded-full bg-[#202f36] flex items-center justify-center text-[#58cc02] shadow-sm shrink-0 border-2 border-[#58cc02]">
                <Check className="w-7 h-7 stroke-[4]" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-[#58cc02]">
                  {explanation || 'Nicely done!'}
                </h4>
                <p className="text-xs font-bold text-green-400">You got it right.</p>
              </div>
            </>
          )}

          {isIncorrect && (
            <>
              <div className="w-12 h-12 rounded-full bg-[#202f36] flex items-center justify-center text-[#ff4b4b] shadow-sm shrink-0 border-2 border-[#ff4b4b]">
                <X className="w-7 h-7 stroke-[4]" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-[#ff4b4b]">Correct solution:</h4>
                <p className="text-base font-black text-red-400 mt-0.5">{correctAnswer}</p>
              </div>
            </>
          )}

          {status === 'idle' && (
            <div className="hidden sm:block text-xs font-extrabold text-gray-400">
              Select or type your answer to check
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto flex justify-end">
          {status === 'idle' ? (
            <button
              disabled={!hasSelection || isEvaluating}
              onClick={() => {
                sound.playClick();
                onCheck();
              }}
              className={`w-full sm:w-44 py-3.5 rounded-2xl font-black tracking-wider text-sm uppercase transition ${
                hasSelection && !isEvaluating
                  ? 'duo-button duo-button-green shadow-md'
                  : 'bg-[#37464f] text-gray-500 border-b-4 border-[#202f36] cursor-not-allowed'
              }`}
            >
              {isEvaluating ? 'CHECKING...' : 'CHECK'}
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onContinue();
              }}
              className={`w-full sm:w-44 py-3.5 rounded-2xl font-black tracking-wider text-sm uppercase shadow-md flex items-center justify-center gap-2 transition ${
                isCorrect ? 'duo-button duo-button-green' : 'duo-button duo-button-red'
              }`}
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
