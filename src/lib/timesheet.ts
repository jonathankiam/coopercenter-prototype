import type { TimeEntry, Job } from './types';
import type { EntryStatus } from './design';
import { sameDay } from './utils';

export interface WeekDay {
  date: Date;
  entries: TimeEntry[];
}

export const buildWeekDays = (weekStart: Date, allEntries: TimeEntry[]): WeekDay[] =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return { date: d, entries: allEntries.filter((e) => sameDay(e.date, d)) };
  });

// Sunday-anchored week start for a given reference date.
export const weekStartFor = (date: Date, weekOffset = 0): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay() + weekOffset * 7);
  return d;
};

export interface ClientGroup {
  client: string;
  jobs: Job[];
  entries: TimeEntry[];
  totalHours: number;
  regularHours: number;
  otHours: number;
  dtHours: number;
  earnings: number;
  status: EntryStatus;
}

// Group week entries by client (one card per client). Each client's status
// follows the worst-case-progression: drafts → pending → approved → paid.
export const groupWeekByClient = (entries: TimeEntry[], jobs: Job[]): ClientGroup[] => {
  const byClient = new Map<string, TimeEntry[]>();
  for (const e of entries) {
    const job = jobs.find((j) => j.id === e.jobId);
    if (!job) continue;
    const list = byClient.get(job.client) ?? [];
    list.push(e);
    byClient.set(job.client, list);
  }

  return [...byClient.entries()].map(([client, clientEntries]) => {
    const clientJobs = jobs.filter((j) => j.client === client);
    const totalHours = clientEntries.reduce((s, e) => s + e.hours, 0);
    const regularHours = clientEntries.reduce((s, e) => s + (e.regularH ?? e.hours), 0);
    const otHours = clientEntries.reduce((s, e) => s + (e.otH ?? 0), 0);
    const dtHours = clientEntries.reduce((s, e) => s + (e.dtH ?? 0), 0);

    const earnings = clientEntries.reduce((sum, e) => {
      const job = clientJobs.find((j) => j.id === e.jobId);
      const rate = job?.rate ?? 0;
      const reg = e.regularH ?? e.hours;
      const ot = e.otH ?? 0;
      const dt = e.dtH ?? 0;
      return sum + reg * rate + ot * rate * 1.5 + dt * rate * 2;
    }, 0);

    // Worst-status (least-progressed) wins so the user always sees the riskiest piece first.
    const order: EntryStatus[] = ['draft', 'rejected', 'pending', 'submitted', 'approved', 'paid'];
    const statuses = new Set(clientEntries.map((e) => e.status));
    const status = order.find((s) => statuses.has(s)) ?? 'draft';

    return { client, jobs: clientJobs, entries: clientEntries, totalHours, regularHours, otHours, dtHours, earnings, status };
  }).sort((a, b) => a.client.localeCompare(b.client));
};

export const weekHasEntries = (entries: TimeEntry[]): boolean => entries.length > 0;

export type WeekTimingState = 'past' | 'current' | 'future';

export const weekTimingState = (weekStart: Date, today: Date): WeekTimingState => {
  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  const now = new Date(today);
  now.setHours(12, 0, 0, 0);
  if (now < start) return 'future';
  if (now > end) return 'past';
  return 'current';
};
