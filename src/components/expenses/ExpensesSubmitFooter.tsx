'use client';

import { ArrowUpRight, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="sticky bottom-0 left-0 right-0 z-10 -mx-10 px-10 py-3 flex items-center gap-4 bg-card/95 backdrop-blur-md border-t">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          {noWork
            ? 'All caught up'
            : `${submittable.length} ${submittable.length === 1 ? 'report' : 'reports'} ready · ${fmtMoney(totalReady)}`}
        </span>
        <span className="text-sm mt-0.5 text-foreground">
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
              const accent = s.job?.color ?? 'currentColor';
              return (
                <Button
                  key={s.report.id}
                  onClick={() => onSubmit(s.report.id)}
                  variant="outline"
                  className="h-10 pl-3 pr-3.5 gap-2 rounded-full flex-shrink-0"
                  title={`Submit ${s.report.client} · Week of ${monthName(s.report.weekStart).slice(0, 3)} ${dayNum(s.report.weekStart)}`}
                >
                  <span
                    className="block size-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: accent }}
                  />
                  <span className="text-xs font-medium">{s.report.client}</span>
                  <span className="text-[11px] tabular-nums opacity-70 font-mono">
                    {fmtMoney(s.total)}
                  </span>
                  <ArrowUpRight className="size-3 text-muted-foreground" />
                </Button>
              );
            })}
          </div>

          <Button onClick={onSubmitAll} className="h-11 pl-3 pr-4 gap-2 rounded-full">
            <Send className="size-3.5" />
            Submit all · {fmtMoney(totalReady)}
          </Button>
        </>
      )}

      {noWork && (
        <span className="flex items-center gap-2 text-xs px-3 h-10 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60 font-medium">
          <Check className="size-3.5" />
          Everything submitted
        </span>
      )}
    </div>
  );
}
