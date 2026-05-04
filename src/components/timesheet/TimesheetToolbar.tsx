'use client';

import { ChevronLeft, ChevronRight, Download, Printer } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import type { WeekTimingState } from '@/lib/timesheet';

interface TimesheetToolbarProps {
  weekStartLabel: string;
  weekEndLabel: string;
  timing: WeekTimingState;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const TIMING_BADGE: Record<WeekTimingState, { label: string; bg: string; color: string }> = {
  current:  { label: 'Current period', bg: '#D4FF3F', color: '#1A1612' },
  past:     { label: 'Past period',    bg: '#EFEBE2', color: '#8B8275' },
  future:   { label: 'Upcoming',       bg: '#EFEBE2', color: '#8B8275' },
};

export default function TimesheetToolbar({
  weekStartLabel,
  weekEndLabel,
  timing,
  onPrev,
  onNext,
  onToday,
}: TimesheetToolbarProps) {
  const badge = TIMING_BADGE[timing];

  return (
    <div
      className="flex items-center justify-between gap-4 px-5 py-3 rounded-2xl mb-3"
      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          Pay period
        </div>
        <div
          className="text-[15px] font-medium tabular-nums"
          style={{ color: C.ink, fontFamily: FONTS.sans }}
        >
          {weekStartLabel} <span style={{ color: C.muted, margin: '0 6px' }}>—</span> {weekEndLabel}
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-[0.1em]"
          style={{ backgroundColor: badge.bg, color: badge.color, fontFamily: FONTS.sans }}
        >
          {badge.label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="flex items-center rounded-full p-0.5"
          style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}` }}
        >
          <button
            onClick={onPrev}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/40"
            aria-label="Previous week"
          >
            <ChevronLeft size={14} style={{ color: C.ink }} />
          </button>
          <button
            onClick={onToday}
            className="px-3 h-8 rounded-full transition-colors hover:bg-white/40"
            style={{
              color: timing === 'current' ? C.muted : C.ink,
              fontFamily: FONTS.sans,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
            disabled={timing === 'current'}
          >
            Today
          </button>
          <button
            onClick={onNext}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/40"
            aria-label="Next week"
          >
            <ChevronRight size={14} style={{ color: C.ink }} />
          </button>
        </div>

        <button
          className="flex items-center gap-1.5 h-9 px-3 rounded-full transition-colors hover:opacity-90"
          style={{
            backgroundColor: C.bone,
            border: `1px solid ${C.borderSoft}`,
            color: C.inkSoft,
            fontFamily: FONTS.sans,
            fontSize: 12,
            fontWeight: 500,
          }}
          title="Export this pay period"
        >
          <Download size={13} strokeWidth={2.2} />
          Export
        </button>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:opacity-90"
          style={{
            backgroundColor: C.bone,
            border: `1px solid ${C.borderSoft}`,
            color: C.inkSoft,
          }}
          title="Print timecard"
          aria-label="Print"
        >
          <Printer size={13} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
