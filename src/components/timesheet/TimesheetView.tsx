'use client';

import { useMemo, useState } from 'react';
import { C, FONTS } from '@/lib/design';
import { monthName, dayNum, computeBreakdown } from '@/lib/utils';
import {
  buildWeekDays,
  weekStartFor,
  groupWeekByClient,
  weekTimingState,
} from '@/lib/timesheet';
import TimesheetToolbar from './TimesheetToolbar';
import SummaryBar from './SummaryBar';
import ClientTabs, { type ClientFilter } from './ClientTabs';
import TimesheetGrid from './TimesheetGrid';
import SubmitFooter from './SubmitFooter';
import Toast from '@/components/Toast';
import type { TimeEntry, Job } from '@/lib/types';
import type { EntryStatus } from '@/lib/design';

interface TimesheetViewProps {
  initialEntries: TimeEntry[];
  jobs: Job[];
  serverNow: string;
}

export default function TimesheetView({ initialEntries, jobs, serverNow }: TimesheetViewProps) {
  const today = useMemo(() => new Date(serverNow), [serverNow]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [entries, setEntries] = useState(initialEntries);
  const [filter, setFilter] = useState<ClientFilter>('all');
  const [toast, setToast] = useState<string | null>(null);

  const weekStart = useMemo(() => weekStartFor(today, weekOffset), [today, weekOffset]);
  const weekDays = useMemo(() => buildWeekDays(weekStart, entries), [weekStart, entries]);
  const weekEntries = useMemo(() => weekDays.flatMap((d) => d.entries), [weekDays]);
  const groups = useMemo(() => groupWeekByClient(weekEntries, jobs), [weekEntries, jobs]);

  const timing = weekTimingState(weekStart, today);
  const isFutureWeek = timing === 'future';

  // Apply client filter to the days/entries we hand to the grid + summary.
  const filteredWeekDays = useMemo(() => {
    if (filter === 'all') return weekDays;
    return weekDays.map((d) => ({
      date: d.date,
      entries: d.entries.filter((e) => {
        const job = jobs.find((j) => j.id === e.jobId);
        return job?.client === filter;
      }),
    }));
  }, [weekDays, filter, jobs]);

  const filteredEntries = filteredWeekDays.flatMap((d) => d.entries);
  const filteredBreakdown = computeBreakdown(filteredEntries);
  const filteredEarnings = (() => {
    if (filter === 'all') return groups.reduce((s, g) => s + g.earnings, 0);
    return groups.find((g) => g.client === filter)?.earnings ?? 0;
  })();

  const submitClient = (client: string) => {
    const targetIds = new Set(
      weekEntries.filter((e) => {
        const job = jobs.find((j) => j.id === e.jobId);
        return job?.client === client && e.status === 'draft';
      }).map((e) => e.id),
    );
    if (targetIds.size === 0) return;
    setEntries((prev) =>
      prev.map((e) => (targetIds.has(e.id) ? { ...e, status: 'pending' as EntryStatus } : e)),
    );
    setToast(`${client} timecard submitted · ${targetIds.size} ${targetIds.size === 1 ? 'entry' : 'entries'}`);
  };

  const handleAddDay = (date: Date) => {
    setToast(`Add entry for ${monthName(date).slice(0, 3)} ${dayNum(date)} — coming soon`);
  };

  const handleRowMenu = (entry: TimeEntry) => {
    const job = jobs.find((j) => j.id === entry.jobId);
    setToast(`Row actions for ${job?.name ?? 'entry'} — coming soon`);
  };

  const weekStartLabel = `${monthName(weekDays[0].date)} ${dayNum(weekDays[0].date)}`;
  const weekEndLabel = `${monthName(weekDays[6].date).slice(0, 3)} ${dayNum(weekDays[6].date)}, ${weekDays[6].date.getFullYear()}`;

  return (
    <div className="min-h-screen px-10 py-8 max-w-[1500px] mx-auto pb-24">
      <header className="mb-5">
        <div
          className="text-[11px] uppercase tracking-[0.25em]"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          Timesheet
        </div>
        <h1
          className="text-[32px] mt-1 tracking-tight leading-tight"
          style={{ color: C.ink, fontFamily: FONTS.serif }}
        >
          <span style={{ fontStyle: 'italic' }}>Weekly timecard</span>
        </h1>
      </header>

      <TimesheetToolbar
        weekStartLabel={weekStartLabel}
        weekEndLabel={weekEndLabel}
        timing={timing}
        onPrev={() => setWeekOffset((o) => o - 1)}
        onNext={() => setWeekOffset((o) => o + 1)}
        onToday={() => setWeekOffset(0)}
      />

      <SummaryBar
        breakdown={filteredBreakdown}
        earnings={filteredEarnings}
        entryCount={filteredEntries.length}
      />

      {groups.length > 0 && (
        <ClientTabs groups={groups} active={filter} onChange={setFilter} />
      )}

      <TimesheetGrid
        weekDays={filteredWeekDays}
        jobs={jobs}
        today={today}
        weekTotal={filteredBreakdown.total}
        onAddDay={handleAddDay}
        onRowMenu={handleRowMenu}
      />

      {/* Submit footer pinned to bottom of the page content */}
      <SubmitFooter
        groups={groups}
        isFutureWeek={isFutureWeek}
        onSubmitClient={submitClient}
      />

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
