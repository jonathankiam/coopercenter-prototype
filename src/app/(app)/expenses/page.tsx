import { getExpenses, getJobs, getReports } from '@/lib/data';
import ExpensesView from '@/components/expenses/ExpensesView';

export default async function ExpensesPage() {
  const [reports, expenses, jobs] = await Promise.all([
    getReports(),
    getExpenses(),
    getJobs(),
  ]);
  return (
    <ExpensesView
      initialReports={reports}
      initialExpenses={expenses}
      jobs={jobs}
    />
  );
}
