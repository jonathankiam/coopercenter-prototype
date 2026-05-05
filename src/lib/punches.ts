/**
 * Punch helpers for the redesigned Time entry screen.
 *
 * The Time entry screen treats individual TimeEntry records as "punches"
 * (clock-in / clock-out events) rather than aggregated daily hours.
 * Two helpers live here:
 *   - sourceOf(): derive an EntrySource pill from an existing TimeEntry,
 *                 falling back to `manuallyEntered` when `source` is absent.
 *   - findOverlapIds(): set of TimeEntry ids whose time windows collide
 *                       with another punch on the same date (any client).
 */

import type { TimeEntry, EntrySource } from './types';
import { sameDay } from './utils';

export const sourceOf = (e: TimeEntry): EntrySource =>
  e.source ?? (e.manuallyEntered ? 'manual' : 'auto');

const SOURCE_LABEL: Record<EntrySource, string> = {
  auto: 'Auto',
  manual: 'Manual',
  edited: 'Edited',
};
export const sourceLabel = (s: EntrySource): string => SOURCE_LABEL[s];

const minutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Inclusive-exclusive overlap: [a.start, a.end) ∩ [b.start, b.end) ≠ ∅ */
const ranges_overlap = (a: TimeEntry, b: TimeEntry): boolean => {
  const aStart = minutes(a.start);
  const aEnd = minutes(a.end);
  const bStart = minutes(b.start);
  const bEnd = minutes(b.end);
  return aStart < bEnd && bStart < aEnd;
};

/**
 * IDs of punches that overlap *some* other punch on the same date.
 * Cross-client overlaps are still conflicts — a worker can't be in two
 * places at once even if the punches are tagged to different jobs.
 */
export const findOverlapIds = (entries: TimeEntry[]): Set<number> => {
  const conflicts = new Set<number>();
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];
      if (!sameDay(a.date, b.date)) continue;
      if (ranges_overlap(a, b)) {
        conflicts.add(a.id);
        conflicts.add(b.id);
      }
    }
  }
  return conflicts;
};

/** Group entries by ISO date string, preserving insertion order of dates. */
export const groupByDay = (entries: TimeEntry[]): Map<string, TimeEntry[]> => {
  const sorted = [...entries].sort((a, b) => {
    const d = a.date.getTime() - b.date.getTime();
    if (d !== 0) return d;
    return minutes(a.start) - minutes(b.start);
  });
  const map = new Map<string, TimeEntry[]>();
  for (const e of sorted) {
    const key = e.date.toISOString().slice(0, 10);
    const list = map.get(key) ?? [];
    list.push(e);
    map.set(key, list);
  }
  return map;
};

const formatHHMMto12h = (hhmm: string): string => {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const mm = m.toString().padStart(2, '0');
  return `${display}:${mm} ${period}`;
};

/** "7:00 AM – 11:30 AM" */
export const formatTimeRange = (e: TimeEntry): string =>
  `${formatHHMMto12h(e.start)} – ${formatHHMMto12h(e.end)}`;
