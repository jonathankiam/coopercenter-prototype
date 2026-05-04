'use client';

import { Fragment } from 'react';
import { MoreHorizontal, AlertTriangle, Lock, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { dayLabel, dayNum, monthName, sameDay, isBackfilledLivePunch, computeBreakdown } from '@/lib/utils';
import { cn } from '@/lib/cn';
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

export default function TimesheetGrid({
  weekDays,
  jobs,
  today,
  weekTotal,
  onAddDay,
  onRowMenu,
}: TimesheetGridProps) {
  return (
    <Card className="overflow-hidden mb-6 py-0 shadow-none">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[140px] px-5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Day
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Job · Notes
            </TableHead>
            <TableHead className="w-[140px] text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Time
            </TableHead>
            <TableHead className="w-[80px] text-right text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Hours
            </TableHead>
            <TableHead className="w-[200px] text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Pay code · OT/DT
            </TableHead>
            <TableHead className="w-[120px] text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="w-[44px] px-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {weekDays.map((day) => (
            <DayBand
              key={day.date.toISOString()}
              day={day}
              jobs={jobs}
              today={today}
              onAddDay={onAddDay}
              onRowMenu={onRowMenu}
            />
          ))}
        </TableBody>

        <tfoot>
          <tr className="bg-primary text-primary-foreground">
            <td className="px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-primary-foreground/70">
              Week total
            </td>
            <td />
            <td />
            <td className="px-2 py-3 text-right font-mono tabular-nums text-lg font-medium">
              {weekTotal.toFixed(1)}h
            </td>
            <td />
            <td />
            <td />
          </tr>
        </tfoot>
      </Table>
    </Card>
  );
}

// ─── Day band ─── //

interface DayBandProps {
  day: WeekDay;
  jobs: Job[];
  today: Date;
  onAddDay?: (date: Date) => void;
  onRowMenu?: (entry: TimeEntry) => void;
}

function DayBand({ day, jobs, today, onAddDay, onRowMenu }: DayBandProps) {
  const isToday = sameDay(day.date, today);
  const sorted = [...day.entries].sort((a, b) => a.start.localeCompare(b.start));
  const bd = computeBreakdown(sorted);
  const hasOTorDT = bd.ot > 0 || bd.dt > 0;
  const isEmpty = sorted.length === 0;

  return (
    <Fragment>
      {/* Day header band */}
      <tr
        className={cn(
          'border-b',
          isToday ? 'bg-muted/60' : 'bg-muted/20',
        )}
      >
        <td colSpan={7} className="px-5 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span
                className={cn(
                  'text-[11px] uppercase tracking-[0.2em]',
                  isToday ? 'text-foreground font-semibold' : 'text-muted-foreground font-medium',
                )}
              >
                {dayLabel(day.date)}
              </span>
              <span className="text-[14px] font-medium tabular-nums text-foreground">
                {monthName(day.date).slice(0, 3)} {dayNum(day.date)}
              </span>
              {isToday && (
                <Badge variant="default" className="text-[9px] uppercase tracking-[0.1em] rounded">
                  Today
                </Badge>
              )}
              {hasOTorDT && (
                <span className="flex items-center gap-1 text-[10px] text-foreground font-medium">
                  <AlertTriangle size={10} strokeWidth={2.4} />
                  {bd.ot > 0 && `${bd.ot.toFixed(1)} OT`}
                  {bd.ot > 0 && bd.dt > 0 && ' · '}
                  {bd.dt > 0 && `${bd.dt.toFixed(1)} DT`}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'text-[12px] font-mono tabular-nums font-medium',
                  isEmpty ? 'text-muted-foreground' : 'text-foreground',
                )}
              >
                {isEmpty ? '— · 0.0h' : `${sorted.length} · ${bd.total.toFixed(1)}h`}
              </span>
              {onAddDay && (
                <Button
                  variant="outline"
                  size="icon-xs"
                  onClick={() => onAddDay(day.date)}
                  title={`Add an entry for ${dayLabel(day.date)} ${monthName(day.date).slice(0, 3)} ${dayNum(day.date)}`}
                  aria-label="Add entry"
                  className="rounded-full"
                >
                  <Plus size={11} strokeWidth={2.5} />
                </Button>
              )}
            </div>
          </div>
        </td>
      </tr>

      {/* Entry rows */}
      {isEmpty ? (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={7} className="px-5 py-3 text-[12px] italic text-muted-foreground">
            No entries logged
          </TableCell>
        </TableRow>
      ) : (
        sorted.map((e) => (
          <EntryRow
            key={e.id}
            entry={e}
            jobs={jobs}
            onRowMenu={onRowMenu}
          />
        ))
      )}
    </Fragment>
  );
}

// ─── Entry row ─── //

interface EntryRowProps {
  entry: TimeEntry;
  jobs: Job[];
  onRowMenu?: (entry: TimeEntry) => void;
}

function EntryRow({ entry, jobs, onRowMenu }: EntryRowProps) {
  const job = jobs.find((j) => j.id === entry.jobId);
  const showManual = isBackfilledLivePunch(entry, jobs);
  const locked = entry.status === 'paid' || entry.status === 'approved';
  const hasOT = entry.otH > 0;
  const hasDT = entry.dtH > 0;

  return (
    <TableRow className={cn('group', locked && 'opacity-80')}>
      {/* Day cell — subtle */}
      <TableCell className="px-5 text-[11px] font-mono tabular-nums text-muted-foreground">
        {dayLabel(entry.date).slice(0, 3)} {monthName(entry.date).slice(0, 3)} {dayNum(entry.date)}
      </TableCell>

      {/* Job + notes */}
      <TableCell>
        <div className="min-w-0 flex items-center gap-2.5">
          <span className="block w-1 h-7 rounded-full flex-shrink-0 bg-foreground/60" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] font-medium truncate text-foreground">
                {job?.name ?? 'Unknown job'}
              </span>
              {showManual && <ManualBadge />}
              {locked && (
                <Lock size={10} strokeWidth={2.4} className="text-muted-foreground" />
              )}
            </div>
            {entry.note && (
              <div className="text-[11px] italic truncate mt-0.5 text-muted-foreground">
                &ldquo;{entry.note}&rdquo;
              </div>
            )}
          </div>
        </div>
      </TableCell>

      {/* Time range */}
      <TableCell className="text-[12px] font-mono tabular-nums text-foreground/80">
        {entry.start} → {entry.end}
      </TableCell>

      {/* Hours (right aligned, mono, larger) */}
      <TableCell className="text-right text-[14px] font-mono tabular-nums font-medium text-foreground">
        {entry.hours.toFixed(1)}h
      </TableCell>

      {/* Pay code · OT/DT badges */}
      <TableCell>
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          {entry.paycode && (
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider rounded">
              {entry.paycode}
            </Badge>
          )}
          {entry.costCenter && (
            <span className="text-[11px] truncate text-muted-foreground">
              {entry.costCenter}
            </span>
          )}
          {hasOT && (
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider rounded">
              +{entry.otH.toFixed(1)} OT
            </Badge>
          )}
          {hasDT && (
            <Badge variant="default" className="text-[10px] uppercase tracking-wider rounded">
              +{entry.dtH.toFixed(1)} DT
            </Badge>
          )}
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusPill status={entry.status} />
      </TableCell>

      {/* Actions */}
      <TableCell className="px-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onRowMenu?.(entry)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Row actions"
          disabled={locked}
        >
          <MoreHorizontal size={14} />
        </Button>
      </TableCell>
    </TableRow>
  );
}
