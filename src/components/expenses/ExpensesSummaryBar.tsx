import { TrendingUp } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { fmtMoney } from '@/lib/utils';
import type { ExpenseTotals } from '@/lib/expenses';

interface ExpensesSummaryBarProps {
  totals: ExpenseTotals;
}

interface MetricProps {
  label: string;
  value: string;
  accent?: string;
  emphasized?: boolean;
}

function Metric({ label, value, accent = C.ink, emphasized = false }: MetricProps) {
  return (
    <div className="flex flex-col">
      <span
        className="text-[9px] uppercase tracking-[0.18em]"
        style={{ color: C.muted, fontFamily: FONTS.sans }}
      >
        {label}
      </span>
      <span
        className="tabular-nums leading-none mt-1"
        style={{
          color: accent,
          fontFamily: FONTS.mono,
          fontWeight: emphasized ? 500 : 400,
          fontSize: emphasized ? 22 : 18,
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <span className="block w-px self-stretch" style={{ backgroundColor: C.borderSoft }} />;
}

export default function ExpensesSummaryBar({ totals }: ExpensesSummaryBarProps) {
  return (
    <div
      className="flex items-center gap-6 px-5 py-4 rounded-2xl mb-3"
      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
    >
      <Metric
        label="In flight · awaiting reimbursement"
        value={fmtMoney(totals.inFlight)}
        accent={totals.inFlight > 0 ? C.ink : C.muted}
        emphasized
      />
      <Divider />
      <Metric label="Open reports" value={String(totals.openReportCount)} accent={totals.openReportCount > 0 ? C.clay : C.muted} />
      <Metric label="Total reports" value={String(totals.reportCount)} />
      <Divider />
      <Metric label="Items" value={String(totals.itemCount)} />
      <Metric label="Mileage · YTD" value={`${totals.totalMiles.toFixed(0)} mi`} />
      <Divider />
      <Metric label="Paid · YTD" value={fmtMoney(totals.paidYtd)} accent={C.moss} emphasized />

      <div className="flex-1" />

      <span
        className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em]"
        style={{ color: C.mutedSoft, fontFamily: FONTS.sans }}
      >
        <TrendingUp size={11} strokeWidth={2.4} />
        IRS rate · $0.67/mi
      </span>
    </div>
  );
}
