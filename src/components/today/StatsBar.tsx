import type { LucideIcon } from 'lucide-react';
import { Clock, CalendarDays, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fmtMoney } from '@/lib/utils';
import type { TimeEntry, Job } from '@/lib/types';

interface StatsBarProps {
  todayEntries: TimeEntry[];
  weekEntries: TimeEntry[];
  jobs: Job[];
}

interface StatProps {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
}

function Stat({ label, value, sub, icon: Icon }: StatProps) {
  return (
    <Card className="flex-1 min-w-0 gap-0 py-5 shadow-none">
      <CardContent className="px-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </span>
          <Icon size={14} className="text-muted-foreground" />
        </div>
        <div className="text-3xl font-semibold tabular-nums leading-none">
          {value}
        </div>
        <div className="text-[11px] mt-2 text-muted-foreground">
          {sub}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatsBar({ todayEntries, weekEntries }: StatsBarProps) {
  const todayHours = todayEntries.reduce((s, e) => s + e.hours, 0);
  const weekHours = weekEntries.reduce((s, e) => s + e.hours, 0);
  const pendingCount = weekEntries.filter((e) => e.status === 'pending').length;
  const draftCount = weekEntries.filter((e) => e.status === 'draft').length;

  // Earnings = sum of hours × flat placeholder rate (replace with per-job math later)
  const earnings = weekEntries.reduce((sum, e) => sum + e.hours * 28, 0);

  return (
    <div className="flex gap-3">
      <Stat
        label="Today"
        value={`${todayHours.toFixed(1)}h`}
        sub={todayEntries.length ? `${todayEntries.length} shifts` : 'No shifts yet'}
        icon={Clock}
      />
      <Stat
        label="This week"
        value={`${weekHours.toFixed(1)}h`}
        sub={`${weekEntries.length} entries`}
        icon={CalendarDays}
      />
      <Stat
        label="Awaiting action"
        value={`${draftCount + pendingCount}`}
        sub={`${draftCount} draft · ${pendingCount} pending`}
        icon={AlertCircle}
      />
      <Stat
        label="Est. earnings"
        value={fmtMoney(earnings)}
        sub="This pay period"
        icon={TrendingUp}
      />
    </div>
  );
}
