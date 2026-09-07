'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft, Check, Target, Zap, Sparkles, Flame } from 'lucide-react';

interface GoalOption {
  xp: number;
  label: string;
  description: string;
  intensity: number; // 1-4
  color: string;
  tag: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    xp: 10,
    label: 'Casual',
    description: '5 mins a day · Great for busy learners',
    intensity: 1,
    color: '#58cc02',
    tag: '1 lesson / day',
  },
  {
    xp: 20,
    label: 'Regular',
    description: '10 mins a day · Steady everyday progress',
    intensity: 2,
    color: '#1cb0f6',
    tag: '2 lessons / day',
  },
  {
    xp: 30,
    label: 'Serious',
    description: '15 mins a day · The recommended pace',
    intensity: 3,
    color: '#ff9600',
    tag: '3 lessons / day',
  },
  {
    xp: 50,
    label: 'Intense',
    description: '20 mins a day · Maximum speed and fluency',
    intensity: 4,
    color: '#ff4b4b',
    tag: '5 lessons / day',
  },
];

export default function EditGoalPage() {
  const router = useRouter();
  const { user, updateGoal, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [selectedXp, setSelectedXp] = useState<number>(user?.daily_goal_xp || 30);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.daily_goal_xp) {
      setSelectedXp(user.daily_goal_xp);
    }
  }, [user?.daily_goal_xp]);

  const handleSave = async () => {
    sound.playClick();
    setSaving(true);
    try {
      await updateGoal(selectedXp);
      sound.playCorrect();
      showToast(`Daily goal updated to ${selectedXp} XP per day!`, 'success');
      setTimeout(() => {
        router.push('/learn');
      }, 500);
    } catch (err: any) {
      sound.playWrong();
      showToast(err.message || 'Failed to update goal', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex select-none font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen pb-24">
        <TopBar userSummary={user || undefined} />

        <div className="max-w-2xl mx-auto w-full px-4 pt-6 sm:pt-10">
          {/* Back Link */}
          <Link
            href="/learn"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-white uppercase tracking-wider mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            Back to Learn
          </Link>

          {/* Duolingo Coach Header Card */}
          <div className="duo-card p-6 sm:p-8 bg-[#18272e] border-2 border-[#2b3a42] rounded-3xl mb-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Coach Owl Mascot Graphic */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#58cc02] to-[#46a302] flex items-center justify-center p-3 shadow-lg shadow-[#58cc02]/20 border-4 border-[#131f24]">
                <img
                  src="https://d35aaqx5ub952y.cloudfront.net/images/owls/owl-happy.svg"
                  alt="Duolingo Coach"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to mascot SVG
                    e.currentTarget.src = "https://api.dicebear.com/7.x/bottts/svg?seed=DuoCoach&backgroundColor=58cc02";
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#ffc800] p-1.5 rounded-full border-2 border-[#131f24] text-black">
                <Target className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#58cc02] uppercase tracking-widest bg-[#58cc02]/10 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Coach Settings
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                Edit Daily Goal
              </h1>
              <p className="text-sm font-bold text-gray-400 leading-relaxed">
                Coach helps you stay motivated by tracking your daily XP target. You can adjust your goal anytime as your routine changes!
              </p>
            </div>
          </div>

          {/* Goal Options List */}
          <div className="space-y-3.5 mb-8">
            {GOAL_OPTIONS.map((option) => {
              const isSelected = selectedXp === option.xp;
              return (
                <div
                  key={option.xp}
                  onClick={() => {
                    sound.playClick();
                    setSelectedXp(option.xp);
                  }}
                  className={`duo-card cursor-pointer p-5 sm:p-6 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#1a2d36] border-[#58cc02] shadow-md shadow-[#58cc02]/15 -translate-y-0.5'
                      : 'bg-[#142229] border-[#24353f] hover:border-[#374c58] hover:bg-[#182830]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Custom Radio / Check Circle */}
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[#58cc02] bg-[#58cc02] text-black'
                          : 'border-[#374c58] bg-[#19262c]'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-white text-lg sm:text-xl tracking-tight">
                          {option.label}
                        </span>
                        <span
                          className="text-[11px] font-black uppercase px-2 py-0.5 rounded-md text-black"
                          style={{ backgroundColor: option.color }}
                        >
                          {option.tag}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-400 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  {/* XP Badge & Intensity Bars */}
                  <div className="flex flex-col items-end shrink-0">
                    <div className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#ffc800] fill-[#ffc800]" />
                      <span>{option.xp} XP</span>
                      <span className="text-xs font-bold text-gray-400">/ day</span>
                    </div>

                    {/* Visual 4-bar indicator */}
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`w-3 h-1.5 rounded-full transition-colors ${
                            bar <= option.intensity
                              ? isSelected
                                ? 'bg-[#58cc02]'
                                : 'bg-gray-400'
                              : 'bg-[#24353f]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t-2 border-[#202f36]">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                router.back();
              }}
              className="duo-button duo-button-dark px-6 py-3.5 uppercase font-black text-xs tracking-wider"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="duo-button duo-button-green px-8 py-4 uppercase font-black text-sm tracking-wider flex items-center gap-2 shadow-lg"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>SAVE CHANGES</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
