'use client';

import { Check, Star, Headphones, Trophy } from 'lucide-react';
import { SkillNode as SkillNodeType } from '@/types';
import { sound } from '@/lib/sound';

interface SkillNodeProps {
  skill: SkillNodeType;
  xOffset: number;
  nodeIndex?: number;
  colorTheme?: string;
  isSelected?: boolean;
  hasAnySelected?: boolean;
  onSelectSkill: (skill: SkillNodeType) => void;
  onStartLesson?: (lessonId: number) => void;
}

export function SkillNode({
  skill,
  xOffset,
  nodeIndex = 0,
  colorTheme = 'green',
  isSelected = false,
  hasAnySelected = false,
  onSelectSkill,
  onStartLesson
}: SkillNodeProps) {
  const isCompleted = skill.status === 'completed';
  const isAvailable = skill.status === 'available';
  const isLocked = skill.status === 'locked';
  const isHeadphones = skill.icon === 'headphones' || skill.icon === 'audio';
  const isTrophy = skill.icon === 'trophy';

  // Calculate lesson completion percentage for SVG ring
  const progressPercent = Math.min(100, Math.round((skill.completed_lessons_count / Math.max(1, skill.total_lessons)) * 100));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLocked) {
      sound.playClick();
      onSelectSkill(skill);
    }
  };

  // Theme color styles
  const isGreenTheme = colorTheme === 'green';
  const ringColor = isGreenTheme ? '#58cc02' : '#ce82ff';
  const popoverBg = isGreenTheme ? 'bg-[#58cc02]' : 'bg-[#b865f8]';

  const getButtonStyles = () => {
    if (isLocked) {
      return 'bg-[#202f36] border-b-[6px] border-[#18252b] text-gray-500 cursor-not-allowed opacity-80';
    }

    if (isCompleted) {
      if (isGreenTheme) {
        return 'bg-[#58cc02] hover:bg-[#61df02] border-b-[6px] border-[#46a302] text-white shadow-lg active:translate-y-1';
      } else {
        return nodeIndex === 0
          ? 'bg-[#ffc800] hover:bg-[#ffd014] border-b-[6px] border-[#e6b400] text-white shadow-lg active:translate-y-1'
          : 'bg-[#b865f8] hover:bg-[#c47bfb] border-b-[6px] border-[#9333ea] text-white shadow-lg active:translate-y-1';
      }
    }

    if (isAvailable) {
      if (isGreenTheme) {
        return 'bg-[#58cc02] hover:bg-[#61df02] border-b-[6px] border-[#46a302] text-white shadow-xl active:translate-y-1';
      } else {
        return 'bg-[#b865f8] hover:bg-[#c47bfb] border-b-[6px] border-[#9333ea] text-white shadow-xl active:translate-y-1';
      }
    }

    return 'bg-[#202f36] border-b-[6px] border-[#18252b] text-gray-400';
  };

  const currentLessonNum = Math.min(skill.completed_lessons_count + 1, Math.max(1, skill.total_lessons));
  const activeLesson = skill.lessons.find(l => !l.is_completed) || skill.lessons[0];

  return (
    <div
      className={`relative flex flex-col items-center my-3 group select-none ${isSelected ? 'z-50' : 'z-10'}`}
      style={{ transform: `translateX(${xOffset}px)` }}
      onClick={handleClick}
    >
      {/* Active Skill Speech Bubble with "START" (only when available, not selected, and no other popover open) */}
      {isAvailable && !isSelected && !hasAnySelected && (
        <div className="absolute -top-12 z-20 flex flex-col items-center animate-bounce pointer-events-none">
          <div className="bg-[#202f36] border-2 border-[#37464f] text-white font-black text-xs tracking-wider px-3.5 py-1.5 rounded-2xl shadow-xl uppercase flex items-center gap-1.5">
            <span>START</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#202f36] border-r-2 border-b-2 border-[#37464f] rotate-45"></div>
          </div>
        </div>
      )}

      {/* Circular Skill Node Container */}
      <div className="relative w-22 h-22 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95">
        {/* SVG Progress Ring for Active Skill */}
        {isAvailable && (
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-10" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-[#202f36]"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke={ringColor}
              className="transition-all duration-500 ease-out"
              strokeWidth="7"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * Math.max(35, progressPercent)) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
        )}

        {/* 3D Stepping Stone Button */}
        <button
          disabled={isLocked}
          className={`w-18 h-18 rounded-full flex items-center justify-center font-bold transition-all duration-150 relative z-0 ${getButtonStyles()}`}
        >
          {isLocked ? (
            isTrophy ? (
              <Trophy className="w-7 h-7 stroke-[2] opacity-60" />
            ) : isHeadphones ? (
              <Headphones className="w-7 h-7 stroke-[2] opacity-60" />
            ) : (
              <Star className="w-7 h-7 stroke-[2] opacity-60" />
            )
          ) : isCompleted ? (
            isTrophy ? (
              <Trophy className="w-8 h-8 stroke-[3]" />
            ) : (
              <Check className="w-8 h-8 stroke-[4]" />
            )
          ) : isHeadphones ? (
            <Headphones className="w-7 h-7 stroke-[2.5]" />
          ) : isTrophy ? (
            <Trophy className="w-7 h-7 stroke-[2.5]" />
          ) : isAvailable ? (
            <Star className="w-8 h-8 fill-current stroke-[1.5]" />
          ) : (
            <Star className="w-7 h-7 stroke-[2.5]" />
          )}
        </button>
      </div>

      {/* Popover Bubble Matching Screenshots 4 & 5 */}
      {isSelected && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-full mt-3 z-50 w-72 sm:w-80 rounded-3xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] border border-white/10 animate-in fade-in zoom-in-95 duration-150 ${popoverBg}`}
        >
          {/* Triangular Pointer Arrow pointing up */}
          <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 ${popoverBg}`}></div>

          {isCompleted ? (
            /* Completed Skill Popover (Screenshot 5) */
            <div className="flex flex-col text-left">
              <h3 className="text-xl font-black text-white">{skill.title}</h3>
              <p className="text-xs font-bold text-white/90 mt-0.5 mb-4">
                Prove your proficiency with Legendary
              </p>

              <button
                onClick={() => {
                  sound.playClick();
                  if (onStartLesson) onStartLesson(skill.lessons[0]?.id || 1);
                }}
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-gray-100 border-b-[4px] border-gray-300 font-black text-xs text-[#58cc02] uppercase tracking-wider shadow-md active:translate-y-1 transition text-center mb-2.5"
              >
                PRACTICE +5 XP
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  if (onStartLesson) onStartLesson(skill.lessons[0]?.id || 1);
                }}
                className="duo-button duo-button-yellow w-full py-3.5 text-xs tracking-wider"
              >
                LEGENDARY +40 XP
              </button>
            </div>
          ) : (
            /* Available / In-Progress Skill Popover (Screenshot 4) */
            <div className="flex flex-col text-left">
              <h3 className="text-xl font-black text-white">{skill.title}</h3>
              <p className="text-xs font-bold text-white/90 mt-0.5 mb-4">
                Lesson {currentLessonNum} of {Math.max(1, skill.total_lessons)}
              </p>

              <button
                onClick={() => {
                  sound.playClick();
                  if (onStartLesson) onStartLesson(activeLesson ? activeLesson.id : skill.id);
                }}
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-gray-100 border-b-[4px] border-gray-300 font-black text-xs text-gray-900 uppercase tracking-wider shadow-md active:translate-y-1 transition text-center"
              >
                START +{activeLesson?.xp_reward || 10} XP
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
