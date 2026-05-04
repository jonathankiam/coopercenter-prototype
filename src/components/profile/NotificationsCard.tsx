'use client';

import { Bell } from 'lucide-react';
import SettingsCard from './SettingsCard';
import Toggle from '@/components/Toggle';
import { C, FONTS } from '@/lib/design';

export type NotificationKey =
  | 'timecardReminders'
  | 'payNotifications'
  | 'expenseApprovals'
  | 'scheduleChanges'
  | 'weeklyDigest';

export interface NotificationPrefs {
  timecardReminders: boolean;
  payNotifications: boolean;
  expenseApprovals: boolean;
  scheduleChanges: boolean;
  weeklyDigest: boolean;
}

interface NotificationsCardProps {
  prefs: NotificationPrefs;
  onChange: (key: NotificationKey, next: boolean) => void;
}

const ROWS: Array<{ key: NotificationKey; label: string; description: string }> = [
  { key: 'timecardReminders', label: 'Timecard reminders',     description: 'Remind me to submit my weekly timecard before Friday cutoff.' },
  { key: 'payNotifications',  label: 'Pay deposits',           description: 'Notify me when a pay deposit clears my account.' },
  { key: 'expenseApprovals',  label: 'Expense status updates', description: 'Tell me when an expense report is approved, rejected, or paid.' },
  { key: 'scheduleChanges',   label: 'Schedule changes',       description: 'Alert me when an upcoming shift is added, modified, or cancelled.' },
  { key: 'weeklyDigest',      label: 'Weekly digest email',    description: 'Send a summary of last week’s hours, expenses, and earnings each Monday.' },
];

export default function NotificationsCard({ prefs, onChange }: NotificationsCardProps) {
  const enabledCount = Object.values(prefs).filter(Boolean).length;

  return (
    <SettingsCard
      icon={Bell}
      title="Notifications"
      description={`${enabledCount} of ${ROWS.length} enabled · sent via email and push.`}
    >
      {ROWS.map((r) => (
        <div
          key={r.key}
          className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5"
          style={{ borderBottom: `1px solid ${C.borderSoft}` }}
        >
          <div>
            <div
              className="text-[13px] font-medium"
              style={{ color: C.ink, fontFamily: FONTS.sans }}
            >
              {r.label}
            </div>
            <div
              className="text-[11px] mt-0.5"
              style={{ color: C.muted, fontFamily: FONTS.sans }}
            >
              {r.description}
            </div>
          </div>
          <Toggle
            checked={prefs[r.key]}
            onChange={(v) => onChange(r.key, v)}
            label={r.label}
          />
        </div>
      ))}
    </SettingsCard>
  );
}
