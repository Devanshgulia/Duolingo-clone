'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { X, Check, AlertTriangle, Info, Zap, Heart, Gem, Flame } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'xp' | 'heart' | 'gem' | 'streak';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <Check className="w-5 h-5 stroke-[3]" />,
  error: <X className="w-5 h-5 stroke-[3]" />,
  info: <Info className="w-5 h-5 stroke-[2.5]" />,
  warning: <AlertTriangle className="w-5 h-5 stroke-[2.5]" />,
  xp: <Zap className="w-5 h-5 fill-current" />,
  heart: <Heart className="w-5 h-5 fill-current" />,
  gem: <Gem className="w-5 h-5 fill-current" />,
  streak: <Flame className="w-5 h-5 fill-current" />,
};

const TOAST_STYLES: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: { bg: 'bg-[#58cc02]/15', border: 'border-[#58cc02]/40', icon: 'text-[#58cc02]', text: 'text-[#58cc02]' },
  error: { bg: 'bg-[#ff4b4b]/15', border: 'border-[#ff4b4b]/40', icon: 'text-[#ff4b4b]', text: 'text-[#ff4b4b]' },
  info: { bg: 'bg-[#1cb0f6]/15', border: 'border-[#1cb0f6]/40', icon: 'text-[#1cb0f6]', text: 'text-[#1cb0f6]' },
  warning: { bg: 'bg-[#ffc800]/15', border: 'border-[#ffc800]/40', icon: 'text-[#ffc800]', text: 'text-[#ffc800]' },
  xp: { bg: 'bg-[#ffc800]/15', border: 'border-[#ffc800]/40', icon: 'text-[#ffc800]', text: 'text-[#ffc800]' },
  heart: { bg: 'bg-[#ff4b4b]/15', border: 'border-[#ff4b4b]/40', icon: 'text-[#ff4b4b]', text: 'text-[#ff4b4b]' },
  gem: { bg: 'bg-[#1cb0f6]/15', border: 'border-[#1cb0f6]/40', icon: 'text-[#1cb0f6]', text: 'text-[#1cb0f6]' },
  streak: { bg: 'bg-[#ff9600]/15', border: 'border-[#ff9600]/40', icon: 'text-[#ff9600]', text: 'text-[#ff9600]' },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const style = TOAST_STYLES[toast.type];
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, toast.duration - 300);

    const removeTimer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 shadow-2xl backdrop-blur-sm max-w-sm w-full select-none transition-all duration-300 ${style.bg} ${style.border} ${
        isExiting ? 'animate-toast-out' : 'animate-toast-in'
      }`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${style.icon} bg-white/5`}>
        {TOAST_ICONS[toast.type]}
      </div>
      <span className="text-sm font-black text-white flex-1">{toast.message}</span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="text-gray-500 hover:text-gray-300 transition p-0.5 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    counterRef.current += 1;
    const id = `toast-${counterRef.current}-${Date.now()}`;
    setToasts((prev) => [...prev.slice(-4), { id, message, type, duration }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={dismissToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
