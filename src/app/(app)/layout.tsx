import Sidebar from '@/components/Sidebar';
import { getCurrentUser } from '@/lib/data';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar user={user} />
      <main className="flex-1 ml-60">{children}</main>
    </div>
  );
}
