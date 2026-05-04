'use client';

import { ArrowUpRight, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fmtMoney, monthName, dayNum } from '@/lib/utils';
import { cn } from '@/lib/cn';
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
    <div className="sticky bottom-0 left-0 right-0 z-10 -mx-10 px-10 py-3 flex items-center gap-4 bg-background/95 backdrop-blur border-t border-border">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {noWork
            ? 'All caught up'
            : `${submittable.length} ${submittable.length === 1 ? 'report' : 'reports'} ready · ${fmtMoney(totalReady)}`}
        </span>
        <span className="text-[13px] mt-0.5 text-foreground/80">
          {noWork
            ? `${submittedCount} ${submittedCount === 1 ? 'report has' : 'reports have'} been submitted.`
            : 'Submit each report individually or all at once.'}
        </span>
      </div>

      <div className="flex-1" />

      {!noWork && (
        <>
          <div className="flex items-center gap-2 max-w-[55%] overflow-x-auto">
            {submittable.map((s) => (
              <Button
                key={s.report.id}
                onClick={() => onSubmit(s.report.id)}
                variant="outline"
                size="default"
                className="rounded-full gap-2 pl-3 pr-3.5 flex-shrink-0"
                title={`Submit ${s.report.client} · Week of ${monthName(s.report.weekStart).slice(0, 3)} ${dayNum(s.report.weekStart)}`}
              >
                <span className="block w-2 h-2 rounded-full flex-shrink-0 bg-foreground/60" />
                <span className="text-[13px] font-medium">{s.report.client}</span>
                <span className="text-[11px] font-mono tabular-nums opacity-70">
                  {fmtMoney(s.total)}
                </span>
                <ArrowUpRight size={12} strokeWidth={2.5} className="text-muted-foreground" />
              </Button>
            ))}
          </div>

          <Button
            onClick={onSubmitAll}
            size="lg"
            className="rounded-full gap-2 pl-3 pr-4 uppercase tracking-[0.04em]"
          >
            <Send size={13} strokeWidth={2.4} />
            Submit all · {fmtMoney(totalReady)}
          </Button>
        </>
      )}

      {noWork && (
        <Badge
          variant="secondary"
          className={cn('gap-1.5 px-3 h-9 text-[12px] rounded-full')}
        >
          <Check size={13} strokeWidth={2.5} />
          Everything submitted
        </Badge>
      )}
    </div>
  );
}
