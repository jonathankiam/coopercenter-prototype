import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TimeEntry, Job } from './types';

// shadcn's class-merging helper. Use everywhere that conditionally composes Tailwind classes.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DAY_MS = 86400000;

export const fmtClock = (s: number): string => {
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${h}:${m}:${sec}`;
};

export const fmtHours = (h: number): string => `${h.toFixed(1)}h`;
export const fmtMoney = (v: number): string =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const dayLabel = (d: Date): string =>
  ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()];
export const dayNum = (d: Date): number => d.getDate();
export const sameDay = (a: Date, b: Date): boolean => a.toDateString() === b.toDateString();
export const monthName = (d: Date): string => d.toLocaleDateString('en-US', { month: 'long' });

export interface Breakdown {
  total: number;
  regular: number;
  ot: number;
  dt: number;
}

export const computeBreakdown = (entries: TimeEntry[]): Breakdown =>
  entries.reduce<Breakdown>(
    (acc, e) => ({
      total: acc.total + e.hours,
      regular: acc.regular + (e.regularH ?? e.hours),
      ot: acc.ot + (e.otH ?? 0),
      dt: acc.dt + (e.dtH ?? 0),
    }),
    { total: 0, regular: 0, ot: 0, dt: 0 },
  );

export const isBackfilledLivePunch = (entry: TimeEntry | undefined, jobs: Job[]): boolean => {
  if (!entry?.manuallyEntered) return false;
  const job = jobs.find((j) => j.id === entry.jobId);
  return job?.kind === 'live';
};

export const startOfWeek = (d: Date): Date => {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
};

export const isSameWeek = (a: Date, b: Date): boolean =>
  startOfWeek(a).toDateString() === startOfWeek(b).toDateString();
