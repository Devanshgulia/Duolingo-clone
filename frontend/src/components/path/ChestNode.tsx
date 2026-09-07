'use client';

import { useState } from 'react';
import { ChestReward } from '@/types';
import { sound } from '@/lib/sound';
import { useToast } from '@/components/ui/Toast';
import { Lock } from 'lucide-react';

interface ChestNodeProps {
  chest: ChestReward;
  xOffset: number;
  onClaimChest: (chestId: number) => Promise<void>;
}

export function ChestNode({ chest, xOffset, onClaimChest }: ChestNodeProps) {
  const [opening, setOpening] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { showToast } = useToast();

  const isLocked = !chest.is_unlocked;

  const handleClick = async () => {
    if (isLocked) {
      sound.playWrong();
      showToast('This chest is locked! Complete preceding lessons to unlock it.', 'warning');
      return;
    }

    if (chest.is_claimed || opening) return;
    try {
      setOpening(true);
      sound.playChestReward();
      await onClaimChest(chest.id);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } catch (err: any) {
      console.error('Failed to claim chest:', err);
      showToast(err.message || 'Failed to claim chest', 'error');
    } finally {
      setOpening(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center my-3 group select-none transition-transform duration-200 ${
        isLocked
          ? 'cursor-not-allowed opacity-60'
          : chest.is_claimed
          ? 'cursor-default opacity-85'
          : 'cursor-pointer hover:scale-110 active:scale-95'
      }`}
      style={{ transform: `translateX(${xOffset}px)` }}
      onClick={handleClick}
      title={isLocked ? 'Locked chest' : chest.is_claimed ? 'Opened chest' : 'Click to claim reward!'}
    >
      {/* Chest Container */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {chest.is_claimed ? (
          // Opened Chest Image
          <img
            src="/images/chest-open.png"
            alt="Opened Treasure Chest"
            className="w-18 h-18 object-contain drop-shadow-xl animate-in zoom-in-95 duration-300"
          />
        ) : (
          // Closed Chest Image (Grayscale if locked, vibrant if unlocked)
          <img
            src="/images/chest-closed.png"
            alt="Treasure Chest"
            className={`w-18 h-18 object-contain drop-shadow-lg transition-transform duration-200 ${
              isLocked
                ? 'grayscale brightness-75 contrast-75'
                : opening
                ? 'animate-bounce'
                : 'group-hover:brightness-110'
            }`}
          />
        )}

        {/* Lock Overlay Badge for locked chests */}
        {isLocked && (
          <div className="absolute -bottom-0.5 bg-[#202f36] border-2 border-[#37464f] p-1.5 rounded-full shadow-xl flex items-center justify-center animate-in zoom-in duration-200">
            <Lock className="w-3.5 h-3.5 text-gray-400 stroke-[2.5]" />
          </div>
        )}
      </div>

      {/* Floating Reward Toast */}
      {showCelebration && (
        <div className="absolute -top-10 bg-[#ffc800] text-gray-900 font-black text-xs px-3 py-1.5 rounded-xl shadow-xl animate-in zoom-in-50 fade-in duration-200 flex items-center gap-1.5 z-30 border-2 border-white">
          <span>🎁 +{chest.reward_gems} Gems & +{chest.reward_xp} XP!</span>
        </div>
      )}
    </div>
  );
}
