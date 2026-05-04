import type { LucideIcon } from 'lucide-react';
import { Clock, CalendarDays, AlertCircle, TrendingUp } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
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
  accent?: string;
}

function Stat({ label, value, sub, icon: Icon, accent = C.ink }: StatProps) {
  return (
    <div
      className="rounded-2xl p-5 flex-1 min-w-0"
      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          {label}
        </span>
        <Icon size={14} style={{ color: C.muted }} />
      </div>
      <div
        className="text-[28px] tabular-nums leading-none"
        style={{ color: accent, fontFamily: FONTS.serif, fontWeight: 400 }}
      >
        {value}
      </div>
      <div
        className="text-[11px] mt-2"
        style={{ color: C.muted, fontFamily: FONTS.sans }}
      >
        {sub}
      </div>
    </div>
  );
}

export default function StatsBar({ todayEntries, weekEntries }: StatsBarProps) {
  const todayHours = todayEntries.reduce((s, e) => s + e.hours, 0);
  const weekHours = weekEntries.reduce((s, e) => s + e.hours, 0);
  const pendingCount = weekEntries.filter((e) => e.status === 'pending').length;
  const draftCount = weekEntries.filter((e) => e.status === 'draft').length;

  // Earnings = sum of hours × job rate
  const earnings = weekEntries.reduce((sum, e) => {
    // We'd ideally look up the job here; for the stats bar we approximate via
    // a flat rate. Replace with real per-job math when wiring real data.
    return sum + e.hours * 28; // weighted-average placeholder
  }, 0);

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
        accent={draftCount + pendingCount > 0 ? C.clay : C.ink}
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
