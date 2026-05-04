'use client';

import { useMemo, useState } from 'react';
import { C, FONTS } from '@/lib/design';
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
import Toast from '@/components/Toast';
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
  const [toast, setToast] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationPrefs>({ ...user.notifications });
  const [prefs, setPrefs] = useState<UserPrefs>({ ...user.preferences });

  const stats = useMemo(() => computeProfileStats(entries, jobs, today), [entries, jobs, today]);
  const payday = useMemo(() => computeNextPayday(today), [today]);
  const tenure = useMemo(() => tenureLabel(user.joinedDate, today), [user.joinedDate, today]);

  const handleToggleNotification = (key: NotificationKey, next: boolean) => {
    setNotifications((p) => ({ ...p, [key]: next }));
    setToast(`${next ? 'Enabled' : 'Disabled'} · ${labelForNotification(key)}`);
  };

  const handlePrefChange = <K extends PrefKey>(key: K, value: UserPrefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    setToast(`Updated ${labelForPref(key)} · ${String(value)}`);
  };

  return (
    <div className="min-h-screen px-10 py-8 max-w-[1400px] mx-auto pb-16">
      <header className="mb-5">
        <div
          className="text-[11px] uppercase tracking-[0.25em]"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          Profile
        </div>
        <h1
          className="text-[32px] mt-1 tracking-tight leading-tight"
          style={{ color: C.ink, fontFamily: FONTS.serif }}
        >
          <span style={{ fontStyle: 'italic' }}>Account & preferences</span>
        </h1>
      </header>

      <ProfileToolbar
        tenure={tenure}
        onEdit={() => setToast('Edit profile — coming soon')}
        onExport={() => setToast('Account data export — coming soon')}
      />

      <ProfileHero user={user} activeAssignmentCount={jobs.length} />

      <ProfileSummaryBar stats={stats} nextPayday={payday} />

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex flex-col gap-4">
          <PersonalInfoCard
            user={user}
            onEditField={(f) => setToast(`Edit ${f} — coming soon`)}
          />
          <PayInfoCard
            user={user}
            nextPayday={payday}
            onViewStubs={() => setToast('Pay stubs & W-2 — coming soon')}
            onChangeBank={() => setToast('Change deposit account — coming soon')}
          />
          <SecurityCard
            onChangePassword={() => setToast('Change password — coming soon')}
            onToggle2FA={() => setToast('Manage 2FA — coming soon')}
            onSignOut={() => setToast('Signed out (demo only — refresh to restore)')}
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

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
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
