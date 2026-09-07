'use client';

import { useState, useEffect } from 'react';
import { X, Volume2, BookOpen, Lightbulb } from 'lucide-react';
import { GuidebookData } from '@/types';
import { api } from '@/lib/api';
import { speakText } from '@/lib/tts';
import { sound } from '@/lib/sound';

interface GuidebookModalProps {
  unitId: number | null;
  onClose: () => void;
  languageCode?: string;
}

export function GuidebookModal({ unitId, onClose, languageCode = 'es' }: GuidebookModalProps) {
  const [guidebook, setGuidebook] = useState<GuidebookData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!unitId) return;
    const fetchGuidebook = async () => {
      try {
        setLoading(true);
        const data = await api.getGuidebook(unitId);
        setGuidebook(data);
      } catch (err) {
        console.error('Failed to load guidebook:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuidebook();
  }, [unitId]);

  if (!unitId) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#131f24] rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border-2 border-[#37464f] animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-white">
        {/* Header */}
        <div className="p-6 border-b-2 border-[#37464f] flex items-center justify-between bg-[#202f36]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-green-400">
                UNIT GUIDEBOOK
              </span>
              <h3 className="text-lg font-black text-white">
                {guidebook?.unit_title || 'Unit Notes & Grammar'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#37464f] transition"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="font-extrabold text-sm text-gray-400">Loading Guidebook...</p>
            </div>
          ) : guidebook ? (
            <>
              {/* Summary */}
              {guidebook.summary && (
                <p className="text-sm font-bold text-gray-200 bg-green-950/30 p-4 rounded-2xl border-2 border-green-900/50">
                  {guidebook.summary}
                </p>
              )}

              {/* Key Phrases Section */}
              {guidebook.key_phrases.length > 0 && (
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                    <span>KEY PHRASES</span>
                  </h4>
                  <div className="space-y-2.5">
                    {guidebook.key_phrases.map((phrase, idx) => (
                      <div
                        key={idx}
                        className="duo-card p-3.5 flex items-center justify-between hover:border-[#1cb0f6] transition group bg-[#131f24]"
                      >
                        <div>
                          <p className="font-black text-base text-white group-hover:text-[#1cb0f6] transition">
                            {phrase.phrase}
                          </p>
                          <p className="text-xs font-bold text-gray-400 mt-0.5">
                            {phrase.translation}
                          </p>
                          {phrase.context && (
                            <span className="text-[10px] font-extrabold text-gray-400 italic">
                              • {phrase.context}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            sound.playClick();
                            speakText(phrase.audio_text || phrase.phrase, languageCode);
                          }}
                          className="w-10 h-10 rounded-xl bg-sky-950/50 hover:bg-sky-900 text-[#1cb0f6] flex items-center justify-center transition shrink-0 border border-sky-800/40"
                          title="Listen Pronunciation"
                        >
                          <Volume2 className="w-5 h-5 stroke-[2.5]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grammar Tips Section */}
              {guidebook.grammar_tips.length > 0 && (
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>GRAMMAR TIPS</span>
                  </h4>
                  <div className="space-y-4">
                    {guidebook.grammar_tips.map((tip, idx) => (
                      <div key={idx} className="duo-card p-4 space-y-2 bg-[#131f24]">
                        <h5 className="font-black text-base text-white">{tip.title}</h5>
                        <p className="text-xs font-bold text-gray-300 leading-relaxed">
                          {tip.explanation}
                        </p>
                        {tip.examples && tip.examples.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-800 space-y-1.5">
                            {tip.examples.map((ex, exIdx) => (
                              <div key={exIdx} className="text-xs flex items-center justify-between">
                                <span className="font-black text-green-400">
                                  {ex.es || ex.fr || ex.de}
                                </span>
                                <span className="font-bold text-gray-400">{ex.en}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-400 font-bold py-10">Guidebook notes ready for this unit.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[#37464f] bg-[#202f36]">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="duo-button duo-button-green w-full py-3 text-sm"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
}
