import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fmtMoney, cn } from '@/lib/utils';
import type { ExpenseTotals } from '@/lib/expenses';

interface ExpensesSummaryBarProps {
  totals: ExpenseTotals;
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

export default function ExpensesSummaryBar({ totals }: ExpensesSummaryBarProps) {
  return (
    <Card className="flex flex-row items-center gap-6 px-5 py-4 mb-3">
      <Metric
        label="In flight · awaiting reimbursement"
        value={fmtMoney(totals.inFlight)}
        accentClass={totals.inFlight > 0 ? '' : 'text-muted-foreground'}
        emphasized
      />
      <Separator orientation="vertical" className="h-10" />
      <Metric
        label="Open reports"
        value={String(totals.openReportCount)}
        accentClass={totals.openReportCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}
      />
      <Metric label="Total reports" value={String(totals.reportCount)} />
      <Separator orientation="vertical" className="h-10" />
      <Metric label="Items" value={String(totals.itemCount)} />
      <Metric label="Mileage · YTD" value={`${totals.totalMiles.toFixed(0)} mi`} />
      <Separator orientation="vertical" className="h-10" />
      <Metric
        label="Paid · YTD"
        value={fmtMoney(totals.paidYtd)}
        accentClass="text-emerald-600 dark:text-emerald-400"
        emphasized
      />

      <div className="flex-1" />

      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/70 font-medium">
        <TrendingUp className="size-3" />
        IRS rate · $0.67/mi
      </span>
    </Card>
  );
}
