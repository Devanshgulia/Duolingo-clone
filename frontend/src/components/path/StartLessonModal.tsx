'use client';

import { X, Play, Zap, CheckCircle2, RotateCcw } from 'lucide-react';
import { SkillNode as SkillNodeType } from '@/types';
import { sound } from '@/lib/sound';

interface StartLessonModalProps {
  skill: SkillNodeType | null;
  onClose: () => void;
  onStartLesson: (lessonId: number) => void;
}

export function StartLessonModal({ skill, onClose, onStartLesson }: StartLessonModalProps) {
  if (!skill) return null;

  const uncompletedLesson = skill.lessons.find((l) => !l.is_completed) || skill.lessons[0];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-[#131f24] rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-[#37464f] relative animate-in zoom-in-95 duration-150 select-none text-white">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-[#202f36] p-2 rounded-xl transition"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Header */}
        <div className="text-center mt-2 mb-6">
          <h3 className="text-2xl font-black text-white">{skill.title}</h3>
          <p className="text-xs font-black uppercase tracking-wider text-[#58cc02] mt-1">
            Lesson {Math.min(skill.completed_lessons_count + 1, Math.max(1, skill.total_lessons))} of {Math.max(1, skill.total_lessons)}
          </p>
        </div>

        {/* Lesson List */}
        <div className="space-y-2.5 mb-6">
          {skill.lessons.length > 0 ? (
            skill.lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border-2 font-bold text-sm transition ${
                  lesson.is_completed
                    ? 'bg-green-950/30 border-green-800/50 text-green-300'
                    : uncompletedLesson?.id === lesson.id
                    ? 'bg-sky-950/40 border-sky-500/50 text-[#1cb0f6]'
                    : 'bg-[#202f36] border-[#37464f] text-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  {lesson.is_completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#58cc02] fill-green-950" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center text-xs font-black">
                      {idx + 1}
                    </span>
                  )}
                  <span className="text-white">{lesson.title}</span>
                </div>

                <div className="flex items-center gap-1 text-xs font-black text-[#ffc800]">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>+{lesson.xp_reward} XP</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3.5 rounded-2xl border-2 border-[#37464f] bg-[#202f36] text-gray-300 text-sm font-bold flex items-center justify-between">
              <span>Lesson 1: Practice</span>
              <span className="text-[#ffc800] font-black text-xs">+10 XP</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {uncompletedLesson ? (
          <button
            onClick={() => {
              sound.playClick();
              onStartLesson(uncompletedLesson.id);
            }}
            className="duo-button duo-button-green w-full py-3.5 text-sm gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            START +{uncompletedLesson.xp_reward || 10} XP
          </button>
        ) : (
          <button
            onClick={() => {
              sound.playClick();
              onStartLesson(skill.lessons[0]?.id || 1);
            }}
            className="duo-button duo-button-yellow w-full py-3.5 text-sm gap-2"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            PRACTICE AGAIN
          </button>
        )}
      </div>
    </div>
  );
}
