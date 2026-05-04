import type { ExpenseItem, ExpenseReport, Job } from './types';
import type { EntryStatus } from './design';

export interface ReportSummary {
  report: ExpenseReport;
  job?: Job;
  items: ExpenseItem[];
  total: number;
  mileage: number;
  itemCount: number;
}

// Bucket items into their parent reports and pre-compute per-report aggregates.
// Newest week first so the most actionable reports surface at the top.
export function buildReportSummaries(
  reports: ExpenseReport[],
  expenses: ExpenseItem[],
  jobs: Job[],
): ReportSummary[] {
  return reports
    .map((report) => {
      const items = expenses.filter((e) => e.reportId === report.id);
      const total = items.reduce((s, e) => s + e.amount, 0);
      const mileage = items
        .filter((e) => e.kind === 'mileage')
        .reduce((s, e) => s + (e.miles ?? 0), 0);
      const job = jobs.find((j) => j.client === report.client);
      return { report, job, items, total, mileage, itemCount: items.length };
    })
    .sort((a, b) => b.report.weekStart.getTime() - a.report.weekStart.getTime());
}

export type StatusFilter = 'all' | 'open' | 'submitted' | 'paid';

export const FILTER_LABELS: Record<StatusFilter, string> = {
  all: 'All reports',
  open: 'Open drafts',
  submitted: 'Submitted',
  paid: 'Paid',
};

const FILTER_TO_STATUSES: Record<StatusFilter, EntryStatus[]> = {
  all: ['draft', 'pending', 'approved', 'submitted', 'rejected', 'paid'],
  open: ['draft', 'rejected'],
  submitted: ['pending', 'approved', 'submitted'],
  paid: ['paid'],
};

export function filterReports(
  summaries: ReportSummary[],
  filter: StatusFilter,
): ReportSummary[] {
  const allowed = new Set(FILTER_TO_STATUSES[filter]);
  return summaries.filter((s) => allowed.has(s.report.status));
}

export function isOpenStatus(status: EntryStatus): boolean {
  return status === 'draft' || status === 'rejected';
}

export interface ExpenseTotals {
  inFlight: number;        // drafts + submitted (everything not yet paid)
  paidYtd: number;
  totalMiles: number;
  itemCount: number;
  reportCount: number;
  openReportCount: number; // reports awaiting submission
}

export function summarize(summaries: ReportSummary[]): ExpenseTotals {
  let inFlight = 0;
  let paidYtd = 0;
  let totalMiles = 0;
  let itemCount = 0;
  let openReportCount = 0;

  for (const s of summaries) {
    itemCount += s.itemCount;
    totalMiles += s.mileage;
    if (s.report.status === 'paid') {
      paidYtd += s.total;
    } else {
      inFlight += s.total;
    }
    if (isOpenStatus(s.report.status)) {
      openReportCount += 1;
    }
  }

  return {
    inFlight,
    paidYtd,
    totalMiles,
    itemCount,
    reportCount: summaries.length,
    openReportCount,
  };
}
