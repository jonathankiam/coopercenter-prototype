import Sidebar from '@/components/Sidebar';
import { getCurrentUser } from '@/lib/data';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar user={user} />
      <SidebarInset>
        <main className="flex-1">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
