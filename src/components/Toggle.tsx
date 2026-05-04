'use client';

import { C } from '@/lib/design';

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
}

export default function Toggle({ checked, onChange, label, size = 'md' }: ToggleProps) {
  const dims = size === 'sm'
    ? { w: 32, h: 18, knob: 14, pad: 2 }
    : { w: 38, h: 22, knob: 18, pad: 2 };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 transition-colors"
      style={{
        width: dims.w,
        height: dims.h,
        borderRadius: dims.h,
        backgroundColor: checked ? C.ink : C.borderSoft,
      }}
    >
      <span
        className="absolute top-0 left-0 transition-transform"
        style={{
          width: dims.knob,
          height: dims.knob,
          margin: dims.pad,
          borderRadius: dims.knob,
          backgroundColor: checked ? C.lime : C.cream,
          transform: checked ? `translateX(${dims.w - dims.knob - dims.pad * 2}px)` : 'translateX(0)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}
