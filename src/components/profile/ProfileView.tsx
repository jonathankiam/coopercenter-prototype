'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  computeProfileStats,
  nextPayday as computeNextPayday,
  tenureLabel,
} from '@/lib/profile';
import ProfileToolbar from './ProfileToolbar';
import ProfileHero from './ProfileHero';
import ProfileSummaryBar from './ProfileSummaryBar';
import PersonalInfoCard from './PersonalInfoCard';
import AssignmentsCard from './AssignmentsCard';
import PayInfoCard from './PayInfoCard';
import NotificationsCard, { type NotificationKey, type NotificationPrefs } from './NotificationsCard';
import PreferencesCard, { type PrefKey, type UserPrefs } from './PreferencesCard';
import SecurityCard from './SecurityCard';
import type { CurrentUser } from '@/lib/mock-data';
import type { Job, TimeEntry } from '@/lib/types';

interface ProfileViewProps {
  user: CurrentUser;
  jobs: Job[];
  entries: TimeEntry[];
  expenseCategories: readonly string[];
  serverNow: string;
}

export default function ProfileView({
  user,
  jobs,
  entries,
  expenseCategories,
  serverNow,
}: ProfileViewProps) {
  const today = useMemo(() => new Date(serverNow), [serverNow]);
  const [notifications, setNotifications] = useState<NotificationPrefs>({ ...user.notifications });
  const [prefs, setPrefs] = useState<UserPrefs>({ ...user.preferences });

  const stats = useMemo(() => computeProfileStats(entries, jobs, today), [entries, jobs, today]);
  const payday = useMemo(() => computeNextPayday(today), [today]);
  const tenure = useMemo(() => tenureLabel(user.joinedDate, today), [user.joinedDate, today]);

  const handleToggleNotification = (key: NotificationKey, next: boolean) => {
    setNotifications((p) => ({ ...p, [key]: next }));
    toast.success(`${next ? 'Enabled' : 'Disabled'}`, {
      description: labelForNotification(key),
    });
  };

  const handlePrefChange = <K extends PrefKey>(key: K, value: UserPrefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    toast.success(`Updated ${labelForPref(key)}`, { description: String(value) });
  };

  return (
    <div className="min-h-screen px-10 py-8 max-w-[1400px] mx-auto pb-16">
      <header className="mb-5">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          Profile
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mt-1 leading-tight">
          Account & preferences
        </h1>
      </header>

      <ProfileToolbar
        tenure={tenure}
        onEdit={() => toast('Edit profile', { description: 'Coming soon' })}
        onExport={() => toast('Account data export', { description: 'Coming soon' })}
      />

      <ProfileHero user={user} activeAssignmentCount={jobs.length} />

      <ProfileSummaryBar stats={stats} nextPayday={payday} />

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex flex-col gap-4">
          <PersonalInfoCard
            user={user}
            onEditField={(f) => toast(`Edit ${f}`, { description: 'Coming soon' })}
          />
          <PayInfoCard
            user={user}
            nextPayday={payday}
            onViewStubs={() => toast('Pay stubs & W-2', { description: 'Coming soon' })}
            onChangeBank={() => toast('Change deposit account', { description: 'Coming soon' })}
          />
          <SecurityCard
            onChangePassword={() => toast('Change password', { description: 'Coming soon' })}
            onToggle2FA={() => toast('Manage 2FA', { description: 'Coming soon' })}
            onSignOut={() => toast.success('Signed out', { description: 'Demo only — refresh to restore' })}
          />
        </div>
        <div className="flex flex-col gap-4">
          <AssignmentsCard jobs={jobs} />
          <NotificationsCard prefs={notifications} onChange={handleToggleNotification} />
          <PreferencesCard
            prefs={prefs}
            expenseCategories={expenseCategories}
            onChange={handlePrefChange}
          />
        </div>
      </div>
    </div>
  );
}

function labelForNotification(key: NotificationKey): string {
  switch (key) {
    case 'timecardReminders':  return 'Timecard reminders';
    case 'payNotifications':   return 'Pay deposit alerts';
    case 'expenseApprovals':   return 'Expense status updates';
    case 'scheduleChanges':    return 'Schedule change alerts';
    case 'weeklyDigest':       return 'Weekly digest email';
  }
}

function labelForPref(key: PrefKey): string {
  switch (key) {
    case 'timeFormat':              return 'time format';
    case 'weekStartDay':            return 'week start day';
    case 'measurementUnits':        return 'measurement units';
    case 'defaultExpenseCategory':  return 'default expense category';
  }
}
