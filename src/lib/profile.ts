import type { TimeEntry, Job } from './types';
import { isSameWeek, sameDay } from './utils';

export interface ProfileStats {
  weekHours: number;
  weekShifts: number;
  monthHours: number;
  ytdHours: number;
  ytdGrossEarnings: number;
  reportsSubmitted: number; // entries that have moved past 'draft'
}

const sameMonth = (a: Date, b: Date): boolean =>
  a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const sameYear = (a: Date, b: Date): boolean => a.getFullYear() === b.getFullYear();

// Multipliers applied to base rate when computing gross.
const PAY_MULTIPLIER = { regular: 1, ot: 1.5, dt: 2 } as const;

export function computeProfileStats(
  entries: TimeEntry[],
  jobs: Job[],
  today: Date,
): ProfileStats {
  const jobById = new Map(jobs.map((j) => [j.id, j]));

  let weekHours = 0;
  let weekShifts = 0;
  let monthHours = 0;
  let ytdHours = 0;
  let ytdGrossEarnings = 0;
  let reportsSubmitted = 0;

  for (const e of entries) {
    if (sameYear(e.date, today)) {
      ytdHours += e.hours;
      const job = jobById.get(e.jobId);
      const rate = job?.rate ?? 0;
      ytdGrossEarnings +=
        (e.regularH ?? e.hours) * rate * PAY_MULTIPLIER.regular +
        (e.otH ?? 0) * rate * PAY_MULTIPLIER.ot +
        (e.dtH ?? 0) * rate * PAY_MULTIPLIER.dt;
    }
    if (sameMonth(e.date, today)) {
      monthHours += e.hours;
    }
    if (isSameWeek(e.date, today)) {
      weekHours += e.hours;
      weekShifts += 1;
    }
    if (e.status !== 'draft') {
      reportsSubmitted += 1;
    }
  }

  return {
    weekHours,
    weekShifts,
    monthHours,
    ytdHours,
    ytdGrossEarnings,
    reportsSubmitted,
  };
}

export interface NextPayday {
  date: Date;
  daysFromNow: number;
  label: string; // "Friday, in 3 days" or "Today"
}

// Weekly Friday paydays. Returns the next upcoming Friday from today (or today
// if today is a Friday). Real implementation would consult the pay calendar.
export function nextPayday(today: Date): NextPayday {
  const FRIDAY = 5;
  const d = new Date(today);
  d.setHours(0, 0, 0, 0);
  const today0 = new Date(d);
  const dow = d.getDay();
  const daysUntilFriday = (FRIDAY - dow + 7) % 7;
  d.setDate(d.getDate() + daysUntilFriday);

  const days = Math.round((d.getTime() - today0.getTime()) / 86400000);
  let label: string;
  if (days === 0) label = 'Today';
  else if (days === 1) label = 'Tomorrow';
  else label = `${d.toLocaleDateString('en-US', { weekday: 'long' })}, in ${days} days`;

  return { date: d, daysFromNow: days, label };
}

export function tenureLabel(joined: Date, today: Date): string {
  const months =
    (today.getFullYear() - joined.getFullYear()) * 12 +
    (today.getMonth() - joined.getMonth()) -
    (today.getDate() < joined.getDate() ? 1 : 0);
  const years = Math.floor(months / 12);
  if (years >= 1) return `${years} ${years === 1 ? 'year' : 'years'}`;
  return `${months} ${months === 1 ? 'month' : 'months'}`;
}

// suppress "sameDay imported but unused" — kept for parity with other lib helpers
void sameDay;
