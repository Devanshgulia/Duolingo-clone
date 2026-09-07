'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useAuth } from '@/context/AuthContext';
import { User, Bell, Volume2, Globe, LogOut, Target } from 'lucide-react';
import { sound } from '@/lib/sound';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const settingsSections = [
    {
      title: 'Daily Goal (Duolingo Coach)',
      icon: <Target className="w-6 h-6 text-[#58cc02]" />,
      description: `Current goal: ${user?.daily_goal_xp || 30} XP per day. Adjust your daily learning pace.`,
      action: () => router.push('/settings/coach'),
      btnText: 'Edit Goal',
      btnColor: 'duo-button-green',
    },
    {
      title: 'Profile',
      icon: <User className="w-6 h-6 text-blue-400" />,
      description: `Username: @${user?.username || 'learner'} · Display name: ${user?.display_name || 'Learner'}`,
      action: () => router.push('/profile'),
      btnText: 'View Profile',
      btnColor: 'duo-button-blue',
    },
    {
      title: 'Sound & Audio Effects',
      icon: <Volume2 className="w-6 h-6 text-green-400" />,
      description: 'Sound effects, pronunciation audio, and speaking feedback.',
      action: () => showToast('Audio effects are enabled.', 'success'),
      btnText: 'Enabled',
      btnColor: 'duo-button-dark',
    },
    {
      title: 'Notifications & Reminders',
      icon: <Bell className="w-6 h-6 text-[#ffc800]" />,
      description: 'Daily streak reminders and quest completion alerts.',
      action: () => showToast('Streak reminders configured.', 'success'),
      btnText: 'Manage',
      btnColor: 'duo-button-dark',
    },
    {
      title: 'Course Language',
      icon: <Globe className="w-6 h-6 text-[#ce82ff]" />,
      description: 'Active learning course: Spanish (Español).',
      action: () => router.push('/courses'),
      btnText: 'Change',
      btnColor: 'duo-button-dark',
    },
    {
      title: 'Account & Session',
      icon: <LogOut className="w-6 h-6 text-[#ff4b4b]" />,
      description: user ? `Signed in as @${user.username}` : 'Not signed in',
      action: () => {
        logout();
        showToast('Logged out successfully.', 'info');
        router.push('/');
      },
      btnText: user ? 'Log Out' : 'Log In',
      btnColor: 'duo-button-red',
    },
  ];

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex select-none">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen pb-20">
        <TopBar userSummary={user || undefined} />

        <div className="max-w-2xl mx-auto w-full px-4 pt-8">
          <h1 className="text-2xl font-black text-white mb-8 border-b-2 border-[#202f36] pb-4">
            Preferences & Settings
          </h1>

          <div className="space-y-4">
            {settingsSections.map((section) => (
              <div
                key={section.title}
                className="duo-card p-5 border-2 border-[#37464f] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="bg-[#202f36] p-3 rounded-2xl">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg">{section.title}</h2>
                    <p className="text-xs font-bold text-gray-400 mt-0.5">
                      {section.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    section.action();
                  }}
                  className={`duo-button ${section.btnColor || 'duo-button-dark'} px-5 py-2.5 shrink-0 uppercase text-xs`}
                >
                  {section.btnText || 'Configure'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
