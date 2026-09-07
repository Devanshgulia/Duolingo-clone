'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Exercise } from '@/types';
import { speakText } from '@/lib/tts';
import { sound } from '@/lib/sound';

interface MatchPairsProps {
  exercise: Exercise;
  onAnswerChange: (matchedPairs: Record<string, string>) => void;
  onAutoComplete?: (matchedPairs?: Record<string, string>) => void;
  disabled?: boolean;
}

export function MatchPairs({ exercise, onAnswerChange, onAutoComplete, disabled }: MatchPairsProps) {
  const [leftItems, setLeftItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);
  const [targetPairs, setTargetPairs] = useState<Record<string, string>>({});

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);

  useEffect(() => {
    try {
      const data = exercise.options_json ? JSON.parse(exercise.options_json) : {};
      const pairs: Record<string, string> = data.pairs || {};

      setLeftItems(data.left || Object.keys(pairs));
      setRightItems(data.right || Object.values(pairs));
      setTargetPairs(pairs);
      setMatchedPairs({});
      setSelectedLeft(null);
      setSelectedRight(null);
      setWrongPair(null);
    } catch (e) {
      setLeftItems([]);
      setRightItems([]);
    }
  }, [exercise]);

  const handleSelectLeft = (item: string) => {
    if (disabled || matchedPairs[item]) return;
    sound.playWordTap();
    setSelectedLeft(item);
    speakText(item);
    if (selectedRight) {
      checkPair(item, selectedRight);
    }
  };

  const handleSelectRight = (item: string) => {
    if (disabled || Object.values(matchedPairs).includes(item)) return;
    sound.playWordTap();
    setSelectedRight(item);
    if (selectedLeft) {
      checkPair(selectedLeft, item);
    }
  };

  const checkPair = useCallback((left: string, right: string) => {
    const isDirectMatch = targetPairs[left] === right;
    const isReverseMatch = targetPairs[right] === left;

    if (isDirectMatch || isReverseMatch) {
      // Correct Match!
      sound.playWordTap();
      const standardKey = isDirectMatch ? left : right;
      const standardVal = isDirectMatch ? right : left;
      const newMatched = { ...matchedPairs, [standardKey]: standardVal };
      setMatchedPairs(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      onAnswerChange(newMatched);

      // Auto-submit when all pairs are matched
      if (Object.keys(newMatched).length >= Object.keys(targetPairs).length) {
        setTimeout(() => {
          onAutoComplete?.(newMatched);
        }, 400);
      }
    } else {
      // Incorrect Match
      sound.playIncorrect();
      setWrongPair({ left, right });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  }, [matchedPairs, targetPairs, onAnswerChange, onAutoComplete]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none text-white">
      <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-8">
        {exercise.prompt}
      </h2>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Left Column (Spanish) */}
        <div className="space-y-3">
          {leftItems.map((item) => {
            const isMatched = !!matchedPairs[item];
            const isSelected = selectedLeft === item;
            const isWrong = wrongPair?.left === item;

            return (
              <motion.button
                key={`left-${item}`}
                whileTap={!isMatched && !disabled ? { scale: 0.96 } : {}}
                animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => handleSelectLeft(item)}
                disabled={isMatched || disabled}
                className={`w-full p-4 rounded-2xl font-black text-base transition-all duration-100 border-2 text-center flex items-center justify-center ${
                  isMatched
                    ? 'border-transparent bg-transparent text-gray-600 opacity-40 cursor-default'
                    : isWrong
                    ? 'bg-red-950 border-red-500 text-red-500 border-b-4'
                    : isSelected
                    ? 'bg-sky-950/50 border-[#1cb0f6] border-b-4 border-b-[#1899d6] text-[#1cb0f6] shadow-sm'
                    : 'bg-[#131f24] hover:bg-[#202f36] border-[#37464f] border-b-4 text-gray-200'
                }`}
              >
                {item}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column (English) */}
        <div className="space-y-3">
          {rightItems.map((item) => {
            const isMatched = Object.values(matchedPairs).includes(item);
            const isSelected = selectedRight === item;
            const isWrong = wrongPair?.right === item;

            return (
              <motion.button
                key={`right-${item}`}
                whileTap={!isMatched && !disabled ? { scale: 0.96 } : {}}
                animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => handleSelectRight(item)}
                disabled={isMatched || disabled}
                className={`w-full p-4 rounded-2xl font-black text-base transition-all duration-100 border-2 text-center flex items-center justify-center ${
                  isMatched
                    ? 'border-transparent bg-transparent text-gray-600 opacity-40 cursor-default'
                    : isWrong
                    ? 'bg-red-950 border-red-500 text-red-500 border-b-4'
                    : isSelected
                    ? 'bg-sky-950/50 border-[#1cb0f6] border-b-4 border-b-[#1899d6] text-[#1cb0f6] shadow-sm'
                    : 'bg-[#131f24] hover:bg-[#202f36] border-[#37464f] border-b-4 text-gray-200'
                }`}
              >
                {item}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
