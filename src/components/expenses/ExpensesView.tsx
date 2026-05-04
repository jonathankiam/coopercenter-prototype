'use client';

import { useMemo, useState } from 'react';
import { C, FONTS } from '@/lib/design';
import {
  buildReportSummaries,
  filterReports,
  isOpenStatus,
  summarize,
  type StatusFilter,
} from '@/lib/expenses';
import ExpensesToolbar from './ExpensesToolbar';
import ExpensesSummaryBar from './ExpensesSummaryBar';
import StatusTabs from './StatusTabs';
import ReportsList from './ReportsList';
import ExpensesSubmitFooter from './ExpensesSubmitFooter';
import Toast from '@/components/Toast';
import type { ExpenseItem, ExpenseReport, Job } from '@/lib/types';
import type { EntryStatus } from '@/lib/design';

interface ExpensesViewProps {
  initialReports: ExpenseReport[];
  initialExpenses: ExpenseItem[];
  jobs: Job[];
}

// Default expand behavior per tab — drafts and submitted feel like active
// work and benefit from being open; paid is historical so collapse it.
const EXPAND_BY_TAB: Record<StatusFilter, Set<string>> = {
  all:       new Set<string>(['draft', 'rejected', 'pending', 'submitted', 'approved']),
  open:      new Set<string>(['draft', 'rejected']),
  submitted: new Set<string>(['pending', 'submitted', 'approved']),
  paid:      new Set<string>(),
};

export default function ExpensesView({
  initialReports,
  initialExpenses,
  jobs,
}: ExpensesViewProps) {
  const [reports, setReports] = useState(initialReports);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [toast, setToast] = useState<string | null>(null);

  const summaries = useMemo(
    () => buildReportSummaries(reports, initialExpenses, jobs),
    [reports, initialExpenses, jobs],
  );
  const totals = useMemo(() => summarize(summaries), [summaries]);
  const filteredSummaries = useMemo(() => filterReports(summaries, filter), [summaries, filter]);

  // Submit a single report by flipping its status from draft/rejected → pending.
  const submitReport = (reportId: string) => {
    const target = reports.find((r) => r.id === reportId);
    if (!target || !isOpenStatus(target.status)) return;
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'pending' as EntryStatus } : r)),
    );
    setToast(`${target.client} report submitted · ${summaries.find((s) => s.report.id === reportId)?.itemCount ?? 0} items`);
  };

  const submitAllOpen = () => {
    const openReports = summaries.filter((s) => isOpenStatus(s.report.status));
    if (openReports.length === 0) return;
    const ids = new Set(openReports.map((s) => s.report.id));
    setReports((prev) =>
      prev.map((r) => (ids.has(r.id) ? { ...r, status: 'pending' as EntryStatus } : r)),
    );
    setToast(`Submitted ${openReports.length} ${openReports.length === 1 ? 'report' : 'reports'}`);
  };

  const handleAddExpense = () => {
    setToast('Add expense — coming soon');
  };
  const handleAddItemToReport = (reportId: string) => {
    const r = summaries.find((s) => s.report.id === reportId);
    setToast(`Add line item to ${r?.report.client ?? 'report'} — coming soon`);
  };
  const handleItemMenu = (item: ExpenseItem) => {
    setToast(`Edit ${item.kind === 'mileage' ? 'mileage' : 'expense'} — coming soon`);
  };
  const handleReceiptClick = (item: ExpenseItem) => {
    setToast(`Preview ${item.receipt?.label ?? 'receipt'} — coming soon`);
  };

  return (
    <div className="min-h-screen px-10 py-8 max-w-[1500px] mx-auto pb-24">
      <header className="mb-5">
        <div
          className="text-[11px] uppercase tracking-[0.25em]"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          Expenses
        </div>
        <h1
          className="text-[32px] mt-1 tracking-tight leading-tight"
          style={{ color: C.ink, fontFamily: FONTS.serif }}
        >
          <span style={{ fontStyle: 'italic' }}>Reports & reimbursements</span>
        </h1>
      </header>

      <ExpensesToolbar onAdd={handleAddExpense} />

      <ExpensesSummaryBar totals={totals} />

      <StatusTabs summaries={summaries} active={filter} onChange={setFilter} />

      <ReportsList
        summaries={filteredSummaries}
        defaultExpandStatuses={EXPAND_BY_TAB[filter]}
        onSubmitReport={submitReport}
        onAddItemToReport={handleAddItemToReport}
        onItemMenu={handleItemMenu}
        onReceiptClick={handleReceiptClick}
      />

      <ExpensesSubmitFooter
        summaries={summaries}
        onSubmit={submitReport}
        onSubmitAll={submitAllOpen}
      />

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
