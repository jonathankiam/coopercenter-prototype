import { getEntries, getJobs } from '@/lib/data';
import TimesheetView from '@/components/timesheet/TimesheetView';

export default async function TimesheetPage() {
  const [entries, jobs] = await Promise.all([getEntries(), getJobs()]);
  // Pass server time as ISO so the client view has a stable "today" reference
  // and we don't get hydration mismatches on the week-timing pill.
  return (
    <TimesheetView
      initialEntries={entries}
      jobs={jobs}
      serverNow={new Date().toISOString()}
    />
  );
}
