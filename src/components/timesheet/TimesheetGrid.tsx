'use client';

import { MoreHorizontal, AlertTriangle, Lock, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dayLabel, dayNum, monthName, sameDay, isBackfilledLivePunch, computeBreakdown, cn } from '@/lib/utils';
import StatusPill from '@/components/StatusPill';
import ManualBadge from '@/components/ManualBadge';
import type { TimeEntry, Job } from '@/lib/types';
import type { WeekDay } from '@/lib/timesheet';

interface TimesheetGridProps {
  weekDays: WeekDay[];
  jobs: Job[];
  today: Date;
  weekTotal: number;
  onAddDay?: (date: Date) => void;
  onRowMenu?: (entry: TimeEntry) => void;
}

const COL = '120px minmax(220px, 1.4fr) 130px 70px minmax(180px, 1fr) 110px 36px';

export default function TimesheetGrid({
  weekDays,
  jobs,
  today,
  weekTotal,
  onAddDay,
  onRowMenu,
}: TimesheetGridProps) {
  return (
    <Card className="overflow-hidden mb-6 p-0 gap-0">
      {/* Header row */}
      <div
        className="grid items-center px-5 py-2.5 bg-muted border-b text-[10px] uppercase tracking-widest text-muted-foreground font-medium"
        style={{ gridTemplateColumns: COL }}
      >
        <span>Day</span>
        <span>Job · Notes</span>
        <span>Time</span>
        <span className="text-right">Hours</span>
        <span>Pay code · OT/DT</span>
        <span>Status</span>
        <span></span>
      </div>

      {weekDays.map((day) => (
        <DayBand
          key={day.date.toISOString()}
          day={day}
          jobs={jobs}
          today={today}
          colTemplate={COL}
          onAddDay={onAddDay}
          onRowMenu={onRowMenu}
        />
      ))}

      {/* Footer row — grand total */}
      <div
        className="grid items-center px-5 py-3 bg-foreground text-background"
        style={{ gridTemplateColumns: COL }}
      >
        <span className="text-[10px] uppercase tracking-widest text-background/60 font-medium">
          Week total
        </span>
        <span></span>
        <span></span>
        <span className="text-right tabular-nums font-mono text-lg font-semibold">
          {weekTotal.toFixed(1)}h
        </span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </Card>
  );
}

interface DayBandProps {
  day: WeekDay;
  jobs: Job[];
  today: Date;
  colTemplate: string;
  onAddDay?: (date: Date) => void;
  onRowMenu?: (entry: TimeEntry) => void;
}

function DayBand({ day, jobs, today, colTemplate, onAddDay, onRowMenu }: DayBandProps) {
  const isToday = sameDay(day.date, today);
  const sorted = [...day.entries].sort((a, b) => a.start.localeCompare(b.start));
  const bd = computeBreakdown(sorted);
  const hasOTorDT = bd.ot > 0 || bd.dt > 0;
  const isEmpty = sorted.length === 0;

  return (
    <div>
      {/* Day header band */}
      <div
        className={cn(
          'flex items-center justify-between px-5 py-2 border-b',
          isToday ? 'bg-accent' : 'bg-muted/30',
        )}
      >
        <div className="flex items-baseline gap-3">
          <span
            className={cn(
              'text-[11px] uppercase tracking-widest',
              isToday ? 'text-foreground font-semibold' : 'text-muted-foreground font-medium',
            )}
          >
            {dayLabel(day.date)}
          </span>
          <span className="text-sm font-medium tabular-nums">
            {monthName(day.date).slice(0, 3)} {dayNum(day.date)}
          </span>
          {isToday && (
            <Badge variant="default" className="uppercase tracking-wide text-[9px] h-5">
              Today
            </Badge>
          )}
          {hasOTorDT && (
            <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-3" />
              {bd.ot > 0 && `${bd.ot.toFixed(1)} OT`}
              {bd.ot > 0 && bd.dt > 0 && ' · '}
              {bd.dt > 0 && `${bd.dt.toFixed(1)} DT`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'text-xs tabular-nums font-mono font-medium',
              isEmpty ? 'text-muted-foreground/60' : 'text-foreground',
            )}
          >
            {isEmpty ? '— · 0.0h' : `${sorted.length} · ${bd.total.toFixed(1)}h`}
          </span>
          {onAddDay && (
            <Button
              onClick={() => onAddDay(day.date)}
              variant="outline"
              size="icon"
              className="size-6 rounded-full"
              title={`Add an entry for ${dayLabel(day.date)} ${monthName(day.date).slice(0, 3)} ${dayNum(day.date)}`}
              aria-label="Add entry"
            >
              <Plus className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Entry rows */}
      {isEmpty ? (
        <div className="px-5 py-3 text-xs italic text-muted-foreground/70 border-b bg-card">
          No entries logged
        </div>
      ) : (
        sorted.map((e) => (
          <EntryRow
            key={e.id}
            entry={e}
            jobs={jobs}
            colTemplate={colTemplate}
            onRowMenu={onRowMenu}
          />
        ))
      )}
    </div>
  );
}

interface EntryRowProps {
  entry: TimeEntry;
  jobs: Job[];
  colTemplate: string;
  onRowMenu?: (entry: TimeEntry) => void;
}

function EntryRow({ entry, jobs, colTemplate, onRowMenu }: EntryRowProps) {
  const job = jobs.find((j) => j.id === entry.jobId);
  const showManual = isBackfilledLivePunch(entry, jobs);
  const locked = entry.status === 'paid' || entry.status === 'approved';
  const hasOT = entry.otH > 0;
  const hasDT = entry.dtH > 0;

  return (
    <div
      className={cn(
        'grid items-center px-5 py-2.5 transition-colors group hover:bg-accent/50 border-b bg-card',
        locked && 'opacity-85',
      )}
      style={{ gridTemplateColumns: colTemplate }}
    >
      {/* Day cell */}
      <span className="text-[11px] tabular-nums text-muted-foreground/70">
        {dayLabel(entry.date).slice(0, 3)} {monthName(entry.date).slice(0, 3)} {dayNum(entry.date)}
      </span>

      {/* Job + notes */}
      <div className="min-w-0 flex items-center gap-2.5">
        <span
          className="block w-1 h-7 rounded-full flex-shrink-0"
          style={{ backgroundColor: job?.color }}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium truncate">{job?.name ?? 'Unknown job'}</span>
            {showManual && <ManualBadge />}
            {locked && <Lock className="size-3 text-muted-foreground/60" />}
          </div>
          {entry.note && (
            <div className="text-[11px] italic truncate mt-0.5 text-muted-foreground">
              &ldquo;{entry.note}&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* Time range */}
      <span className="text-xs tabular-nums font-mono text-foreground/80">
        {entry.start} → {entry.end}
      </span>

      {/* Hours */}
      <span className="text-sm tabular-nums text-right font-mono font-medium">
        {entry.hours.toFixed(1)}h
      </span>

      {/* Pay code · OT/DT */}
      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
        {entry.paycode && (
          <Badge variant="secondary" className="uppercase tracking-wide text-[10px] h-5">
            {entry.paycode}
          </Badge>
        )}
        {entry.costCenter && (
          <span className="text-[11px] truncate text-muted-foreground">
            {entry.costCenter}
          </span>
        )}
        {hasOT && (
          <Badge
            variant="outline"
            className="uppercase tracking-wide text-[10px] h-5 bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60"
          >
            +{entry.otH.toFixed(1)} OT
          </Badge>
        )}
        {hasDT && (
          <Badge
            variant="outline"
            className="uppercase tracking-wide text-[10px] h-5 bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60"
          >
            +{entry.dtH.toFixed(1)} DT
          </Badge>
        )}
      </div>

      {/* Status */}
      <div>
        <StatusPill status={entry.status} />
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          onClick={() => onRowMenu?.(entry)}
          variant="ghost"
          size="icon"
          className="size-7 opacity-0 group-hover:opacity-100"
          aria-label="Row actions"
          disabled={locked}
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
