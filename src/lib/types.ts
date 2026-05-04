import type { EntryStatus } from './design';

export type JobKind = 'live' | 'manual';

export interface Job {
  id: number;
  name: string;
  client: string;
  code: string;
  color: string;
  type: string;
  kind: JobKind;
  location: string;
  rate: number;
  paycodes: string[];
  costCenters: string[];
}

export interface TimeEntry {
  id: number;
  jobId: number;
  date: Date;
  start: string; // 'HH:MM'
  end: string;   // 'HH:MM'
  hours: number;
  regularH: number;
  otH: number;
  dtH: number;
  status: EntryStatus;
  note?: string;
  paycode?: string;
  costCenter?: string;
  manuallyEntered?: boolean;
}

export type ExpenseKind = 'regular' | 'mileage';

export interface ExpenseReceipt {
  type: 'placeholder' | 'image';
  label: string;
}

export interface ExpenseItem {
  id: number;
  kind: ExpenseKind;
  jobId: number;
  reportId: string;
  date: Date;
  amount: number;
  note?: string;
  receipt?: ExpenseReceipt;
  // regular only
  category?: string;
  vendor?: string;
  // mileage only
  miles?: number;
  tripFrom?: string;
  tripTo?: string;
}

export interface ExpenseReport {
  id: string;
  client: string;
  weekStart: Date;
  status: EntryStatus;
}
