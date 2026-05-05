'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
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

  const weekStart = useMemo(() => weekStartFor(today, weekOffset), [today, weekOffset]);
  const weekDays = useMemo(() => buildWeekDays(weekStart, entries), [weekStart, entries]);
  const weekEntries = useMemo(() => weekDays.flatMap((d) => d.entries), [weekDays]);
  const groups = useMemo(() => groupWeekByClient(weekEntries, jobs), [weekEntries, jobs]);

  const timing = weekTimingState(weekStart, today);
  const isFutureWeek = timing === 'future';

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
    toast.success(`${client} timecard submitted`, {
      description: `${targetIds.size} ${targetIds.size === 1 ? 'entry' : 'entries'}`,
    });
  };

  const handleAddDay = (date: Date) => {
    toast(`Add entry for ${monthName(date).slice(0, 3)} ${dayNum(date)}`, {
      description: 'Coming soon',
    });
  };

  const handleRowMenu = (entry: TimeEntry) => {
    const job = jobs.find((j) => j.id === entry.jobId);
    toast(`Row actions for ${job?.name ?? 'entry'}`, { description: 'Coming soon' });
  };

  const weekStartLabel = `${monthName(weekDays[0].date)} ${dayNum(weekDays[0].date)}`;
  const weekEndLabel = `${monthName(weekDays[6].date).slice(0, 3)} ${dayNum(weekDays[6].date)}, ${weekDays[6].date.getFullYear()}`;

  return (
    <div className="min-h-screen px-10 py-8 max-w-[1500px] mx-auto pb-24">
      <header className="mb-5">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          Timesheet
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mt-1 leading-tight">
          Weekly timecard
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

      <SubmitFooter
        groups={groups}
        isFutureWeek={isFutureWeek}
        onSubmitClient={submitClient}
      />
    </div>
  );
}
