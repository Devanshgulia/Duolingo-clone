'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLessonEngine } from '@/hooks/useLessonEngine';
import { LessonHeader } from '@/components/lesson/LessonHeader';
import { FeedbackBar } from '@/components/lesson/FeedbackBar';
import { LessonCompleteModal } from '@/components/lesson/LessonCompleteModal';
import { OutOfHeartsModal } from '@/components/lesson/OutOfHeartsModal';
import { StreakIgniteModal } from '@/components/lesson/StreakIgniteModal';

// Exercise Components
import { MultipleChoice } from '@/components/exercises/MultipleChoice';
import { TranslateWordBank } from '@/components/exercises/TranslateWordBank';
import { MatchPairs } from '@/components/exercises/MatchPairs';
import { FillInBlank } from '@/components/exercises/FillInBlank';
import { TypeAnswer } from '@/components/exercises/TypeAnswer';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = Number(params?.id);

  const {
    lesson,
    currentExercise,
    progressPercent,
    accuracyPercent,
    selectedAnswer,
    setSelectedAnswer,
    feedbackStatus,
    correctAnswerText,
    hearts,
    isEvaluating,
    isComplete,
    completeResult,
    outOfHearts,
    showStreakModal,
    streakCount,
    closeStreakModal,
    loading,
    error,
    startLesson,
    submitCurrentAnswer,
    advanceExercise,
    refillHearts,
  } = useLessonEngine();

  useEffect(() => {
    if (lessonId) {
      startLesson(lessonId);
    }
  }, [lessonId, startLesson]);

  if (loading && !lesson) {
    return (
      <div className="min-h-screen bg-[#131f24] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-black text-gray-500 text-sm">Preparing Lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#131f24] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 max-w-sm w-full">
          <h3 className="text-xl font-black text-red-600 mb-2">Lesson Error</h3>
          <p className="text-sm font-bold text-[#afafaf] mb-6">{error}</p>
          <button
            onClick={() => router.push('/learn')}
            className="duo-button duo-button-green w-full py-3 text-sm"
          >
            RETURN TO PATH
          </button>
        </div>
      </div>
    );
  }

  const isFeedbackActive = feedbackStatus !== 'idle';
  const hasSelection = selectedAnswer !== null && selectedAnswer !== '' && (Array.isArray(selectedAnswer) ? selectedAnswer.length > 0 : true);

  return (
    <div className="min-h-screen bg-[#131f24] flex flex-col justify-between select-none">
      {/* Lesson Header Progress Bar */}
      <LessonHeader progressPercent={progressPercent} hearts={hearts} />

      {/* Exercise Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex items-center justify-center mb-28">
        {currentExercise && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-200">
            {currentExercise.type === 'multiple_choice' && (
              <MultipleChoice
                exercise={currentExercise}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={setSelectedAnswer}
                disabled={isFeedbackActive}
              />
            )}

            {currentExercise.type === 'translate' && (
              <TranslateWordBank
                exercise={currentExercise}
                onAnswerChange={setSelectedAnswer}
                disabled={isFeedbackActive}
              />
            )}

            {currentExercise.type === 'match_pairs' && (
              <MatchPairs
                exercise={currentExercise}
                onAnswerChange={setSelectedAnswer}
                onAutoComplete={submitCurrentAnswer}
                disabled={isFeedbackActive}
              />
            )}

            {currentExercise.type === 'fill_blank' && (
              <FillInBlank
                exercise={currentExercise}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={setSelectedAnswer}
                disabled={isFeedbackActive}
              />
            )}

            {currentExercise.type === 'type_answer' && (
              <TypeAnswer
                exercise={currentExercise}
                value={selectedAnswer || ''}
                onChange={setSelectedAnswer}
                onSubmit={submitCurrentAnswer}
                disabled={isFeedbackActive}
              />
            )}
          </div>
        )}
      </main>

      {/* Signature Feedback Bottom Sheet Bar */}
      <FeedbackBar
        status={feedbackStatus}
        correctAnswer={correctAnswerText}
        hasSelection={hasSelection}
        isEvaluating={isEvaluating}
        onCheck={submitCurrentAnswer}
        onContinue={advanceExercise}
      />

      {/* Streak Ignite First Question Modal */}
      {showStreakModal && (
        <StreakIgniteModal
          streakCount={streakCount}
          onContinue={closeStreakModal}
        />
      )}

      {/* Lesson Complete Celebration Modal */}
      {isComplete && completeResult && (
        <LessonCompleteModal
          result={completeResult}
          accuracyPercent={accuracyPercent}
          onFinish={() => router.push('/learn')}
        />
      )}

      {/* Out of Hearts Modal */}
      {outOfHearts && (
        <OutOfHeartsModal
          onRefill={refillHearts}
          onQuit={() => router.push('/learn')}
        />
      )}
    </div>
  );
}
