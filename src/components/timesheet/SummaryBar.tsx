import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fmtMoney, cn } from '@/lib/utils';
import type { Breakdown } from '@/lib/utils';

interface SummaryBarProps {
  breakdown: Breakdown;
  earnings: number;
  entryCount: number;
}

interface MetricProps {
  label: string;
  value: string;
  accentClass?: string;
  emphasized?: boolean;
}

function Metric({ label, value, accentClass, emphasized = false }: MetricProps) {
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
    </div>
  );
}

export default function SummaryBar({ breakdown, earnings, entryCount }: SummaryBarProps) {
  return (
    <Card className="flex flex-row items-center gap-6 px-5 py-4 mb-3">
      <Metric label="Total" value={`${breakdown.total.toFixed(1)}h`} emphasized />
      <Separator orientation="vertical" className="h-10" />
      <Metric label="Regular" value={`${breakdown.regular.toFixed(1)}h`} />
      <Metric
        label="Overtime · 1.5×"
        value={`${breakdown.ot.toFixed(1)}h`}
        accentClass={breakdown.ot > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}
      />
      <Metric
        label="Double · 2×"
        value={`${breakdown.dt.toFixed(1)}h`}
        accentClass={breakdown.dt > 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}
      />
      <Separator orientation="vertical" className="h-10" />
      <Metric label="Estimated earnings" value={fmtMoney(earnings)} emphasized />
      <Separator orientation="vertical" className="h-10" />
      <Metric label="Entries" value={String(entryCount)} />

      <div className="flex-1" />

      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-medium">
        Daily threshold &gt;8h → OT · &gt;12h → DT
      </span>
    </Card>
  );
}
