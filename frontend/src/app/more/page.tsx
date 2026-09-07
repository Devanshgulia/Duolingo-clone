'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Settings, BookOpen, Headphones, Shield, Sparkles } from 'lucide-react';

export default function MorePage() {
  const moreSections = [
    {
      title: 'Dictionary',
      icon: <BookOpen className="w-6 h-6 text-green-500" />,
      description: 'Look up words and their meanings.',
    },
    {
      title: 'Podcasts',
      icon: <Headphones className="w-6 h-6 text-blue-500" />,
      description: 'Listen to fascinating stories in easy-to-understand languages.',
    },
    {
      title: 'Privacy',
      icon: <Shield className="w-6 h-6 text-red-500" />,
      description: 'Manage your data and privacy settings.',
    }
  ];

  return (
    <div className="min-h-screen bg-[#131f24] flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen pb-20">
        <div className="max-w-2xl mx-auto w-full px-4 pt-12">
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-500 mx-auto mb-4 border-4 border-pink-500/30 shadow-sm">
              <Sparkles className="w-10 h-10 fill-current" />
            </div>
            <h1 className="text-3xl font-black text-white">More</h1>
            <p className="text-sm font-bold text-gray-500 mt-1">Discover extra learning tools</p>
          </div>

          <div className="space-y-6">
            {moreSections.map((section) => (
              <div
                key={section.title}
                className="duo-card p-5 border-2 border-[#37464f] flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-not-allowed opacity-80"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="bg-[#202f36] p-3 rounded-2xl">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg">{section.title}</h2>
                    <p className="text-sm font-semibold text-[#afafaf] mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
                <button
                  disabled
                  className="duo-button duo-button-gray bg-[#37464f] border-b-4 border-[#202f36] text-[#afafaf] px-6 py-2.5 shrink-0 uppercase text-sm"
                >
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
