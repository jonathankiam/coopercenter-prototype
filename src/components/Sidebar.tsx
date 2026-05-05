'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, CalendarDays, ListChecks, Receipt, User, Smartphone } from 'lucide-react';
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

const NAV: NavItem[] = [
  { href: '/today',      label: 'Today',      icon: Clock },
  { href: '/time-entry', label: 'Time entry', icon: ListChecks },
  { href: '/timesheet',  label: 'Timesheet',  icon: CalendarDays },
  { href: '/expenses',   label: 'Expenses',   icon: Receipt },
  { href: '/profile',    label: 'Profile',    icon: User },
];

interface SidebarProps {
  user: { name: string; fullName: string; initials: string; role: string };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <UISidebar collapsible="none" className="border-r">
      <SidebarHeader className="px-6 pt-6 pb-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          TCW Internal
        </div>
        <div className="text-xl font-semibold leading-tight mt-0.5">
          Timekeeping
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ href, label, icon: Icon }) => {
                const active =
                  pathname === href || (href === '/today' && pathname === '/');
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={href}>
                        <Icon size={16} strokeWidth={2} />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm" className="text-muted-foreground">
              <Link href="/prototype">
                <Smartphone size={13} strokeWidth={2} />
                <span>View mobile prototype</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="flex items-center gap-3 px-3 py-3 rounded-md border border-border bg-muted/40">
          <Avatar className="size-9 rounded-full">
            <AvatarFallback className="rounded-full bg-foreground text-background text-xs font-semibold">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="text-[13px] font-medium truncate">
              {user.fullName}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              {user.role}
            </div>
          </div>
        </div>
      </SidebarFooter>
    </UISidebar>
  );
}
