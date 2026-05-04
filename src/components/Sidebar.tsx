'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, CalendarDays, Receipt, User, Smartphone } from 'lucide-react';
import { C, FONTS } from '@/lib/design';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
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
    <aside
      className="fixed left-0 top-0 bottom-0 w-[240px] flex flex-col"
      style={{
        backgroundColor: C.cream,
        borderRight: `1px solid ${C.border}`,
      }}
    >
      <div className="px-6 pt-7 pb-6">
        <div
          className="text-[10px] uppercase tracking-[0.25em]"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          TCW Internal
        </div>
        <div
          className="text-[22px] mt-0.5 leading-tight"
          style={{ color: C.ink, fontFamily: FONTS.serif, fontStyle: 'italic' }}
        >
          Timekeeping
        </div>
      </div>

      <nav className="flex-1 px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === '/today' && pathname === '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl transition-colors"
              style={{
                backgroundColor: active ? C.ink : 'transparent',
                color: active ? C.cream : C.inkSoft,
                fontFamily: FONTS.sans,
                fontSize: 14,
                fontWeight: active ? 600 : 500,
              }}
            >
              <Icon size={17} strokeWidth={active ? 2.4 : 2} />
              <span>{label}</span>
              {active && (
                <span
                  className="ml-auto block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: C.lime }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <Link
          href="/prototype"
          className="flex items-center gap-2.5 px-3 py-2 mb-2 rounded-lg transition-colors"
          style={{
            color: C.muted,
            fontFamily: FONTS.sans,
            fontSize: 12,
          }}
        >
          <Smartphone size={13} strokeWidth={2} />
          <span>View mobile prototype</span>
        </Link>

        <div
          className="flex items-center gap-3 px-3 py-3 rounded-xl"
          style={{
            backgroundColor: C.bone,
            border: `1px solid ${C.borderSoft}`,
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: C.ink,
              color: C.cream,
              fontFamily: FONTS.sans,
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {user.initials}
          </div>
          <div className="min-w-0">
            <div
              className="text-[13px] font-medium truncate"
              style={{ color: C.ink, fontFamily: FONTS.sans }}
            >
              {user.fullName}
            </div>
            <div
              className="text-[11px] truncate"
              style={{ color: C.muted, fontFamily: FONTS.sans }}
            >
              {user.role}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
