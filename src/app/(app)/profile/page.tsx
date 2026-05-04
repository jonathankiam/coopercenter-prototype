import { getCurrentUser, getJobs, getEntries } from '@/lib/data';
import { EXPENSE_CATEGORIES } from '@/lib/mock-data';
import ProfileView from '@/components/profile/ProfileView';

export default async function ProfilePage() {
  const [user, jobs, entries] = await Promise.all([
    getCurrentUser(),
    getJobs(),
    getEntries(),
  ]);
  return (
    <ProfileView
      user={user}
      jobs={jobs}
      entries={entries}
      expenseCategories={EXPENSE_CATEGORIES}
      serverNow={new Date().toISOString()}
    />
  );
}
