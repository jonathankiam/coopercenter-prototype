'use client';

import { MoreHorizontal, AlertTriangle, Lock, Plus } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { dayLabel, dayNum, monthName, sameDay, isBackfilledLivePunch, computeBreakdown } from '@/lib/utils';
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

// Column template for the spreadsheet grid. Tuned so the data rows feel dense
// without overflow at common laptop widths (1280–1440px content area).
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
    <div
      className="rounded-2xl overflow-hidden mb-6"
      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
    >
      {/* Header row */}
      <div
        className="grid items-center px-5 py-2.5"
        style={{
          gridTemplateColumns: COL,
          backgroundColor: C.bone,
          borderBottom: `1px solid ${C.border}`,
          color: C.muted,
          fontFamily: FONTS.sans,
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        <span>Day</span>
        <span>Job · Notes</span>
        <span>Time</span>
        <span className="text-right">Hours</span>
        <span>Pay code · OT/DT</span>
        <span>Status</span>
        <span></span>
      </div>

      {/* Day bands */}
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
        className="grid items-center px-5 py-3"
        style={{
          gridTemplateColumns: COL,
          backgroundColor: C.ink,
          color: C.cream,
          borderTop: `1px solid ${C.ink}`,
        }}
      >
        <span
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: C.mutedSoft, fontFamily: FONTS.sans }}
        >
          Week total
        </span>
        <span></span>
        <span></span>
        <span
          className="text-right tabular-nums"
          style={{ fontFamily: FONTS.mono, fontSize: 18, color: C.lime, fontWeight: 500 }}
        >
          {weekTotal.toFixed(1)}h
        </span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

// ─── Day band ─── //

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
        className="flex items-center justify-between px-5 py-2"
        style={{
          backgroundColor: isToday ? '#FAFAFA' : C.paper,
          borderBottom: `1px solid ${C.borderSoft}`,
        }}
      >
        <div className="flex items-baseline gap-3">
          <span
            className="text-[11px] uppercase tracking-[0.2em]"
            style={{ color: isToday ? C.ink : C.muted, fontFamily: FONTS.sans, fontWeight: isToday ? 600 : 500 }}
          >
            {dayLabel(day.date)}
          </span>
          <span
            className="text-[14px] font-medium tabular-nums"
            style={{ color: C.ink, fontFamily: FONTS.sans }}
          >
            {monthName(day.date).slice(0, 3)} {dayNum(day.date)}
          </span>
          {isToday && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-[0.1em]"
              style={{ backgroundColor: C.lime, color: C.ink, fontFamily: FONTS.sans }}
            >
              Today
            </span>
          )}
          {hasOTorDT && (
            <span
              className="flex items-center gap-1 text-[10px]"
              style={{ color: C.amber, fontFamily: FONTS.sans }}
            >
              <AlertTriangle size={10} strokeWidth={2.4} />
              {bd.ot > 0 && `${bd.ot.toFixed(1)} OT`}
              {bd.ot > 0 && bd.dt > 0 && ' · '}
              {bd.dt > 0 && `${bd.dt.toFixed(1)} DT`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-[12px] tabular-nums font-medium"
            style={{
              color: isEmpty ? C.mutedSoft : C.ink,
              fontFamily: FONTS.mono,
            }}
          >
            {isEmpty ? '— · 0.0h' : `${sorted.length} · ${bd.total.toFixed(1)}h`}
          </span>
          {onAddDay && (
            <button
              onClick={() => onAddDay(day.date)}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-white/60"
              style={{
                backgroundColor: C.bone,
                border: `1px solid ${C.borderSoft}`,
                color: C.inkSoft,
              }}
              title={`Add an entry for ${dayLabel(day.date)} ${monthName(day.date).slice(0, 3)} ${dayNum(day.date)}`}
              aria-label="Add entry"
            >
              <Plus size={11} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* Entry rows */}
      {isEmpty ? (
        <div
          className="px-5 py-3 text-[12px]"
          style={{
            color: C.mutedSoft,
            fontFamily: FONTS.sans,
            fontStyle: 'italic',
            backgroundColor: C.cream,
            borderBottom: `1px solid ${C.borderSoft}`,
          }}
        >
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

// ─── Entry row ─── //

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
      className="grid items-center px-5 py-2.5 transition-colors group hover:bg-white/40"
      style={{
        gridTemplateColumns: colTemplate,
        borderBottom: `1px solid ${C.borderSoft}`,
        backgroundColor: C.cream,
        opacity: locked ? 0.85 : 1,
      }}
    >
      {/* Day cell — subtle, since the band already shows the day */}
      <span
        className="text-[11px] tabular-nums"
        style={{ color: C.mutedSoft, fontFamily: FONTS.sans }}
      >
        {dayLabel(entry.date).slice(0, 3)} {monthName(entry.date).slice(0, 3)} {dayNum(entry.date)}
      </span>

      {/* Job + notes */}
      <div className="min-w-0 flex items-center gap-2.5">
        <span
          className="block w-1 h-7 rounded-full flex-shrink-0"
          style={{ backgroundColor: job?.color ?? C.muted }}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[13px] font-medium truncate"
              style={{ color: C.ink, fontFamily: FONTS.sans }}
            >
              {job?.name ?? 'Unknown job'}
            </span>
            {showManual && <ManualBadge />}
            {locked && (
              <Lock size={10} strokeWidth={2.4} style={{ color: C.mutedSoft }} />
            )}
          </div>
          {entry.note && (
            <div
              className="text-[11px] italic truncate mt-0.5"
              style={{ color: C.muted, fontFamily: FONTS.sans }}
            >
              &ldquo;{entry.note}&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* Time range */}
      <span
        className="text-[12px] tabular-nums"
        style={{ color: C.inkSoft, fontFamily: FONTS.mono }}
      >
        {entry.start} → {entry.end}
      </span>

      {/* Hours (right aligned, mono, larger) */}
      <span
        className="text-[14px] tabular-nums text-right"
        style={{ color: C.ink, fontFamily: FONTS.mono, fontWeight: 500 }}
      >
        {entry.hours.toFixed(1)}h
      </span>

      {/* Pay code · OT/DT badges */}
      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
        {entry.paycode && (
          <span
            className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium"
            style={{ backgroundColor: C.bone, color: C.inkSoft, fontFamily: FONTS.sans }}
          >
            {entry.paycode}
          </span>
        )}
        {entry.costCenter && (
          <span
            className="text-[11px] truncate"
            style={{ color: C.muted, fontFamily: FONTS.sans }}
          >
            {entry.costCenter}
          </span>
        )}
        {hasOT && (
          <span
            className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium"
            style={{ backgroundColor: '#F0F0F0', color: '#404040', fontFamily: FONTS.sans }}
          >
            +{entry.otH.toFixed(1)} OT
          </span>
        )}
        {hasDT && (
          <span
            className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium"
            style={{ backgroundColor: '#E5E5E5', color: '#0A0A0A', fontFamily: FONTS.sans }}
          >
            +{entry.dtH.toFixed(1)} DT
          </span>
        )}
      </div>

      {/* Status */}
      <div>
        <StatusPill status={entry.status} />
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={() => onRowMenu?.(entry)}
          className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/60"
          style={{ color: C.muted }}
          aria-label="Row actions"
          disabled={locked}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  );
}
