'use client';

import { ArrowUpRight, Check, Send } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { fmtMoney, monthName, dayNum } from '@/lib/utils';
import type { ReportSummary } from '@/lib/expenses';
import { isOpenStatus } from '@/lib/expenses';

interface ExpensesSubmitFooterProps {
  summaries: ReportSummary[];
  onSubmit: (reportId: string) => void;
  onSubmitAll: () => void;
}

export default function ExpensesSubmitFooter({
  summaries,
  onSubmit,
  onSubmitAll,
}: ExpensesSubmitFooterProps) {
  const submittable = summaries.filter((s) => isOpenStatus(s.report.status));
  const submittedCount = summaries.filter((s) => !isOpenStatus(s.report.status)).length;
  const hasAny = summaries.length > 0;
  if (!hasAny) return null;

  const noWork = submittable.length === 0;
  const totalReady = submittable.reduce((s, r) => s + r.total, 0);

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
          {noWork
            ? 'All caught up'
            : `${submittable.length} ${submittable.length === 1 ? 'report' : 'reports'} ready · ${fmtMoney(totalReady)}`}
        </span>
        <span
          className="text-[13px] mt-0.5"
          style={{ color: C.inkSoft, fontFamily: FONTS.sans }}
        >
          {noWork
            ? `${submittedCount} ${submittedCount === 1 ? 'report has' : 'reports have'} been submitted.`
            : 'Submit each report individually or all at once.'}
        </span>
      </div>

      <div className="flex-1" />

      {!noWork && (
        <>
          <div className="flex items-center gap-2 max-w-[60%] overflow-x-auto">
            {submittable.map((s) => {
              const accent = s.job?.color ?? C.muted;
              return (
                <button
                  key={s.report.id}
                  onClick={() => onSubmit(s.report.id)}
                  className="flex items-center gap-2 pl-3 pr-3.5 h-10 rounded-full transition-all flex-shrink-0"
                  style={{
                    backgroundColor: C.bone,
                    color: C.ink,
                    border: `1px solid ${C.borderSoft}`,
                    fontFamily: FONTS.sans,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                  title={`Submit ${s.report.client} · Week of ${monthName(s.report.weekStart).slice(0, 3)} ${dayNum(s.report.weekStart)}`}
                >
                  <span
                    className="block w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: accent }}
                  />
                  <span>{s.report.client}</span>
                  <span
                    className="text-[11px] tabular-nums opacity-70"
                    style={{ fontFamily: FONTS.mono }}
                  >
                    {fmtMoney(s.total)}
                  </span>
                  <ArrowUpRight size={12} strokeWidth={2.5} style={{ color: C.muted }} />
                </button>
              );
            })}
          </div>

          <button
            onClick={onSubmitAll}
            className="flex items-center gap-2 pl-3 pr-4 h-11 rounded-full transition-all hover:translate-y-[-1px]"
            style={{
              backgroundColor: C.ink,
              color: C.lime,
              border: `1px solid ${C.ink}`,
              fontFamily: FONTS.sans,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.04em',
              boxShadow: `0 6px 16px -8px ${C.ink}50`,
            }}
          >
            <Send size={13} strokeWidth={2.4} />
            Submit all · {fmtMoney(totalReady)}
          </button>
        </>
      )}

      {noWork && (
        <span
          className="flex items-center gap-2 text-[12px] px-3 h-10 rounded-full"
          style={{
            backgroundColor: '#E5E5E5',
            color: '#0A0A0A',
            fontFamily: FONTS.sans,
            fontWeight: 500,
            border: '1px solid #D4D4D4',
          }}
        >
          <Check size={13} strokeWidth={2.5} />
          Everything submitted
        </span>
      )}
    </div>
  );
}
