'use client';

import { Bell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

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
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-muted-foreground" />
          <CardTitle>Notifications</CardTitle>
        </div>
        <CardDescription>
          {enabledCount} of {ROWS.length} enabled · sent via email and push.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {ROWS.map((r, idx) => (
          <div key={r.key}>
            {idx > 0 && <Separator />}
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-3.5">
              <div>
                <div className="text-[13px] font-medium">{r.label}</div>
                <div className="text-[11px] mt-0.5 text-muted-foreground">
                  {r.description}
                </div>
              </div>
              <Switch
                checked={prefs[r.key]}
                onCheckedChange={(v) => onChange(r.key, v)}
                aria-label={r.label}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
