'use client';

import { ChevronLeft, ChevronRight, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { WeekTimingState } from '@/lib/timesheet';

interface TimesheetToolbarProps {
  weekStartLabel: string;
  weekEndLabel: string;
  timing: WeekTimingState;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const TIMING_LABEL: Record<WeekTimingState, string> = {
  current: 'Current period',
  past: 'Past period',
  future: 'Upcoming',
};

const TIMING_VARIANT: Record<WeekTimingState, 'default' | 'secondary' | 'outline'> = {
  current: 'default',
  past: 'secondary',
  future: 'outline',
};

export default function TimesheetToolbar({
  weekStartLabel,
  weekEndLabel,
  timing,
  onPrev,
  onNext,
  onToday,
}: TimesheetToolbarProps) {
  return (
    <Card className="flex-row items-center justify-between gap-4 px-5 py-3 mb-3 shadow-none">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Pay period
        </span>
        <span className="text-[15px] font-medium font-mono tabular-nums text-foreground">
          {weekStartLabel}
          <span className="mx-1.5 text-muted-foreground">—</span>
          {weekEndLabel}
        </span>
        <Badge
          variant={TIMING_VARIANT[timing]}
          className="text-[10px] uppercase tracking-[0.1em]"
        >
          {TIMING_LABEL[timing]}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-md border bg-muted/40 p-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onPrev}
            aria-label="Previous week"
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToday}
            disabled={timing === 'current'}
            className="uppercase tracking-[0.05em]"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onNext}
            aria-label="Next week"
          >
            <ChevronRight size={14} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="outline" size="sm" title="Export this pay period">
          <Download size={13} strokeWidth={2.2} />
          Export
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          title="Print timecard"
          aria-label="Print"
        >
          <Printer size={13} strokeWidth={2.2} />
        </Button>
      </div>
    </Card>
  );
}
