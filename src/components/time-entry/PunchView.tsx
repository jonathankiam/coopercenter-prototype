'use client';

/**
 * Time entry, redesigned around individual punches (clock-in events) instead of
 * the older daily-hour grid. Mirrors the Figma frame `Worker — Time Entry`.
 *
 * Major surfaces:
 *   - Period header (current pay period totals + Save draft / Review & submit)
 *   - Filter tabs (All / Auto / Manual / Conflicts)
 *   - Day-grouped punch cards with source pill (AUTO / MANUAL / EDITED)
 *   - Inline conflict alerts on overlapping punches
 *
 * Conflict detection lives in `lib/punches.ts`. Source pill resolution
 * (`source` field, falls back to `manuallyEntered`) is also there so the
 * older mock data without a source field still renders correctly.
 */

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, MoreHorizontal, Pencil, Plus, Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { fmtHours, fmtMoney, monthName, dayNum, dayLabel, computeBreakdown } from '@/lib/utils';
import { findOverlapIds, formatTimeRange, groupByDay, sourceLabel, sourceOf } from '@/lib/punches';
import type { TimeEntry, Job, EntrySource } from '@/lib/types';

interface PunchViewProps {
  initialEntries: TimeEntry[];
  jobs: Job[];
  serverNow: string;
}

type SourceFilter = 'all' | EntrySource | 'conflicts';

/** Anchor to the last 14 days ending today. Closest analog to a biweekly pay period for the demo. */
const periodWindow = (now: Date): { start: Date; end: Date } => {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(now);
  start.setDate(start.getDate() - 13);
  start.setHours(0, 0, 0, 0);
  return { start, end };
};

const SourcePill = ({ source }: { source: EntrySource }) => {
  const Icon = source === 'auto' ? Radio : Pencil;
  return (
    <Badge variant="outline" className="font-medium">
      <Icon className="size-3" />
      {sourceLabel(source).toUpperCase()}
    </Badge>
  );
};

export default function PunchView({ initialEntries, jobs, serverNow }: PunchViewProps) {
  const today = useMemo(() => new Date(serverNow), [serverNow]);
  const [entries, setEntries] = useState<TimeEntry[]>(initialEntries);
  const [filter, setFilter] = useState<SourceFilter>('all');

  const { start: periodStart, end: periodEnd } = useMemo(() => periodWindow(today), [today]);

  /** Entries inside the current pay period, regardless of filter. */
  const periodEntries = useMemo(
    () => entries.filter((e) => e.date >= periodStart && e.date <= periodEnd),
    [entries, periodStart, periodEnd],
  );

  /** Sets of conflicting entry ids (same-day overlap). */
  const conflictIds = useMemo(() => findOverlapIds(periodEntries), [periodEntries]);

  /** Apply the active filter for what to show in the list. */
  const visibleEntries = useMemo(() => {
    if (filter === 'all') return periodEntries;
    if (filter === 'conflicts') return periodEntries.filter((e) => conflictIds.has(e.id));
    return periodEntries.filter((e) => sourceOf(e) === filter);
  }, [periodEntries, filter, conflictIds]);

  const dayGroups = useMemo(() => Array.from(groupByDay(visibleEntries).entries()), [visibleEntries]);

  const breakdown = computeBreakdown(periodEntries);
  const earnings = useMemo(() => {
    return periodEntries.reduce((sum, e) => {
      const job = jobs.find((j) => j.id === e.jobId);
      const rate = job?.rate ?? 0;
      return sum + (e.regularH ?? e.hours) * rate + (e.otH ?? 0) * rate * 1.5 + (e.dtH ?? 0) * rate * 2;
    }, 0);
  }, [periodEntries, jobs]);

  const counts = useMemo(() => {
    const c = { all: 0, auto: 0, manual: 0, edited: 0 };
    for (const e of periodEntries) {
      c.all++;
      c[sourceOf(e)]++;
    }
    return c;
  }, [periodEntries]);

  const periodLabel = `${monthName(periodStart).slice(0, 3)} ${dayNum(periodStart)} – ${monthName(periodEnd).slice(0, 3)} ${dayNum(periodEnd)}, ${periodEnd.getFullYear()}`;

  const handleAddPunch = () => toast('Add punch', { description: 'Coming soon' });
  const handleSaveDraft = () => toast.success('Draft saved');
  const handleReviewSubmit = () => toast('Review & submit', { description: 'Coming soon' });
  const handleAdjustTimes = (id: number) => toast(`Adjust times`, { description: `Punch #${id}` });
  const handleDeletePunch = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success('Punch deleted');
  };

  return (
    <div className="min-h-screen px-10 py-8 max-w-[1500px] mx-auto pb-24">
      {/* Header band */}
      <header className="mb-5">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          Time entry
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mt-1 leading-tight">
          {periodLabel}
        </h1>
      </header>

      {/* Period summary card */}
      <Card className="mb-4 px-5 py-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">{fmtHours(breakdown.total)}</span>
          <span className="text-sm text-muted-foreground">logged</span>
        </div>
        {breakdown.ot > 0 && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium tabular-nums">{fmtHours(breakdown.ot)}</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">overtime</span>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium tabular-nums">{fmtMoney(earnings)}</span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">est. pay</span>
        </div>
        {conflictIds.size > 0 && (
          <Badge variant="outline" className="border-foreground/50 text-foreground">
            <AlertTriangle className="size-3" />
            {conflictIds.size} conflict{conflictIds.size === 1 ? '' : 's'} to resolve
          </Badge>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>Save draft</Button>
          <Button onClick={handleReviewSubmit} disabled={conflictIds.size > 0}>
            Review &amp; submit
          </Button>
        </div>
      </Card>

      {/* Filter tabs + Add punch */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as SourceFilter)}>
          <TabsList>
            <TabsTrigger value="all">
              All <span className="ml-1.5 tabular-nums text-muted-foreground">{counts.all}</span>
            </TabsTrigger>
            <TabsTrigger value="auto">
              Auto <span className="ml-1.5 tabular-nums text-muted-foreground">{counts.auto}</span>
            </TabsTrigger>
            <TabsTrigger value="manual">
              Manual <span className="ml-1.5 tabular-nums text-muted-foreground">{counts.manual + counts.edited}</span>
            </TabsTrigger>
            <TabsTrigger value="conflicts">
              Conflicts <span className="ml-1.5 tabular-nums text-muted-foreground">{conflictIds.size}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex-1" />
        <Button onClick={handleAddPunch}>
          <Plus className="size-4" />
          Add punch
        </Button>
      </div>

      {/* Punch list */}
      {dayGroups.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {filter === 'all'
              ? 'No punches in this period yet. Click Add punch to log one.'
              : filter === 'conflicts'
                ? 'No conflicts. Nice.'
                : `No ${filter} punches in this period.`}
          </p>
        </Card>
      ) : (
        <div className="space-y-5">
          {dayGroups.map(([dateKey, dayEntries]) => {
            const dayDate = dayEntries[0].date;
            const dayHours = dayEntries.reduce((s, e) => s + e.hours, 0);
            const dayConflicts = dayEntries.filter((e) => conflictIds.has(e.id)).length;
            const clientTotals = new Map<string, number>();
            for (const e of dayEntries) {
              const job = jobs.find((j) => j.id === e.jobId);
              if (!job) continue;
              clientTotals.set(job.client, (clientTotals.get(job.client) ?? 0) + e.hours);
            }
            return (
              <section key={dateKey}>
                <div className="flex items-baseline gap-3 px-1 mb-2">
                  <span className="text-sm font-semibold">
                    {dayLabel(dayDate)}, {monthName(dayDate).slice(0, 3)} {dayNum(dayDate)}
                  </span>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {fmtHours(dayHours)}
                  </span>
                  {clientTotals.size > 1 && (
                    <span className="text-xs text-muted-foreground">
                      {Array.from(clientTotals.entries())
                        .map(([c, h]) => `${c} ${fmtHours(h)}`)
                        .join(' · ')}
                    </span>
                  )}
                  {dayConflicts > 0 && (
                    <Badge variant="outline" className="border-foreground/50 text-foreground">
                      <AlertTriangle className="size-3" />
                      {dayConflicts} conflict{dayConflicts === 1 ? '' : 's'}
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  {dayEntries.map((e) => {
                    const job = jobs.find((j) => j.id === e.jobId);
                    const isConflict = conflictIds.has(e.id);
                    const src = sourceOf(e);
                    return (
                      <div key={e.id} className="space-y-1.5">
                        <Card
                          className={
                            isConflict
                              ? 'px-4 py-3 border-2 border-foreground/60'
                              : 'px-4 py-3'
                          }
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-20 shrink-0">
                              <SourcePill source={src} />
                            </div>
                            <div className="w-40 shrink-0">
                              <div className="text-sm font-semibold tabular-nums">
                                {formatTimeRange(e)}
                              </div>
                              <div className="text-xs text-muted-foreground tabular-nums">
                                {fmtHours(e.hours)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {job ? `${job.client} · ${job.name}` : 'Unknown job'}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {[e.paycode ?? 'Regular', e.costCenter ?? job?.code, e.note]
                                  .filter(Boolean)
                                  .join(' · ')}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Punch actions"
                              onClick={() => handleDeletePunch(e.id)}
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </div>
                        </Card>
                        {isConflict && (
                          <div className="ml-2 flex flex-wrap items-center gap-3 px-3 py-2 rounded border border-foreground/20 bg-muted/40">
                            <AlertTriangle className="size-3.5" />
                            <span className="text-xs font-medium">
                              Overlaps another punch on {monthName(dayDate).slice(0, 3)} {dayNum(dayDate)}
                            </span>
                            <Separator orientation="vertical" className="h-3" />
                            <button
                              type="button"
                              className="text-xs font-semibold underline underline-offset-2 hover:opacity-70"
                              onClick={() => handleAdjustTimes(e.id)}
                            >
                              Adjust times
                            </button>
                            <button
                              type="button"
                              className="text-xs font-medium hover:opacity-70"
                              onClick={() => toast(`Marked intentional`, { description: `Punch #${e.id}` })}
                            >
                              Mark intentional
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
