'use client';

import { useEffect } from 'react';
import { toast as sonnerToast } from 'sonner';

interface ToastProps {
  message: string;
  onDismiss: () => void;
  durationMs?: number;
}

/**
 * Compatibility wrapper around shadcn's Sonner toaster.
 * The legacy view code renders `{message && <Toast .../>}` to surface a toast;
 * we keep that signature so the views don't have to change. On mount we
 * enqueue the message with sonner and immediately fire onDismiss to clear
 * the parent's local state — sonner owns the visible lifecycle from there.
 */
export default function Toast({ message, onDismiss, durationMs = 2600 }: ToastProps) {
  useEffect(() => {
    sonnerToast(message, { duration: durationMs });
    onDismiss();
  }, [message, durationMs, onDismiss]);

  return null;
}
