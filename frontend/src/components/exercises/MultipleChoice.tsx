'use client';

import { useEffect } from 'react';
import { Exercise } from '@/types';
import { speakText } from '@/lib/tts';
import { sound } from '@/lib/sound';

interface MultipleChoiceProps {
  exercise: Exercise;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  disabled?: boolean;
}

export function MultipleChoice({ exercise, selectedAnswer, onSelectAnswer, disabled }: MultipleChoiceProps) {
  let options: Array<{ id: string; text: string; subtext?: string }> = [];
  try {
    options = exercise.options_json ? JSON.parse(exercise.options_json) : [];
  } catch (e) {
    options = [];
  }

  // Keyboard shortcut support (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= options.length) {
        const chosen = options[num - 1];
        if (chosen) {
          sound.playWordTap();
          onSelectAnswer(chosen.text);
          speakText(chosen.text);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, disabled, onSelectAnswer]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      {/* Exercise Prompt */}
      <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-8 leading-snug">
        {exercise.prompt}
      </h2>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {options.map((opt, index) => {
          const isSelected = selectedAnswer === opt.text;

          return (
            <div
              key={opt.id || index}
              onClick={() => {
                if (!disabled) {
                  sound.playWordTap();
                  onSelectAnswer(opt.text);
                  speakText(opt.text);
                }
              }}
              className={`p-5 rounded-2xl cursor-pointer flex flex-col items-center justify-center transition-all duration-100 relative border-2 ${
                isSelected
                  ? 'bg-sky-950/50 border-[#1cb0f6] border-b-4 border-b-[#1899d6] text-[#1cb0f6] shadow-md scale-[1.02]'
                  : 'bg-[#131f24] hover:bg-[#202f36] border-[#37464f] border-b-4 text-gray-200'
              } ${disabled ? 'pointer-events-none opacity-90' : ''}`}
            >
              {/* Keyboard Shortcut Number Badge */}
              <span className={`absolute top-3 left-3 text-xs font-black px-2 py-0.5 rounded-lg border ${
                isSelected ? 'bg-sky-900 border-sky-600 text-sky-300' : 'bg-[#202f36] border-[#37464f] text-gray-400'
              }`}>
                {index + 1}
              </span>

              <span className="text-lg font-black mt-2 text-center text-white">{opt.text}</span>
              {opt.subtext && <span className="text-xs font-bold text-gray-400 mt-1">{opt.subtext}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
