'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { UnitHeader } from '@/components/path/UnitHeader';
import { SkillNode } from '@/components/path/SkillNode';
import { ChestNode } from '@/components/path/ChestNode';
import { StartLessonModal } from '@/components/path/StartLessonModal';
import { GuidebookModal } from '@/components/path/GuidebookModal';
import { DuoHappy, LilyCharacter } from '@/components/ui/Mascots';
import { api } from '@/lib/api';
import { PathData, SkillNode as SkillNodeType, Quest } from '@/types';
import { Sparkles, ChevronDown, FastForward } from 'lucide-react';
import { sound } from '@/lib/sound';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';

export default function LearningPathPage() {
  const router = useRouter();
  const { setUser, user: authUser } = useAuth();
  const [pathData, setPathData] = useState<PathData | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillNodeType | null>(null);
  const [activeGuidebookUnitId, setActiveGuidebookUnitId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [pData, qData] = await Promise.all([
        api.getPath(),
        api.getQuests().catch(() => [])
      ]);
      setPathData(pData);
      setQuests(qData);
      if (pData?.user_summary) {
        setUser(pData.user_summary);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartLesson = (lessonId: number) => {
    router.push(`/lesson/${lessonId}`);
  };

  const handleRefillHearts = async () => {
    try {
      sound.playClick();
      await api.refillHearts();
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to refill hearts', 'error');
    }
  };

  const handleClaimQuest = async (questId: number) => {
    try {
      const res = await api.claimQuest(questId);
      if (res.success && pathData) {
        setPathData({ ...pathData, user_summary: res.user_summary });
        const updated = await api.getQuests();
        setQuests(updated);
      }
    } catch (err) {
      console.error('Failed to claim quest:', err);
    }
  };

  const handleClaimChest = async (chestId: number) => {
    try {
      const res = await api.claimChest(chestId);
      if (res.success && pathData) {
        setPathData({ ...pathData, user_summary: res.user_summary });
        const updatedUnits = pathData.units.map(u => ({
          ...u,
          chests: u.chests.map(c => c.id === chestId ? { ...c, is_claimed: true } : c)
        }));
        setPathData({ ...pathData, units: updatedUnits, user_summary: res.user_summary });
      }
    } catch (err) {
      console.error('Failed to claim chest:', err);
    }
  };

  const handleCourseSwitch = async (courseId: number) => {
    try {
      setLoading(true);
      await api.switchCourse(courseId);
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to switch course', 'error');
      setLoading(false);
    }
  };

  // Sinusoidal curve offsets for Duolingo path alignment
  const getCurveOffset = (index: number) => {
    const offsets = [0, 35, 55, 30, 0, -30, -55, -30];
    return offsets[index % offsets.length];
  };

  const unit1 = pathData?.units[0];
  const unit2 = pathData?.units[1];

  return (
    <div
      className="min-h-screen bg-[#131f24] text-white flex select-none"
      onClick={() => setSelectedSkill(null)}
    >
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <TopBar
          userSummary={pathData?.user_summary}
          onRefillHearts={handleRefillHearts}
          availableCourses={pathData?.available_courses}
          currentCourseId={pathData?.course_id}
          onCourseSwitch={handleCourseSwitch}
        />

        <div className="flex-1 flex justify-center max-w-6xl mx-auto w-full">
          {/* Middle Column: The Learning Path */}
          <main className="flex-1 max-w-xl px-4 py-6 flex flex-col items-center pb-32 relative">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-[#58cc02] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-black text-gray-400 text-sm">Loading Learning Path...</p>
              </div>
            ) : error ? (
              <div className="bg-[#202f36] border-2 border-red-500/50 rounded-3xl p-8 text-center my-12 max-w-md">
                <p className="text-[#ff4b4b] font-extrabold mb-4">{error}</p>
                <button
                  onClick={loadData}
                  className="duo-button duo-button-green px-6 py-3 text-sm"
                >
                  Retry Connection
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                {/* ======================================================== */}
                {/* UNIT 1: Order at a café (Green Theme - Screenshot 4) */}
                {/* ======================================================== */}
                {unit1 && (
                  <section className="w-full flex flex-col items-center mb-10 relative">
                    <UnitHeader
                      unitId={unit1.id}
                      unitNumber={1}
                      title={unit1.title}
                      description={unit1.description}
                      colorTheme="green"
                      onOpenGuidebook={(uId) => setActiveGuidebookUnitId(uId)}
                    />

                    {/* Unit 1 Curved Stepping Stones with Duo on Right */}
                    <div className="relative w-full flex flex-col items-center space-y-4 pt-10 pb-4">
                      {/* Green Happy Duo Mascot standing on the right beside node 2 & 3 */}
                      <div className="absolute right-4 sm:right-16 top-24 z-0 hidden sm:block pointer-events-none">
                        <DuoHappy className="w-28 h-28 drop-shadow-xl opacity-95" />
                      </div>

                      {unit1.skills.map((skill, sIdx) => {
                        const matchingChest = unit1.chests[sIdx];
                        const isSkillSelected = selectedSkill?.id === skill.id;
                        return (
                          <div key={skill.id} className={`flex flex-col items-center relative ${isSkillSelected ? 'z-50' : 'z-10'}`}>
                            <SkillNode
                              skill={skill}
                              xOffset={getCurveOffset(sIdx * 2)}
                              nodeIndex={sIdx}
                              colorTheme="green"
                              isSelected={isSkillSelected}
                              hasAnySelected={!!selectedSkill}
                              onSelectSkill={(s) => setSelectedSkill(selectedSkill?.id === s.id ? null : s)}
                              onStartLesson={handleStartLesson}
                            />

                            {/* Pathway Chest between skills */}
                            {matchingChest && (
                              <ChestNode
                                chest={matchingChest}
                                xOffset={getCurveOffset(sIdx * 2 + 1)}
                                onClaimChest={handleClaimChest}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Section 1 Divider */}
                <div className="w-full flex items-center justify-center my-8">
                  <div className="h-[2px] bg-[#202f36] flex-1 max-w-[80px]"></div>
                  <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Greet people and say goodbye
                  </span>
                  <div className="h-[2px] bg-[#202f36] flex-1 max-w-[80px]"></div>
                </div>

                {/* ======================================================== */}
                {/* UNIT 2: Greet people and say goodbye (Purple - Screenshot 5) */}
                {/* ======================================================== */}
                {unit2 && (
                  <section className="w-full flex flex-col items-center mb-10 relative">
                    <UnitHeader
                      unitId={unit2.id}
                      unitNumber={2}
                      title={unit2.title}
                      description={unit2.description}
                      colorTheme="purple"
                      onOpenGuidebook={(uId) => setActiveGuidebookUnitId(uId)}
                    />

                    {/* Unit 2 Stepping Stones with Lily on Left */}
                    <div className="relative w-full flex flex-col items-center space-y-4 pt-10 pb-4">
                      {/* Lily Mascot standing on left */}
                      <div className="absolute left-4 sm:left-14 top-24 z-0 hidden sm:block pointer-events-none">
                        <LilyCharacter className="w-32 h-44 drop-shadow-2xl opacity-95" />
                      </div>

                      {unit2.skills.map((skill, sIdx) => {
                        const matchingChest = unit2.chests[sIdx];
                        const isSkillSelected = selectedSkill?.id === skill.id;
                        return (
                          <div key={skill.id} className={`flex flex-col items-center relative ${isSkillSelected ? 'z-50' : 'z-10'}`}>
                            <SkillNode
                              skill={skill}
                              xOffset={getCurveOffset(sIdx * 2)}
                              nodeIndex={sIdx}
                              colorTheme="purple"
                              isSelected={isSkillSelected}
                              hasAnySelected={!!selectedSkill}
                              onSelectSkill={(s) => setSelectedSkill(selectedSkill?.id === s.id ? null : s)}
                              onStartLesson={handleStartLesson}
                            />

                            {matchingChest && (
                              <ChestNode
                                chest={matchingChest}
                                xOffset={getCurveOffset(sIdx * 2 + 1)}
                                onClaimChest={handleClaimChest}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Section 2 Divider */}
                <div className="w-full flex items-center justify-center my-8">
                  <div className="h-[2px] bg-[#202f36] flex-1 max-w-[80px]"></div>
                  <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Say where you are from
                  </span>
                  <div className="h-[2px] bg-[#202f36] flex-1 max-w-[80px]"></div>
                </div>

                {/* ======================================================== */}
                {/* UNIT 3: Upcoming Timeline / Soon to Unlock (Screenshot 5) */}
                {/* ======================================================== */}
                <div className="w-full flex flex-col items-center my-6 opacity-75">
                  {/* "JUMP HERE?" Fast-Forward Button Tooltip */}
                  <div className="relative flex flex-col items-center mb-4">
                    <div className="bg-[#202f36] border-2 border-[#37464f] text-white font-black text-xs tracking-wider px-3 py-1 rounded-2xl shadow-xl uppercase flex items-center gap-1.5 mb-2 animate-bounce">
                      <span>JUMP HERE?</span>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#202f36] border-r-2 border-b-2 border-[#37464f] rotate-45"></div>
                    </div>

                    {/* Green Fast-Forward Jump Button */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        showToast('Complete previous units or pass placement test to jump ahead!', 'info');
                      }}
                      className="w-16 h-14 bg-[#58cc02] hover:bg-[#61df02] border-b-[5px] border-[#46a302] rounded-2xl flex items-center justify-center text-white shadow-lg active:translate-y-1 transition hover:scale-105"
                      title="Jump to this unit"
                    >
                      <FastForward className="w-7 h-7 fill-current stroke-[1.5]" />
                    </button>
                  </div>

                  {/* Grayscale Locked Stepping Stones Path */}
                  <div className="relative w-full flex flex-col items-center space-y-4 my-2">
                    {/* Grayscale Silhouette Character on Right */}
                    <div className="absolute right-8 top-16 opacity-30 pointer-events-none hidden sm:block">
                      <svg viewBox="0 0 100 100" className="w-24 h-24 fill-[#37464f]">
                        <circle cx="50" cy="50" r="30" />
                        <rect x="25" y="70" width="50" height="20" rx="10" />
                      </svg>
                    </div>

                    {/* Grayscale Stepping Stones */}
                    <div className="w-16 h-16 rounded-full bg-[#202f36] border-b-[5px] border-[#18252b] flex items-center justify-center text-gray-600 shadow-md">
                      <Sparkles className="w-6 h-6 opacity-40" />
                    </div>

                    <div className="w-16 h-16 rounded-full bg-[#202f36] border-b-[5px] border-[#18252b] flex items-center justify-center text-gray-600 shadow-md translate-x-6">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2 opacity-40">
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                      </svg>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-[#202f36] border-b-[4px] border-[#18252b] flex items-center justify-center text-gray-600 shadow-md translate-x-8 opacity-40">
                      <div className="w-6 h-6 border-2 border-gray-600 rounded-md"></div>
                    </div>

                    <div className="w-16 h-16 rounded-full bg-[#202f36] border-b-[5px] border-[#18252b] flex items-center justify-center text-gray-600 shadow-md translate-x-4">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2 opacity-40">
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Floating Bottom-Right Jump Down Arrow Button (Screenshot 4) */}
                <button
                  onClick={() => {
                    sound.playClick();
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }}
                  className="fixed bottom-6 right-6 lg:right-96 z-30 w-12 h-12 rounded-2xl bg-[#1cb0f6] hover:bg-[#26bcfd] border-b-4 border-[#1899d6] flex items-center justify-center text-white shadow-xl hover:scale-105 active:translate-y-1 transition"
                  title="Scroll to active lesson"
                >
                  <ChevronDown className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
            )}
          </main>

          {/* Right Column: Widgets Panel */}
          <RightSidebar
            userSummary={pathData?.user_summary}
            quests={quests}
            onClaimQuest={handleClaimQuest}
          />
        </div>
      </div>

      {/* Guidebook Modal Popup */}
      <GuidebookModal
        unitId={activeGuidebookUnitId}
        onClose={() => setActiveGuidebookUnitId(null)}
        languageCode={pathData?.language_code}
      />
    </div>
  );
}
