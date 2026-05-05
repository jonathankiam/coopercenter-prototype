import type { LucideIcon } from 'lucide-react';
import { Clock, CalendarDays, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fmtMoney } from '@/lib/utils';
import { cn } from '@/lib/utils';
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
  accentClass?: string;
}

function Stat({ label, value, sub, icon: Icon, accentClass }: StatProps) {
  return (
    <Card className="flex-1 min-w-0">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            {label}
          </span>
          <Icon className="size-3.5 text-muted-foreground" />
        </div>
        <div className={cn('text-3xl font-semibold tabular-nums leading-none tracking-tight', accentClass)}>
          {value}
        </div>
        <div className="text-xs mt-2 text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
}

export default function StatsBar({ todayEntries, weekEntries }: StatsBarProps) {
  const todayHours = todayEntries.reduce((s, e) => s + e.hours, 0);
  const weekHours = weekEntries.reduce((s, e) => s + e.hours, 0);
  const pendingCount = weekEntries.filter((e) => e.status === 'pending').length;
  const draftCount = weekEntries.filter((e) => e.status === 'draft').length;

  // Earnings: hours × flat rate placeholder. Replace with real per-job math when wiring real data.
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
        accentClass={draftCount + pendingCount > 0 ? 'text-amber-600 dark:text-amber-400' : undefined}
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
