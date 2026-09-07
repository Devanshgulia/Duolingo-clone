'use client';

import { useState, useEffect } from 'react';
import { Exercise } from '@/types';
import { Volume2 } from 'lucide-react';
import { speakText } from '@/lib/tts';
import { sound } from '@/lib/sound';

interface FillInBlankProps {
  exercise: Exercise;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  disabled?: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function FillInBlank({ exercise, selectedAnswer, onSelectAnswer, disabled }: FillInBlankProps) {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    try {
      const rawOptions: string[] = exercise.options_json ? JSON.parse(exercise.options_json) : [];
      setOptions(shuffleArray(rawOptions));
    } catch (e) {
      setOptions([]);
    }
  }, [exercise]);

  const promptText = exercise.prompt.replace(/^(Fill in the blank:)\s*/i, '');
  const parts = promptText.split(/_____|____|___|__/);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none text-white">
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Fill in the missing word
        </h2>
        <button
          onClick={() => {
            sound.playClick();
            speakText(promptText.replace(/___/g, selectedAnswer || ''));
          }}
          className="w-10 h-10 rounded-2xl bg-[#1cb0f6] text-white hover:bg-[#26bcfd] flex items-center justify-center transition shadow-xs"
          title="Listen sentence"
        >
          <Volume2 className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Sentence Box with Highlighted Blank Slot */}
      <div className="duo-card p-6 w-full text-center text-xl sm:text-2xl font-black text-white leading-relaxed mb-8 bg-[#131f24]">
        {parts.length > 1 ? (
          <p>
            {parts[0]}
            <span className="inline-block border-b-4 border-[#1cb0f6] bg-sky-950/50 text-[#1cb0f6] px-4 py-1 rounded-xl mx-1.5 min-w-24 text-center font-black animate-pulse">
              {selectedAnswer || '_____'}
            </span>
            {parts[1]}
          </p>
        ) : (
          <p>{promptText}</p>
        )}
      </div>

      {/* Options Selection Chips */}
      <div className="flex flex-wrap gap-3 justify-center w-full">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={opt}
              disabled={disabled}
              onClick={() => {
                sound.playWordTap();
                onSelectAnswer(opt);
                speakText(opt);
              }}
              className={`px-6 py-3.5 rounded-2xl font-black text-lg transition-all duration-100 border-2 ${
                isSelected
                  ? 'bg-[#1cb0f6] border-[#1899d6] border-b-4 text-white shadow-md'
                  : 'bg-[#131f24] hover:bg-[#202f36] border-[#37464f] border-b-4 text-gray-200'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
