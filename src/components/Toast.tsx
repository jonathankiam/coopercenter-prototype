'use client';

import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { C, FONTS } from '@/lib/design';

interface ToastProps {
  message: string;
  onDismiss: () => void;
  durationMs?: number;
}

export default function Toast({ message, onDismiss, durationMs = 2600 }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(id);
  }, [onDismiss, durationMs]);

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 pl-4 pr-5 py-3 rounded-full"
      style={{
        backgroundColor: C.ink,
        color: C.cream,
        fontFamily: FONTS.sans,
        fontSize: 13,
        fontWeight: 500,
        boxShadow: `0 12px 32px -10px ${C.ink}80`,
        animation: 'toast-in 0.25s ease-out',
      }}
    >
      <span
        className="flex items-center justify-center w-5 h-5 rounded-full"
        style={{ backgroundColor: C.lime, color: C.ink }}
      >
        <Check size={12} strokeWidth={3} />
      </span>
      {message}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
