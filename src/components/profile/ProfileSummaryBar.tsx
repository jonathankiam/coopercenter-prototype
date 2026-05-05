import { Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fmtMoney, cn } from '@/lib/utils';
import type { ProfileStats, NextPayday } from '@/lib/profile';

interface ProfileSummaryBarProps {
  stats: ProfileStats;
  nextPayday: NextPayday;
}

interface MetricProps {
  label: string;
  value: string;
  sub?: string;
  accentClass?: string;
  emphasized?: boolean;
}

function Metric({ label, value, sub, accentClass, emphasized = false }: MetricProps) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
        {label}
      </span>
      <span
        className={cn(
          'tabular-nums leading-none mt-1 font-mono tracking-tight',
          emphasized ? 'text-2xl font-semibold' : 'text-lg',
          accentClass,
        )}
      >
        {value}
      </span>
      {sub && <span className="text-[10px] mt-1 text-muted-foreground">{sub}</span>}
    </div>
  );
}

export default function ProfileSummaryBar({ stats, nextPayday }: ProfileSummaryBarProps) {
  return (
    <Card className="flex flex-row items-center gap-6 px-5 py-4 mb-3">
      <Metric
        label="This week"
        value={`${stats.weekHours.toFixed(1)}h`}
        sub={`${stats.weekShifts} ${stats.weekShifts === 1 ? 'shift' : 'shifts'}`}
        emphasized
      />
      <Separator orientation="vertical" className="h-12" />
      <Metric label="This month" value={`${stats.monthHours.toFixed(1)}h`} />
      <Separator orientation="vertical" className="h-12" />
      <Metric label="YTD hours" value={`${stats.ytdHours.toFixed(1)}h`} />
      <Metric
        label="YTD gross earnings"
        value={fmtMoney(stats.ytdGrossEarnings)}
        accentClass="text-emerald-600 dark:text-emerald-400"
        emphasized
      />
      <Separator orientation="vertical" className="h-12" />
      <Metric label="Submitted entries" value={String(stats.reportsSubmitted)} />

      <div className="flex-1" />

      <div className="flex items-center gap-3 px-4 py-2.5 rounded-md bg-primary text-primary-foreground">
        <div className="size-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-foreground text-primary">
          <Zap className="size-3.5" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-widest opacity-70 font-medium">
            Next payday
          </div>
          <div className="text-sm mt-0.5 leading-tight font-medium">{nextPayday.label}</div>
        </div>
      </div>
    </Card>
  );
}
