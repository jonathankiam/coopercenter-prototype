'use client';

import { ChevronLeft, ChevronRight, Download, Printer } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { WeekTimingState } from '@/lib/timesheet';

interface TimesheetToolbarProps {
  weekStartLabel: string;
  weekEndLabel: string;
  timing: WeekTimingState;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const TIMING_BADGE: Record<WeekTimingState, { label: string; className: string }> = {
  current: { label: 'Current period', className: 'bg-emerald-500 text-white border-transparent dark:bg-emerald-600' },
  past:    { label: 'Past period',    className: '' },
  future:  { label: 'Upcoming',       className: '' },
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
    <Card className="flex flex-row items-center justify-between gap-4 px-5 py-3 mb-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          Pay period
        </div>
        <div className="text-sm font-medium tabular-nums">
          {weekStartLabel}
          <span className="mx-1.5 text-muted-foreground">—</span>
          {weekEndLabel}
        </div>
        <Badge variant="secondary" className={cn('uppercase tracking-wide text-[10px]', badge.className)}>
          {badge.label}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-md border bg-muted p-0.5">
          <Button onClick={onPrev} variant="ghost" size="icon" className="size-7" aria-label="Previous week">
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button
            onClick={onToday}
            variant="ghost"
            size="sm"
            className="h-7 px-3 text-xs"
            disabled={timing === 'current'}
          >
            Today
          </Button>
          <Button onClick={onNext} variant="ghost" size="icon" className="size-7" aria-label="Next week">
            <ChevronRight className="size-3.5" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="size-3.5" />
          Export
        </Button>
        <Button variant="outline" size="icon" className="size-9" aria-label="Print timecard">
          <Printer className="size-3.5" />
        </Button>
      </div>
    </Card>
  );
}
