import { getJobs, getEntriesForDate, getEntriesForWeek, getCurrentUser } from '@/lib/data';
import StatsBar from '@/components/today/StatsBar';
import ActiveAssignmentCard from '@/components/today/ActiveAssignmentCard';
import EntriesList from '@/components/today/EntriesList';

export default async function TodayPage() {
  const today = new Date();
  const [jobs, todayEntries, weekEntries, user] = await Promise.all([
    getJobs(),
    getEntriesForDate(today),
    getEntriesForWeek(today),
    getCurrentUser(),
  ]);

  const greeting = (() => {
    const h = today.getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const dateLabel = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen px-10 py-8 max-w-[1400px] mx-auto">
      <header className="mb-7">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          {dateLabel}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">
          {greeting}, {user.name}
        </h1>
      </header>

      <div className="mb-6">
        <StatsBar todayEntries={todayEntries} weekEntries={weekEntries} jobs={jobs} />
      </div>

      <div className="grid grid-cols-3 gap-5 min-h-[580px]">
        <div className="col-span-2">
          <ActiveAssignmentCard jobs={jobs} initialJobId={jobs[0]?.id} />
        </div>
        <div className="col-span-1">
          <EntriesList entries={todayEntries} jobs={jobs} />
        </div>
      </div>
    </div>
  );
}
