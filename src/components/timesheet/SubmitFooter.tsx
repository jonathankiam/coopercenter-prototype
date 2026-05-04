'use client';

import { ArrowUpRight, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fmtMoney } from '@/lib/utils';
import { cn } from '@/lib/cn';
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
    <div className="sticky bottom-0 left-0 right-0 z-10 -mx-10 px-10 py-3 flex items-center gap-4 bg-background/95 backdrop-blur border-t border-border">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {isFutureWeek
            ? 'Submission locked'
            : noWork
              ? 'All caught up'
              : `${submittable.length} ${submittable.length === 1 ? 'timecard' : 'timecards'} ready to submit`}
        </span>
        <span className="text-[13px] mt-0.5 text-foreground/80">
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
          const canSubmit = !isFutureWeek && !submitted;

          return (
            <Button
              key={g.client}
              onClick={() => canSubmit && onSubmitClient(g.client)}
              disabled={!canSubmit}
              variant={canSubmit ? 'default' : 'outline'}
              size="lg"
              className={cn('rounded-full gap-2.5 pl-3 pr-4', !canSubmit && 'text-muted-foreground')}
              title={
                isFutureWeek
                  ? 'Submission unlocks when this week begins'
                  : submitted
                    ? `${g.client} timecard already submitted`
                    : `Submit ${g.client} timecard (${g.entries.length} entries · ${g.totalHours.toFixed(1)}h)`
              }
            >
              <span
                className={cn(
                  'block w-2 h-2 rounded-full flex-shrink-0',
                  submitted ? 'bg-muted-foreground' : canSubmit ? 'bg-primary-foreground' : 'bg-muted-foreground',
                )}
              />
              <span className="text-[13px] font-medium">{g.client}</span>
              <span className="text-[11px] font-mono tabular-nums opacity-70">
                {g.totalHours.toFixed(1)}h · {fmtMoney(g.earnings)}
              </span>
              {submitted ? (
                <Check size={14} strokeWidth={2.5} />
              ) : isFutureWeek ? (
                <Lock size={13} strokeWidth={2.4} />
              ) : (
                <ArrowUpRight size={14} strokeWidth={2.5} />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
