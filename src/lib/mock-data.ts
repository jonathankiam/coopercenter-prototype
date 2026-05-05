import type { Job, TimeEntry, ExpenseItem, ExpenseReport } from './types';
import { DAY_MS } from './utils';

// Job-accent colors. Used as small dots/bars to visually distinguish clients in lists.
// Tailwind-aligned hex values so they coexist with shadcn's neutral theme.
const JOB_COLORS = {
  red:    '#dc2626', // tailwind red-600
  emerald:'#059669', // tailwind emerald-600
  amber:  '#f59e0b', // tailwind amber-500
  sky:    '#0284c7', // tailwind sky-600
} as const;

// Fixed reference date keeps mock data stable across server/client renders
// (avoids hydration mismatches that occur when "today" changes mid-render).
const todayDate = new Date();

// Resolve a date by week offset from "this week" and day-of-week (0 = Sun).
const dayOf = (weekOffset: number, dayOfWeek: number): Date => {
  const d = new Date(todayDate);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay() + dayOfWeek + weekOffset * 7);
  return d;
};

export const MILEAGE_RATE = 0.67;

export const EXPENSE_CATEGORIES = [
  'Meals',
  'Lodging',
  'Parking',
  'Tolls',
  'Supplies',
  'Equipment',
  'Phone / Internet',
  'Training',
  'Other',
] as const;

export const JOBS: Job[] = [
  { id: 1, name: 'Goose Manufacturing', client: 'Goose Manufacturing', code: 'GSE-2104', color: JOB_COLORS.red, type: 'Hourly + OT', kind: 'live', location: '847 Industrial Pkwy', rate: 26.5,
    paycodes: ['Regular', 'Overtime', 'Double Time', 'Holiday'],
    costCenters: ['Production - Line A', 'Production - Line B', 'Maintenance', 'QA / Inspection'] },
  { id: 2, name: 'Plant Academy · Greenhouse Lead', client: 'Plant Academy', code: 'PA-GHL', color: JOB_COLORS.emerald, type: 'Manual Punch', kind: 'manual', location: 'Greenhouse Pavilion', rate: 38.0,
    paycodes: ['Regular', 'Overtime', 'Holiday'],
    costCenters: ['Adult Programs', 'Youth Programs', 'Corporate Workshops'] },
  { id: 3, name: 'Plant Academy · Field Workshop', client: 'Plant Academy', code: 'PA-FW', color: JOB_COLORS.amber, type: 'Manual Punch', kind: 'manual', location: 'Outdoor Field Sites', rate: 26.0,
    paycodes: ['Regular', 'Overtime', 'Travel'],
    costCenters: ['Adult Programs', 'Youth Programs', 'Off-site'] },
  { id: 4, name: 'Plant Academy · Lab Prep', client: 'Plant Academy', code: 'PA-LP', color: JOB_COLORS.sky, type: 'Manual Punch', kind: 'manual', location: 'Curriculum Lab, Bldg C', rate: 22.0,
    paycodes: ['Regular', 'Overtime'],
    costCenters: ['Curriculum Dev', 'Materials Prep', 'Inventory'] },
];

export const ENTRIES: TimeEntry[] = [
  { id: 1, jobId: 1, date: new Date(todayDate.getTime() - 4 * DAY_MS), start: '07:02', end: '15:30', hours: 8.5, regularH: 8.0, otH: 0.5, dtH: 0, status: 'approved', note: '' },

  { id: 2, jobId: 2, date: new Date(todayDate.getTime() - 3 * DAY_MS), start: '09:00', end: '13:00', hours: 4.0, regularH: 4.0, otH: 0, dtH: 0, status: 'approved', note: 'Morning workshop session', paycode: 'Regular', costCenter: 'Adult Programs' },
  { id: 3, jobId: 4, date: new Date(todayDate.getTime() - 3 * DAY_MS), start: '14:00', end: '17:00', hours: 3.0, regularH: 3.0, otH: 0, dtH: 0, status: 'approved', note: 'Curriculum prep for next week', paycode: 'Regular', costCenter: 'Curriculum Dev' },

  { id: 4, jobId: 1, date: new Date(todayDate.getTime() - 2 * DAY_MS), start: '06:00', end: '11:00', hours: 5.0, regularH: 5.0, otH: 0, dtH: 0, status: 'draft', note: 'Morning shift' },
  { id: 5, jobId: 1, date: new Date(todayDate.getTime() - 2 * DAY_MS), start: '11:30', end: '19:30', hours: 8.0, regularH: 3.0, otH: 4.0, dtH: 1.0, status: 'draft', note: 'Stayed for emergency line repair — no relief crew available' },

  { id: 6, jobId: 3, date: new Date(todayDate.getTime() - 1 * DAY_MS), start: '08:00', end: '16:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'draft', note: 'Outdoor youth workshop · weather cooperated', paycode: 'Regular', costCenter: 'Youth Programs' },

  { id: 7, jobId: 1, date: todayDate, start: '06:30', end: '10:30', hours: 4.0, regularH: 4.0, otH: 0, dtH: 0, status: 'draft', note: 'Morning shift' },
  { id: 8, jobId: 2, date: todayDate, start: '11:30', end: '13:30', hours: 2.0, regularH: 2.0, otH: 0, dtH: 0, status: 'draft', note: 'Adult workshop · short session', paycode: 'Regular', costCenter: 'Adult Programs' },
  { id: 9, jobId: 4, date: todayDate, start: '14:00', end: '16:00', hours: 2.0, regularH: 2.0, otH: 0, dtH: 0, status: 'draft', note: '', paycode: 'Regular', costCenter: 'Curriculum Dev' },

  { id: 100, jobId: 1, date: dayOf(-2, 1), start: '07:00', end: '15:30', hours: 8.5, regularH: 8.0, otH: 0.5, dtH: 0, status: 'paid', note: '' },
  { id: 101, jobId: 2, date: dayOf(-2, 2), start: '09:00', end: '13:00', hours: 4.0, regularH: 4.0, otH: 0, dtH: 0, status: 'paid', note: 'Adult workshop morning', paycode: 'Regular', costCenter: 'Adult Programs' },
  { id: 102, jobId: 4, date: dayOf(-2, 2), start: '14:00', end: '17:00', hours: 3.0, regularH: 3.0, otH: 0, dtH: 0, status: 'paid', note: '', paycode: 'Regular', costCenter: 'Curriculum Dev' },
  { id: 103, jobId: 1, date: dayOf(-2, 3), start: '07:00', end: '15:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'paid', note: '' },
  { id: 104, jobId: 3, date: dayOf(-2, 4), start: '08:00', end: '16:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'paid', note: 'Field workshop · adult intensive', paycode: 'Regular', costCenter: 'Adult Programs' },
  { id: 105, jobId: 1, date: dayOf(-2, 5), start: '07:00', end: '15:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'paid', note: '' },

  { id: 110, jobId: 1, date: dayOf(-1, 1), start: '07:00', end: '15:30', hours: 8.5, regularH: 8.0, otH: 0.5, dtH: 0, status: 'pending', note: '' },
  { id: 111, jobId: 2, date: dayOf(-1, 2), start: '09:00', end: '13:00', hours: 4.0, regularH: 4.0, otH: 0, dtH: 0, status: 'pending', note: 'Adult workshop', paycode: 'Regular', costCenter: 'Adult Programs' },
  { id: 112, jobId: 1, date: dayOf(-1, 3), start: '06:00', end: '15:30', hours: 9.5, regularH: 8.0, otH: 1.5, dtH: 0, status: 'pending', note: 'Early start · OT for line changeover' },
  { id: 113, jobId: 3, date: dayOf(-1, 4), start: '08:00', end: '16:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'pending', note: 'Youth workshop', paycode: 'Regular', costCenter: 'Youth Programs' },
  { id: 114, jobId: 1, date: dayOf(-1, 5), start: '07:00', end: '15:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'pending', manuallyEntered: true, note: 'Forgot to clock in · backfilled at end of day' },

  { id: 120, jobId: 1, date: dayOf(1, 1), start: '07:00', end: '15:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'draft', note: 'Pre-scheduled shift' },
  { id: 121, jobId: 2, date: dayOf(1, 2), start: '09:00', end: '13:00', hours: 4.0, regularH: 4.0, otH: 0, dtH: 0, status: 'draft', note: 'Workshop on the books', paycode: 'Regular', costCenter: 'Adult Programs' },
];

export const EXPENSES: ExpenseItem[] = [
  { id: 1, kind: 'regular', jobId: 1, reportId: 'rpt-apr12-goose',
    date: dayOf(-2, 1), amount: 42.5, category: 'Meals', vendor: 'Sunrise Diner',
    receipt: { type: 'placeholder', label: 'IMG_4421.jpg' }, note: '' },
  { id: 2, kind: 'mileage', jobId: 1, reportId: 'rpt-apr12-goose',
    date: dayOf(-2, 2), miles: 38, tripFrom: 'Office', tripTo: 'Goose plant', amount: 38 * MILEAGE_RATE,
    receipt: { type: 'placeholder', label: 'odometer_apr12.jpg' }, note: 'Site visit + return' },
  { id: 3, kind: 'regular', jobId: 3, reportId: 'rpt-apr12-pa',
    date: dayOf(-2, 3), amount: 87.2, category: 'Supplies', vendor: 'Garden Supply Co.',
    receipt: { type: 'placeholder', label: 'IMG_4438.jpg' }, note: 'Field workshop materials' },

  { id: 4, kind: 'regular', jobId: 1, reportId: 'rpt-apr19-goose',
    date: dayOf(-1, 2), amount: 18.0, category: 'Parking', vendor: 'LAZ Lot 14',
    receipt: { type: 'placeholder', label: 'IMG_4452.jpg' }, note: '' },
  { id: 5, kind: 'mileage', jobId: 2, reportId: 'rpt-apr19-pa',
    date: dayOf(-1, 4), miles: 22, tripFrom: 'Curriculum Lab', tripTo: 'Outdoor field site', amount: 22 * MILEAGE_RATE,
    receipt: { type: 'placeholder', label: 'odometer_apr24.jpg' }, note: 'Drove to field site for youth workshop' },

  { id: 6, kind: 'regular', jobId: 2, reportId: 'rpt-apr27-pa',
    date: todayDate, amount: 12.5, category: 'Meals', vendor: 'Roasters Co.',
    receipt: { type: 'placeholder', label: 'IMG_4461.jpg' }, note: 'Crew coffee run' },
  { id: 7, kind: 'mileage', jobId: 1, reportId: 'rpt-apr27-goose',
    date: new Date(todayDate.getTime() - 2 * DAY_MS), miles: 14, tripFrom: 'Home', tripTo: 'Goose plant',
    amount: 14 * MILEAGE_RATE,
    receipt: { type: 'placeholder', label: 'odometer_apr28.jpg' }, note: '' },
];

export const REPORTS: ExpenseReport[] = [
  { id: 'rpt-apr12-goose',  client: 'Goose Manufacturing', weekStart: dayOf(-2, 0), status: 'paid' },
  { id: 'rpt-apr12-pa',     client: 'Plant Academy',       weekStart: dayOf(-2, 0), status: 'paid' },
  { id: 'rpt-apr19-goose',  client: 'Goose Manufacturing', weekStart: dayOf(-1, 0), status: 'pending' },
  { id: 'rpt-apr19-pa',     client: 'Plant Academy',       weekStart: dayOf(-1, 0), status: 'pending' },
  { id: 'rpt-apr27-goose',  client: 'Goose Manufacturing', weekStart: dayOf(0, 0), status: 'draft' },
  { id: 'rpt-apr27-pa',     client: 'Plant Academy',       weekStart: dayOf(0, 0), status: 'draft' },
];

export const CURRENT_USER = {
  name: 'Jerry',
  fullName: 'Jerry Castellanos',
  initials: 'JC',
  role: 'Field Worker',
  employeeId: '70814',
  region: 'Pacific Northwest',
  joinedDate: new Date('2022-08-15'),
  email: 'jerry.castellanos@example.com',
  phone: '(503) 555-0182',
  address: {
    line1: '1234 Pine Street, Apt 3B',
    city: 'Portland',
    state: 'OR',
    zip: '97204',
  },
  emergencyContact: {
    name: 'Maria Castellanos',
    relation: 'Spouse',
    phone: '(503) 555-0124',
  },
  payInfo: {
    schedule: 'Weekly · Friday',
    paymentMethod: 'Direct deposit',
    bankName: 'First Republic',
    accountLast4: '4421',
    estimatedNet: 812.4, // est. for next payday
  },
  notifications: {
    timecardReminders: true,
    payNotifications: true,
    expenseApprovals: true,
    scheduleChanges: true,
    weeklyDigest: false,
  },
  preferences: {
    timeFormat: '24h' as '12h' | '24h',
    weekStartDay: 'Sunday' as 'Sunday' | 'Monday',
    defaultExpenseCategory: 'Meals',
    measurementUnits: 'imperial' as 'imperial' | 'metric',
  },
} as const;

export type CurrentUser = typeof CURRENT_USER;
