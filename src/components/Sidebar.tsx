'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, CalendarDays, Receipt, User, Smartphone } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV: NavItem[] = [
  { href: '/today',     label: 'Today',     icon: Clock },
  { href: '/timesheet', label: 'Timesheet', icon: CalendarDays },
  { href: '/expenses',  label: 'Expenses',  icon: Receipt },
  { href: '/profile',   label: 'Profile',   icon: User },
];

interface SidebarProps {
  user: { name: string; fullName: string; initials: string; role: string };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 flex flex-col border-r bg-card">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          TCW Internal
        </div>
        <div className="text-lg font-semibold mt-1 leading-tight">
          Timekeeping
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === '/today' && pathname === '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-3 space-y-3">
        <Link
          href="/prototype"
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Smartphone className="size-3.5" />
          View mobile prototype
        </Link>

        <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/40">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{user.fullName}</div>
            <div className="text-xs text-muted-foreground truncate">{user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
