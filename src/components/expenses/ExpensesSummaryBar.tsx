import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fmtMoney } from '@/lib/utils';
import { cn } from '@/lib/cn';
import type { ExpenseTotals } from '@/lib/expenses';

interface ExpensesSummaryBarProps {
  totals: ExpenseTotals;
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

export default function ExpensesSummaryBar({ totals }: ExpensesSummaryBarProps) {
  return (
    <Card className="flex-row items-center gap-6 px-5 py-4 mb-3 shadow-none">
      <Metric
        label="In flight · awaiting reimbursement"
        value={fmtMoney(totals.inFlight)}
        emphasized
        muted={totals.inFlight === 0}
      />
      <Separator orientation="vertical" className="h-10" />
      <Metric
        label="Open reports"
        value={String(totals.openReportCount)}
        muted={totals.openReportCount === 0}
      />
      <Metric label="Total reports" value={String(totals.reportCount)} />
      <Separator orientation="vertical" className="h-10" />
      <Metric label="Items" value={String(totals.itemCount)} />
      <Metric label="Mileage · YTD" value={`${totals.totalMiles.toFixed(0)} mi`} />
      <Separator orientation="vertical" className="h-10" />
      <Metric label="Paid · YTD" value={fmtMoney(totals.paidYtd)} emphasized />

      <div className="flex-1" />

      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <TrendingUp size={11} strokeWidth={2.4} />
        IRS rate · $0.67/mi
      </span>
    </Card>
  );
}
