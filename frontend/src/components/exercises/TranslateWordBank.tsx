'use client';

import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { Exercise } from '@/types';
import { DuoHappy } from '@/components/ui/Mascots';
import { speakText } from '@/lib/tts';
import { sound } from '@/lib/sound';

interface TranslateWordBankProps {
  exercise: Exercise;
  onAnswerChange: (answer: string[]) => void;
  disabled?: boolean;
}

interface BankWord {
  id: number;
  text: string;
  isUsed: boolean;
}

// Dictionary for hover hints
const WORD_HINTS: Record<string, string> = {
  el: 'the (masc.)',
  la: 'the (fem.)',
  los: 'the (plural)',
  las: 'the (plural)',
  un: 'a / an (masc.)',
  una: 'a / an (fem.)',
  niño: 'boy',
  niña: 'girl',
  hombre: 'man',
  mujer: 'woman',
  come: 'eats / is eating',
  como: 'I eat',
  bebe: 'drinks / is drinking',
  bebo: 'I drink',
  agua: 'water',
  pan: 'bread',
  leche: 'milk',
  manzana: 'apple',
  hola: 'hello',
  adiós: 'goodbye',
  gracias: 'thank you',
  por: 'for / by',
  favor: 'please / favor',
  quiero: 'I want',
  mesa: 'table',
  aeropuerto: 'airport',
  dónde: 'where',
  está: 'is (location)',
  '¿dónde': 'where',
  '¿cómo': 'how',
  estás: 'you are (feeling)',
  buenos: 'good (masc.)',
  días: 'days / morning',
  noches: 'nights / evening',
  buenas: 'good (fem.)',
};

export function TranslateWordBank({ exercise, onAnswerChange, disabled }: TranslateWordBankProps) {
  const [bankWords, setBankWords] = useState<BankWord[]>([]);
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  useEffect(() => {
    try {
      const words: string[] = exercise.options_json ? JSON.parse(exercise.options_json) : [];
      const initialized: BankWord[] = words.map((text, idx) => ({
        id: idx,
        text,
        isUsed: false,
      }));
      setBankWords(initialized);
      setSelectedWordIds([]);
    } catch (e) {
      setBankWords([]);
      setSelectedWordIds([]);
    }
  }, [exercise]);

  const selectWord = (wordId: number) => {
    if (disabled) return;
    sound.playWordTap();

    setBankWords(prev => prev.map(w => w.id === wordId ? { ...w, isUsed: true } : w));
    const nextSelected = [...selectedWordIds, wordId];
    setSelectedWordIds(nextSelected);

    const wordsArray = nextSelected.map(id => bankWords.find(w => w.id === id)?.text || '');
    onAnswerChange(wordsArray);
  };

  const unselectWord = (wordId: number) => {
    if (disabled) return;
    sound.playWordTap();

    setBankWords(prev => prev.map(w => w.id === wordId ? { ...w, isUsed: false } : w));
    const nextSelected = selectedWordIds.filter(id => id !== wordId);
    setSelectedWordIds(nextSelected);

    const wordsArray = nextSelected.map(id => bankWords.find(w => w.id === id)?.text || '');
    onAnswerChange(wordsArray);
  };

  // Clean prompt text for display and split into hoverable tokens
  const promptWords = exercise.prompt.replace(/^(Translate this sentence:|Translate:)\s*/i, '').split(' ');

  const selectedWords = selectedWordIds
    .map(id => bankWords.find(w => w.id === id))
    .filter((w): w is BankWord => w !== undefined);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none text-white">
      <h2 className="text-xl sm:text-2xl font-black text-white self-start mb-6">
        Translate this sentence
      </h2>

      {/* Duo Mascot Character with Dialogue Speech Bubble */}
      <div className="flex items-end gap-3 w-full mb-6">
        <DuoHappy className="w-20 h-20 shrink-0" />

        {/* Comic Speech Bubble */}
        <div className="relative bg-[#131f24] border-2 border-[#37464f] rounded-2xl p-4 shadow-sm flex items-center gap-3 flex-1">
          {/* Bubble Pointer */}
          <div className="absolute -left-2.5 bottom-4 w-4 h-4 bg-[#131f24] border-l-2 border-b-2 border-[#37464f] rotate-45"></div>

          {/* TTS Speaker Button */}
          <button
            onClick={() => {
              sound.playClick();
              speakText(promptWords.join(' '));
            }}
            className="w-9 h-9 rounded-xl bg-[#1cb0f6] text-white hover:bg-[#26bcfd] flex items-center justify-center transition shrink-0 shadow-xs"
            title="Hear sentence"
          >
            <Volume2 className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Prompt Words with Hoverable Translation Tooltips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {promptWords.map((token, idx) => {
              const cleanKey = token.toLowerCase().replace(/[.,!?;:]/g, '');
              const hint = WORD_HINTS[cleanKey];

              return (
                <span
                  key={idx}
                  className="relative group cursor-pointer text-base sm:text-lg font-extrabold text-white border-b-2 border-dashed border-gray-500 hover:text-[#1cb0f6] hover:border-[#1cb0f6] transition"
                  onMouseEnter={() => setHoveredWord(cleanKey)}
                  onMouseLeave={() => setHoveredWord(null)}
                >
                  {token}
                  {hint && (
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex bg-[#202f36] border border-[#37464f] text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-xl z-30 pointer-events-none">
                      {hint}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Words Target Slot Line (Top Box) */}
      <div className="w-full min-h-24 border-b-2 border-t-2 border-[#37464f] py-4 px-3 flex flex-wrap gap-2.5 items-center justify-start mb-8 bg-[#202f36]/30 rounded-2xl">
        {selectedWords.length > 0 ? (
          selectedWords.map((word) => (
            <button
              key={`selected-${word.id}`}
              onClick={() => unselectWord(word.id)}
              disabled={disabled}
              className="duo-word-chip border-2 border-[#1cb0f6] bg-[#18394a] text-[#1cb0f6] font-black text-base shadow-sm animate-in zoom-in-95 duration-100"
            >
              {word.text}
            </button>
          ))
        ) : (
          <span className="text-gray-500 text-sm font-bold pl-2 select-none">
            Tap words from below to translate
          </span>
        )}
      </div>

      {/* Fixed Word Bank Grid (Bottom Bank with Fixed Placeholders) */}
      <div className="flex flex-wrap gap-2.5 justify-center w-full min-h-[100px]">
        {bankWords.map((word) => {
          if (word.isUsed) {
            return (
              <div
                key={`placeholder-${word.id}`}
                className="h-11 px-4 rounded-2xl bg-[#202f36]/40 border-2 border-[#2b3a42] text-transparent select-none font-black text-base flex items-center justify-center opacity-40 cursor-default"
              >
                {word.text}
              </div>
            );
          }

          return (
            <button
              key={`bank-${word.id}`}
              onClick={() => selectWord(word.id)}
              disabled={disabled}
              className="duo-word-chip text-base font-extrabold active:translate-y-1 transition"
            >
              {word.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
