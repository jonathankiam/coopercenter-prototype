// Async data API. Currently reads from in-memory mock data, but every function
// returns a Promise so swapping in fetch/database calls is a one-file change.
//
// Usage from server components:
//   const jobs = await getJobs();
//   const todayEntries = await getEntriesForDate(new Date());

import { JOBS, ENTRIES, EXPENSES, REPORTS, CURRENT_USER } from './mock-data';
import type { Job, TimeEntry, ExpenseItem, ExpenseReport } from './types';
import { sameDay, isSameWeek } from './utils';

export async function getCurrentUser() {
  return CURRENT_USER;
}

export async function getJobs(): Promise<Job[]> {
  return JOBS;
}

export async function getJob(id: number): Promise<Job | undefined> {
  return JOBS.find((j) => j.id === id);
}

export async function getEntries(): Promise<TimeEntry[]> {
  return ENTRIES;
}

export async function getEntriesForDate(date: Date): Promise<TimeEntry[]> {
  return ENTRIES.filter((e) => sameDay(e.date, date));
}

export async function getEntriesForWeek(date: Date): Promise<TimeEntry[]> {
  return ENTRIES.filter((e) => isSameWeek(e.date, date));
}

export async function getExpenses(): Promise<ExpenseItem[]> {
  return EXPENSES;
}

export async function getReports(): Promise<ExpenseReport[]> {
  return REPORTS;
}
