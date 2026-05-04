'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, ArrowRight, Square, Briefcase } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { fmtClock, fmtMoney } from '@/lib/utils';
import type { Job } from '@/lib/types';

interface ActiveAssignmentCardProps {
  jobs: Job[];
  initialJobId?: number;
}

export default function ActiveAssignmentCard({ jobs, initialJobId }: ActiveAssignmentCardProps) {
  const [selectedId, setSelectedId] = useState<number>(initialJobId ?? jobs[0]?.id);
  const [clockedIn, setClockedIn] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const startRef = useRef<number | null>(null);

  const selected = jobs.find((j) => j.id === selectedId) ?? jobs[0];

  useEffect(() => {
    if (!clockedIn) return;
    const id = setInterval(() => {
      if (startRef.current != null) {
        setSeconds(Math.floor((Date.now() - startRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [clockedIn]);

  const handleToggle = () => {
    if (clockedIn) {
      setClockedIn(false);
      setSeconds(0);
      startRef.current = null;
    } else {
      startRef.current = Date.now();
      setSeconds(0);
      setClockedIn(true);
    }
  };

  const liveEarnings = (seconds / 3600) * (selected?.rate ?? 0);

  return (
    <section
      className="rounded-3xl p-7 h-full flex flex-col"
      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
    >
      <header className="flex items-baseline justify-between mb-5">
        <h2
          className="text-[20px] leading-tight"
          style={{ color: C.ink, fontFamily: FONTS.serif, fontStyle: 'italic' }}
        >
          Active assignment
        </h2>
        <span
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          {jobs.length} jobs
        </span>
      </header>

      {/* Job selector */}
      <div
        className="flex flex-wrap gap-2 mb-6 p-1.5 rounded-2xl"
        style={{ backgroundColor: C.paper, border: `1px solid ${C.borderSoft}` }}
      >
        {jobs.map((j) => {
          const active = j.id === selectedId;
          return (
            <button
              key={j.id}
              onClick={() => !clockedIn && setSelectedId(j.id)}
              disabled={clockedIn && !active}
              className="flex-1 min-w-[140px] flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
              style={{
                backgroundColor: active ? C.ink : 'transparent',
                color: active ? C.cream : C.inkSoft,
                opacity: clockedIn && !active ? 0.4 : 1,
                cursor: clockedIn && !active ? 'not-allowed' : 'pointer',
                fontFamily: FONTS.sans,
              }}
              title={clockedIn && !active ? 'Clock out before switching' : undefined}
            >
              <span
                className="block w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: j.color }}
              />
              <div className="text-left min-w-0">
                <div className="text-[12px] font-medium truncate leading-tight">{j.name}</div>
                <div className="text-[9px] opacity-60 tracking-wider mt-0.5 truncate">{j.code}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected job detail */}
      <div className="flex-1 flex flex-col items-center text-center px-2">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="block w-2 h-2 rounded-full"
            style={{ backgroundColor: clockedIn ? C.moss : C.mutedSoft }}
          />
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: clockedIn ? C.moss : C.muted, fontFamily: FONTS.sans }}
          >
            {clockedIn ? 'On the clock' : 'Ready to start'}
          </span>
        </div>

        <div
          className="text-[28px] tracking-tight leading-tight mb-1"
          style={{ color: C.ink, fontFamily: FONTS.serif }}
        >
          {selected?.name ?? '—'}
        </div>

        <div
          className="flex items-center gap-3 text-[11px] mb-8"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          <span className="flex items-center gap-1">
            <Briefcase size={11} strokeWidth={2} />
            {selected?.code} · {selected?.type}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MapPin size={11} strokeWidth={2} />
            {selected?.location}
          </span>
          <span>·</span>
          <span>{fmtMoney(selected?.rate ?? 0)}/hr</span>
        </div>

        <div
          className="text-[88px] leading-none tracking-tight tabular-nums mb-1"
          style={{
            color: clockedIn ? C.ink : C.mutedSoft,
            fontFamily: FONTS.mono,
            fontWeight: 300,
            letterSpacing: '-0.02em',
          }}
        >
          {fmtClock(seconds)}
        </div>

        <div
          className="text-[12px] mb-8 tabular-nums"
          style={{ color: clockedIn ? C.moss : C.mutedSoft, fontFamily: FONTS.sans }}
        >
          {clockedIn
            ? `Earning ${fmtMoney(liveEarnings)} so far`
            : 'Tap below to start your shift'}
        </div>

        <button
          onClick={handleToggle}
          className="w-full max-w-[420px] flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] hover:translate-y-[-1px]"
          style={{
            backgroundColor: clockedIn ? C.clay : C.ink,
            color: clockedIn ? C.cream : C.lime,
            borderRadius: 18,
            padding: '18px 20px',
            fontFamily: FONTS.sans,
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: '0.05em',
            boxShadow: `0 8px 20px -8px ${C.ink}50`,
          }}
        >
          {clockedIn ? (
            <>
              <Square size={14} strokeWidth={2.5} fill="currentColor" />
              <span className="uppercase tracking-[0.15em]">Clock Out</span>
            </>
          ) : (
            <>
              <span className="uppercase tracking-[0.15em]">Clock In</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
