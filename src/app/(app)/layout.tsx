import Sidebar from '@/components/Sidebar';
import { getCurrentUser } from '@/lib/data';
import { C } from '@/lib/design';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: C.bone }}>
      <Sidebar user={user} />
      <main className="flex-1 ml-[240px]">{children}</main>
    </div>
  );
}
