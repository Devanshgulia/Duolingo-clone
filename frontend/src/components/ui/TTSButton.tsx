'use client';

import { Volume2 } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';

interface TTSButtonProps {
  text: string;
  lang?: string;
}

export function TTSButton({ text, lang = 'es-ES' }: TTSButtonProps) {
  const { speak } = useTTS();

  return (
    <button
      onClick={() => speak(text, lang)}
      className="p-2.5 rounded-2xl bg-blue-500 hover:bg-blue-400 border-b-4 border-blue-600 active:border-b-0 active:translate-y-1 transition-all text-white shrink-0 shadow-sm inline-flex items-center justify-center"
      title="Listen"
      aria-label="Listen to pronunciation"
    >
      <Volume2 className="w-5 h-5 fill-current stroke-[1.5]" />
    </button>
  );
}
