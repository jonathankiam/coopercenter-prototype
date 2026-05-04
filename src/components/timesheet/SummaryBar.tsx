import { C, FONTS } from '@/lib/design';
import { fmtMoney } from '@/lib/utils';
import type { Breakdown } from '@/lib/utils';

interface SummaryBarProps {
  breakdown: Breakdown;
  earnings: number;
  entryCount: number;
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

export default function SummaryBar({ breakdown, earnings, entryCount }: SummaryBarProps) {
  return (
    <div
      className="flex items-center gap-6 px-5 py-4 rounded-2xl mb-3"
      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
    >
      <Metric label="Total" value={`${breakdown.total.toFixed(1)}h`} emphasized />
      <Divider />
      <Metric label="Regular" value={`${breakdown.regular.toFixed(1)}h`} />
      <Metric
        label="Overtime · 1.5×"
        value={`${breakdown.ot.toFixed(1)}h`}
        accent={breakdown.ot > 0 ? C.amber : C.muted}
      />
      <Metric
        label="Double · 2×"
        value={`${breakdown.dt.toFixed(1)}h`}
        accent={breakdown.dt > 0 ? C.clay : C.muted}
      />
      <Divider />
      <Metric label="Estimated earnings" value={fmtMoney(earnings)} emphasized />
      <Divider />
      <Metric label="Entries" value={String(entryCount)} />

      <div className="flex-1" />

      <span
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: C.mutedSoft, fontFamily: FONTS.sans }}
      >
        Daily threshold &gt;8h → OT · &gt;12h → DT
      </span>
    </div>
  );
}
