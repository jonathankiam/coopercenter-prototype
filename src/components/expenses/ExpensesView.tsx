'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
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
import type { ExpenseItem, ExpenseReport, Job } from '@/lib/types';
import type { EntryStatus } from '@/lib/design';

interface ExpensesViewProps {
  initialReports: ExpenseReport[];
  initialExpenses: ExpenseItem[];
  jobs: Job[];
}

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

  const summaries = useMemo(
    () => buildReportSummaries(reports, initialExpenses, jobs),
    [reports, initialExpenses, jobs],
  );
  const totals = useMemo(() => summarize(summaries), [summaries]);
  const filteredSummaries = useMemo(() => filterReports(summaries, filter), [summaries, filter]);

  const submitReport = (reportId: string) => {
    const target = reports.find((r) => r.id === reportId);
    if (!target || !isOpenStatus(target.status)) return;
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'pending' as EntryStatus } : r)),
    );
    const itemCount = summaries.find((s) => s.report.id === reportId)?.itemCount ?? 0;
    toast.success(`${target.client} report submitted`, {
      description: `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`,
    });
  };

  const submitAllOpen = () => {
    const openReports = summaries.filter((s) => isOpenStatus(s.report.status));
    if (openReports.length === 0) return;
    const ids = new Set(openReports.map((s) => s.report.id));
    setReports((prev) =>
      prev.map((r) => (ids.has(r.id) ? { ...r, status: 'pending' as EntryStatus } : r)),
    );
    toast.success(
      `Submitted ${openReports.length} ${openReports.length === 1 ? 'report' : 'reports'}`,
    );
  };

  const handleAddExpense = () => {
    toast('Add expense', { description: 'Coming soon' });
  };
  const handleAddItemToReport = (reportId: string) => {
    const r = summaries.find((s) => s.report.id === reportId);
    toast(`Add line item to ${r?.report.client ?? 'report'}`, { description: 'Coming soon' });
  };
  const handleItemMenu = (item: ExpenseItem) => {
    toast(`Edit ${item.kind === 'mileage' ? 'mileage' : 'expense'}`, {
      description: 'Coming soon',
    });
  };
  const handleReceiptClick = (item: ExpenseItem) => {
    toast(`Preview ${item.receipt?.label ?? 'receipt'}`, { description: 'Coming soon' });
  };

  return (
    <div className="min-h-screen px-10 py-8 max-w-[1500px] mx-auto pb-24">
      <header className="mb-5">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          Expenses
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mt-1 leading-tight">
          Reports & reimbursements
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
    </div>
  );
}
