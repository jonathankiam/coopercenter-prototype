'use client';

import { ArrowUpRight, Check, Lock } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { fmtMoney } from '@/lib/utils';
import type { ClientGroup } from '@/lib/timesheet';

interface SubmitFooterProps {
  groups: ClientGroup[];
  isFutureWeek: boolean;
  onSubmitClient: (client: string) => void;
}

export default function SubmitFooter({ groups, isFutureWeek, onSubmitClient }: SubmitFooterProps) {
  if (groups.length === 0) return null;

  const submittable = groups.filter((g) => g.status === 'draft');
  const noWork = submittable.length === 0;

  return (
    <div
      className="sticky bottom-0 left-0 right-0 z-10 -mx-10 px-10 py-3 flex items-center gap-4"
      style={{
        backgroundColor: `${C.cream}F2`,
        backdropFilter: 'blur(8px)',
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div className="flex flex-col">
        <span
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          {isFutureWeek
            ? 'Submission locked'
            : noWork
              ? 'All caught up'
              : `${submittable.length} ${submittable.length === 1 ? 'timecard' : 'timecards'} ready to submit`}
        </span>
        <span
          className="text-[13px] mt-0.5"
          style={{ color: C.inkSoft, fontFamily: FONTS.sans }}
        >
          {isFutureWeek
            ? 'This pay period has not begun yet.'
            : noWork
              ? 'Every timecard for this period has been submitted.'
              : 'Each client must be submitted separately.'}
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {groups.map((g) => {
          const submitted = g.status !== 'draft';
          const accent = g.jobs[0]?.color ?? C.muted;
          const canSubmit = !isFutureWeek && !submitted;

          return (
            <button
              key={g.client}
              onClick={() => canSubmit && onSubmitClient(g.client)}
              disabled={!canSubmit}
              className="flex items-center gap-2.5 pl-3 pr-4 h-11 rounded-full transition-all"
              style={{
                backgroundColor: canSubmit ? C.ink : C.bone,
                color: canSubmit ? C.cream : C.muted,
                border: canSubmit ? `1px solid ${C.ink}` : `1px solid ${C.borderSoft}`,
                fontFamily: FONTS.sans,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                boxShadow: canSubmit ? `0 6px 16px -8px ${C.ink}50` : 'none',
              }}
              title={
                isFutureWeek
                  ? 'Submission unlocks when this week begins'
                  : submitted
                    ? `${g.client} timecard already submitted`
                    : `Submit ${g.client} timecard (${g.entries.length} entries · ${g.totalHours.toFixed(1)}h)`
              }
            >
              <span
                className="block w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: submitted ? C.mutedSoft : accent }}
              />
              <span className="text-[13px] font-medium">{g.client}</span>
              <span
                className="text-[11px] tabular-nums opacity-70"
                style={{ fontFamily: FONTS.mono }}
              >
                {g.totalHours.toFixed(1)}h · {fmtMoney(g.earnings)}
              </span>
              {submitted ? (
                <Check size={14} strokeWidth={2.5} />
              ) : isFutureWeek ? (
                <Lock size={13} strokeWidth={2.4} />
              ) : (
                <ArrowUpRight size={14} strokeWidth={2.5} style={{ color: C.lime }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
