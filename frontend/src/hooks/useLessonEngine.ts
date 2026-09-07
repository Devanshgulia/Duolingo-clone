'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { LessonDetail, Exercise, AnswerResult, CompleteLessonResult } from '@/types';
import { sound } from '@/lib/sound';

export function useLessonEngine() {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [correctAnswerText, setCorrectAnswerText] = useState<string>('');
  const [hearts, setHearts] = useState<number>(5);
  const [isPractice, setIsPractice] = useState<boolean>(false);
  
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [completeResult, setCompleteResult] = useState<CompleteLessonResult | null>(null);
  const [outOfHearts, setOutOfHearts] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Streak celebration states
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(1);

  // Track correct answers for accuracy % calculation
  const [correctCount, setCorrectCount] = useState<number>(0);

  const startLesson = useCallback(async (lessonId: number) => {
    setLoading(true);
    setError(null);
    setIsPractice(false);
    try {
      const res = await api.startLesson(lessonId);
      setLesson(res.lesson);
      setAttemptId(res.attempt_id);
      setHearts(res.hearts_remaining);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setFeedbackStatus('idle');
      setIsComplete(false);
      setCompleteResult(null);
      setOutOfHearts(false);
      setCorrectCount(0);
      setShowStreakModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to start lesson');
    } finally {
      setLoading(false);
    }
  }, []);

  const startPractice = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsPractice(true);
    try {
      const res = await api.startPractice();
      setLesson(res.lesson);
      setAttemptId(res.attempt_id);
      setHearts(res.hearts_remaining);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setFeedbackStatus('idle');
      setIsComplete(false);
      setCompleteResult(null);
      setOutOfHearts(false);
      setCorrectCount(0);
      setShowStreakModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to start practice');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitCurrentAnswer = useCallback(async (overrideAnswer?: any) => {
    const answerToSubmit = overrideAnswer !== undefined ? overrideAnswer : selectedAnswer;
    if (!lesson || !attemptId || answerToSubmit === null || isEvaluating) return;

    const currentExercise = lesson.exercises[currentIndex];
    if (!currentExercise) return;

    setIsEvaluating(true);
    try {
      const res: AnswerResult = await api.submitAnswer(
        lesson.id,
        attemptId,
        currentExercise.id,
        answerToSubmit
      );

      setHearts(res.hearts_remaining);
      setCorrectAnswerText(res.correct_answer);

      if (res.is_correct) {
        sound.playCorrect();
        setFeedbackStatus('correct');
        setCorrectCount(prev => prev + 1);
      } else {
        sound.playIncorrect();
        setFeedbackStatus('incorrect');
        if (res.out_of_hearts) {
          setOutOfHearts(true);
        }
      }
    } catch (err: any) {
      console.error('Answer evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  }, [lesson, attemptId, currentIndex, selectedAnswer, isEvaluating]);

  const advanceExercise = useCallback(async () => {
    if (!lesson || !attemptId) return;

    if (currentIndex < lesson.exercises.length - 1) {
      sound.playClick();
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setFeedbackStatus('idle');
      setCorrectAnswerText('');
    } else {
      // Completed the whole quiz!
      setLoading(true);
      try {
        let res: CompleteLessonResult;
        if (isPractice) {
          res = await api.completePractice(attemptId);
        } else {
          res = await api.completeLesson(lesson.id, attemptId);
        }
        setCompleteResult(res);

        // ONLY show streak ignite celebration modal if not yet done on this day (streak_incremented is true)
        if (res.streak_incremented) {
          setStreakCount(res.streak_count || 1);
          setShowStreakModal(true);
        } else {
          sound.playVictory();
          setIsComplete(true);
        }
      } catch (err: any) {
        console.error('Lesson completion failed:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [lesson, attemptId, currentIndex, isPractice]);

  const closeStreakModal = useCallback(() => {
    setShowStreakModal(false);
    sound.playClick();
    sound.playVictory();
    setIsComplete(true);
  }, []);

  const refillHearts = useCallback(async () => {
    try {
      const res = await api.refillHearts();
      if (res.success) {
        setHearts(res.hearts);
        setOutOfHearts(false);
      }
    } catch (err: any) {
      console.error('Refill hearts failed:', err);
    }
  }, []);

  const currentExercise: Exercise | null = lesson ? lesson.exercises[currentIndex] || null : null;
  const progressPercent = lesson && lesson.exercises.length > 0
    ? Math.round(((currentIndex + (feedbackStatus !== 'idle' ? 1 : 0)) / lesson.exercises.length) * 100)
    : 0;

  const accuracyPercent = lesson && lesson.exercises.length > 0
    ? Math.round((correctCount / lesson.exercises.length) * 100)
    : 100;

  return {
    lesson,
    currentExercise,
    currentIndex,
    totalExercises: lesson?.exercises.length || 0,
    progressPercent,
    accuracyPercent,
    selectedAnswer,
    setSelectedAnswer,
    feedbackStatus,
    correctAnswerText,
    hearts,
    isPractice,
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
    startPractice,
    submitCurrentAnswer,
    advanceExercise,
    refillHearts,
  };
}
