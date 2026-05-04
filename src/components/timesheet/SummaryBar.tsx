import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fmtMoney } from '@/lib/utils';
import { cn } from '@/lib/cn';
import type { Breakdown } from '@/lib/utils';

interface SummaryBarProps {
  breakdown: Breakdown;
  earnings: number;
  entryCount: number;
}

interface MetricProps {
  label: string;
  value: string;
  emphasized?: boolean;
  muted?: boolean;
}

function Metric({ label, value, emphasized = false, muted = false }: MetricProps) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          'font-mono tabular-nums leading-none mt-1',
          emphasized ? 'text-[22px] font-medium' : 'text-[18px]',
          muted ? 'text-muted-foreground' : 'text-foreground',
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function SummaryBar({ breakdown, earnings, entryCount }: SummaryBarProps) {
  return (
    <Card className="flex-row items-center gap-6 px-5 py-4 mb-3 shadow-none">
      <Metric label="Total" value={`${breakdown.total.toFixed(1)}h`} emphasized />
      <Separator orientation="vertical" className="h-10" />
      <Metric label="Regular" value={`${breakdown.regular.toFixed(1)}h`} />
      <Metric
        label="Overtime · 1.5×"
        value={`${breakdown.ot.toFixed(1)}h`}
        muted={breakdown.ot === 0}
      />
      <Metric
        label="Double · 2×"
        value={`${breakdown.dt.toFixed(1)}h`}
        muted={breakdown.dt === 0}
      />
      <Separator orientation="vertical" className="h-10" />
      <Metric label="Estimated earnings" value={fmtMoney(earnings)} emphasized />
      <Separator orientation="vertical" className="h-10" />
      <Metric label="Entries" value={String(entryCount)} />

      <div className="flex-1" />

      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Daily threshold &gt;8h → OT · &gt;12h → DT
      </span>
    </Card>
  );
}
