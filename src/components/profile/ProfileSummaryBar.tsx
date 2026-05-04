import { Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fmtMoney } from '@/lib/utils';
import { cn } from '@/lib/cn';
import type { ProfileStats, NextPayday } from '@/lib/profile';

interface ProfileSummaryBarProps {
  stats: ProfileStats;
  nextPayday: NextPayday;
}

interface MetricProps {
  label: string;
  value: string;
  sub?: string;
  emphasized?: boolean;
}

function Metric({ label, value, sub, emphasized = false }: MetricProps) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          'tabular-nums leading-none mt-1 font-mono',
          emphasized ? 'text-[22px] font-medium' : 'text-[18px]',
        )}
      >
        {value}
      </span>
      {sub && (
        <span className="text-[10px] mt-1 text-muted-foreground">{sub}</span>
      )}
    </div>
  );
}

export default function ProfileSummaryBar({ stats, nextPayday }: ProfileSummaryBarProps) {
  return (
    <Card className="shadow-none mb-3">
      <CardContent className="flex items-center gap-6 px-5 py-4">
        <Metric
          label="This week"
          value={`${stats.weekHours.toFixed(1)}h`}
          sub={`${stats.weekShifts} ${stats.weekShifts === 1 ? 'shift' : 'shifts'}`}
          emphasized
        />
        <Separator orientation="vertical" className="h-10" />
        <Metric label="This month" value={`${stats.monthHours.toFixed(1)}h`} />
        <Separator orientation="vertical" className="h-10" />
        <Metric label="YTD hours" value={`${stats.ytdHours.toFixed(1)}h`} />
        <Metric
          label="YTD gross earnings"
          value={fmtMoney(stats.ytdGrossEarnings)}
          emphasized
        />
        <Separator orientation="vertical" className="h-10" />
        <Metric label="Submitted entries" value={String(stats.reportsSubmitted)} />

        <div className="flex-1" />

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-md bg-foreground text-background">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-background text-foreground">
            <Zap size={14} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.18em] opacity-70">
              Next payday
            </div>
            <div className="text-sm mt-0.5 leading-tight font-medium">
              {nextPayday.label}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
