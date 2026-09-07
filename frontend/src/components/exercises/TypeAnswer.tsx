'use client';

import { Exercise } from '@/types';
import { Volume2 } from 'lucide-react';
import { speakText } from '@/lib/tts';
import { sound } from '@/lib/sound';

interface TypeAnswerProps {
  exercise: Exercise;
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function TypeAnswer({ exercise, value, onChange, onSubmit, disabled }: TypeAnswerProps) {
  const accentChars = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'];

  const insertChar = (char: string) => {
    if (disabled) return;
    sound.playWordTap();
    onChange(value + char);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none text-white">
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          {exercise.prompt}
        </h2>
        <button
          onClick={() => {
            sound.playClick();
            speakText(exercise.prompt);
          }}
          className="w-10 h-10 rounded-2xl bg-[#1cb0f6] text-white hover:bg-[#26bcfd] flex items-center justify-center transition shadow-xs"
          title="Listen prompt"
        >
          <Volume2 className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      <div className="w-full space-y-4">
        <textarea
          autoFocus
          disabled={disabled}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (value.trim()) onSubmit();
            }
          }}
          placeholder="Type your translation in Spanish..."
          className="w-full p-4 rounded-2xl border-2 border-[#37464f] focus:border-[#1cb0f6] focus:ring-4 focus:ring-sky-950/50 outline-none font-bold text-lg text-white bg-[#131f24] resize-none transition shadow-inner"
        />

        {/* Spanish Special Accent Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          {accentChars.map((char) => (
            <button
              key={char}
              type="button"
              disabled={disabled}
              onClick={() => insertChar(char)}
              className="w-9 h-9 rounded-xl bg-[#202f36] hover:bg-[#2a3a42] active:scale-95 border-2 border-[#37464f] text-gray-200 font-extrabold text-base flex items-center justify-center transition"
            >
              {char}
            </button>
          ))}
        </div>

        <p className="text-xs font-bold text-gray-400 text-right">
          Press <kbd className="px-1.5 py-0.5 bg-[#202f36] border border-gray-700 rounded-md font-mono text-gray-300">Enter</kbd> to submit
        </p>
      </div>
    </div>
  );
}
