'use client';

import { ArrowUpRight, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="sticky bottom-0 left-0 right-0 z-10 -mx-10 px-10 py-3 flex items-center gap-4 bg-card/95 backdrop-blur-md border-t">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          {isFutureWeek
            ? 'Submission locked'
            : noWork
              ? 'All caught up'
              : `${submittable.length} ${submittable.length === 1 ? 'timecard' : 'timecards'} ready to submit`}
        </span>
        <span className="text-sm mt-0.5 text-foreground">
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
          const accent = g.jobs[0]?.color ?? 'currentColor';
          const canSubmit = !isFutureWeek && !submitted;

          return (
            <Button
              key={g.client}
              onClick={() => canSubmit && onSubmitClient(g.client)}
              disabled={!canSubmit}
              variant={canSubmit ? 'default' : 'outline'}
              className="h-11 pl-3 pr-4 gap-2.5 rounded-full"
              title={
                isFutureWeek
                  ? 'Submission unlocks when this week begins'
                  : submitted
                    ? `${g.client} timecard already submitted`
                    : `Submit ${g.client} timecard (${g.entries.length} entries · ${g.totalHours.toFixed(1)}h)`
              }
            >
              <span
                className="block size-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: submitted ? 'currentColor' : accent, opacity: submitted ? 0.5 : 1 }}
              />
              <span className="text-sm font-medium">{g.client}</span>
              <span className="text-[11px] tabular-nums opacity-70 font-mono">
                {g.totalHours.toFixed(1)}h · {fmtMoney(g.earnings)}
              </span>
              {submitted ? (
                <Check className="size-3.5" />
              ) : isFutureWeek ? (
                <Lock className="size-3" />
              ) : (
                <ArrowUpRight className="size-3.5" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
