'use client';

import { ArrowLeft } from 'lucide-react';
import { sound } from '@/lib/sound';

interface UnitHeaderProps {
  unitId: number;
  unitNumber?: number;
  title: string;
  description?: string;
  colorTheme?: string;
  onOpenGuidebook: (unitId: number) => void;
}

export function UnitHeader({
  unitId,
  unitNumber = 1,
  title = "Order at a café",
  description,
  colorTheme = "green",
  onOpenGuidebook
}: UnitHeaderProps) {
  const isGreen = colorTheme === 'green';

  return (
    <div className="sticky top-16 z-20 w-full max-w-xl mx-auto pt-1 pb-3 bg-[#131f24]/95 backdrop-blur-sm select-none transition-all">
      <div
        className={`w-full rounded-3xl p-5 text-white shadow-xl border-b-[5px] transition-all duration-200 ${
          isGreen
            ? 'bg-[#58cc02] border-[#46a302]'
            : 'bg-[#b865f8] border-[#9333ea]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            {/* Subtitle with arrow */}
            <div
              className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${
                isGreen ? 'text-green-100/90' : 'text-purple-100/90'
              }`}
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>SECTION 1, UNIT {unitNumber}</span>
            </div>
            {/* Large Title */}
            <h2 className="text-xl sm:text-2xl font-black mt-1 leading-tight text-white">
              {title.includes(':') ? title.split(':')[1].trim() : title}
            </h2>
          </div>

          {/* 3D Guidebook Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenGuidebook(unitId);
            }}
            className={`border-b-4 active:translate-y-1 active:border-b-0 px-4 py-2.5 rounded-2xl transition flex items-center gap-2 text-xs font-black tracking-wider uppercase shrink-0 shadow-sm text-white ${
              isGreen
                ? 'bg-[#46a302] hover:bg-[#3a8702] border-[#327202]'
                : 'bg-[#a855f7] hover:bg-[#9333ea] border-[#7e22ce]'
            }`}
          >
            {/* Notebook / List icon */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <line x1="8" y1="7" x2="16" y2="7" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="8" y1="17" x2="13" y2="17" />
            </svg>
            <span>GUIDEBOOK</span>
          </button>
        </div>
      </div>
    </div>
  );
}
