'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sound } from '@/lib/sound';
import { ChevronDown, Sparkles, X } from 'lucide-react';

interface CourseOption {
  id: string;
  name: string;
  learners?: string;
  flag?: string;
  icon?: string;
  available: boolean;
}

export default function CoursesSelectionPage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const courses: CourseOption[] = [
    { id: 'es', name: 'Spanish', learners: '42.2M learners', flag: '🇪🇸', available: true },
    { id: 'fr', name: 'French', learners: '22.8M learners', flag: '🇫🇷', available: false },
    { id: 'chess', name: 'Chess', icon: '♟️', available: false },
    { id: 'en', name: 'English', learners: '20.5M learners', flag: '🇺🇸', available: false },
    { id: 'ja', name: 'Japanese', learners: '18.1M learners', flag: '🇯🇵', available: false },
    { id: 'de', name: 'German', learners: '16M learners', flag: '🇩🇪', available: false },
    { id: 'math', name: 'Math', icon: '➗', available: false },
    { id: 'hi', name: 'Hindi', learners: '13.7M learners', flag: '🇮🇳', available: false },
    { id: 'ko', name: 'Korean', learners: '12.3M learners', flag: '🇰🇷', available: false },
    { id: 'it', name: 'Italian', learners: '10.4M learners', flag: '🇮🇹', available: false },
    { id: 'zh', name: 'Chinese (Simplified)', learners: '9.26M learners', flag: '🇨🇳', available: false },
    { id: 'ru', name: 'Russian', learners: '7.84M learners', flag: '🇷🇺', available: false },
    { id: 'ar', name: 'Arabic', learners: '6.61M learners', flag: '🇸🇦', available: false },
    { id: 'pt', name: 'Portuguese', learners: '4.64M learners', flag: '🇧🇷', available: false },
    { id: 'tr', name: 'Turkish', learners: '3.99M learners', flag: '🇹🇷', available: false },
    { id: 'nl', name: 'Dutch', learners: '2.71M learners', flag: '🇳🇱', available: false },
    { id: 'el', name: 'Greek', learners: '1.81M learners', flag: '🇬🇷', available: false },
    { id: 'pl', name: 'Polish', learners: '1.52M learners', flag: '🇵🇱', available: false },
    { id: 'sv', name: 'Swedish', learners: '1.41M learners', flag: '🇸🇪', available: false },
    { id: 'vi', name: 'Vietnamese', learners: '1.33M learners', flag: '🇻🇳', available: false },
  ];

  const handleSelectCourse = (course: CourseOption) => {
    sound.playClick();
    if (course.available) {
      router.push('/login');
    } else {
      setToastMessage(`${course.name} is coming soon! Only Spanish is available right now.`);
      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#4b4b4b] flex flex-col font-sans select-none">
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-gray-100">
        <Link href="/" onClick={() => sound.playClick()}>
          <svg viewBox="0 0 130 36" className="h-9 w-auto cursor-pointer">
            <text
              x="0"
              y="28"
              fill="#58cc02"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="34"
              fontWeight="900"
              letterSpacing="-0.5px"
            >
              duolingo
            </text>
          </svg>
        </Link>

        {/* Site Language Dropdown */}
        <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600 transition">
          <span>SITE LANGUAGE: ENGLISH</span>
          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-black text-[#3c3c3c] text-center mb-10 tracking-tight">
          I want to learn...
        </h1>

        {/* Responsive Grid of Course Cards (Screenshot 2) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl">
          {courses.map((course) => {
            return (
              <button
                key={course.id}
                onClick={() => handleSelectCourse(course)}
                className={`flex flex-col items-center justify-center p-6 rounded-[24px] border-2 transition-all duration-150 cursor-pointer text-center relative group min-h-[160px] ${
                  course.available
                    ? 'border-[#58cc02] bg-green-50/20 hover:bg-green-50/50 hover:scale-[1.03] shadow-md'
                    : 'border-[#e5e5e5] bg-white hover:border-gray-300 hover:bg-gray-50/80 hover:scale-[1.02] shadow-xs'
                }`}
              >
                {/* Available Badge */}
                {course.available && (
                  <div className="absolute top-2.5 right-2.5 bg-[#58cc02] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 fill-current" />
                    READY
                  </div>
                )}

                {/* Flag or Icon */}
                <div className="w-16 h-14 flex items-center justify-center mb-3">
                  {course.flag ? (
                    <span className="text-4xl drop-shadow-sm transition-transform group-hover:scale-110">
                      {course.flag}
                    </span>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-[#1cb0f6] text-white flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:scale-110">
                      {course.icon}
                    </div>
                  )}
                </div>

                {/* Course Name */}
                <h3 className="font-black text-base text-[#3c3c3c] leading-snug">
                  {course.name}
                </h3>

                {/* Learners Subtitle */}
                {course.learners && (
                  <p className="text-xs font-bold text-gray-400 mt-0.5">
                    {course.learners}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Login Link */}
        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-gray-500">
            Already have an account?{' '}
            <Link
              href="/login"
              onClick={() => sound.playClick()}
              className="text-[#1cb0f6] hover:underline font-black uppercase tracking-wider"
            >
              LOG IN
            </Link>
          </p>
        </div>
      </main>

      {/* Floating Toast Notification for Coming Soon Courses */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#19262c] text-white px-6 py-3.5 rounded-2xl shadow-2xl border-2 border-[#2b3a42] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="text-amber-400 text-lg">💡</span>
          <span className="text-xs sm:text-sm font-black tracking-wide">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white p-1 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
