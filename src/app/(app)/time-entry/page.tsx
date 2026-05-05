import { getEntries, getJobs } from '@/lib/data';
import PunchView from '@/components/time-entry/PunchView';

export default async function TimeEntryPage() {
  const [entries, jobs] = await Promise.all([getEntries(), getJobs()]);
  return (
    <PunchView
      initialEntries={entries}
      jobs={jobs}
      serverNow={new Date().toISOString()}
    />
  );
}
