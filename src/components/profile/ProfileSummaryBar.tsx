import { Zap } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { fmtMoney } from '@/lib/utils';
import type { ProfileStats, NextPayday } from '@/lib/profile';

interface ProfileSummaryBarProps {
  stats: ProfileStats;
  nextPayday: NextPayday;
}

interface MetricProps {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  emphasized?: boolean;
}

function Metric({ label, value, sub, accent = C.ink, emphasized = false }: MetricProps) {
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
      {sub && (
        <span
          className="text-[10px] mt-1"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

function Divider() {
  return <span className="block w-px self-stretch" style={{ backgroundColor: C.borderSoft }} />;
}

export default function ProfileSummaryBar({ stats, nextPayday }: ProfileSummaryBarProps) {
  return (
    <div
      className="flex items-center gap-6 px-5 py-4 rounded-2xl mb-3"
      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
    >
      <Metric
        label="This week"
        value={`${stats.weekHours.toFixed(1)}h`}
        sub={`${stats.weekShifts} ${stats.weekShifts === 1 ? 'shift' : 'shifts'}`}
        emphasized
      />
      <Divider />
      <Metric label="This month" value={`${stats.monthHours.toFixed(1)}h`} />
      <Divider />
      <Metric
        label="YTD hours"
        value={`${stats.ytdHours.toFixed(1)}h`}
      />
      <Metric
        label="YTD gross earnings"
        value={fmtMoney(stats.ytdGrossEarnings)}
        accent={C.moss}
        emphasized
      />
      <Divider />
      <Metric label="Submitted entries" value={String(stats.reportsSubmitted)} />

      <div className="flex-1" />

      <div
        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${C.lime} 0%, ${C.limeDeep} 100%)`,
          color: C.ink,
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: C.ink, color: C.lime }}
        >
          <Zap size={14} strokeWidth={2.5} />
        </div>
        <div>
          <div
            className="text-[9px] uppercase tracking-[0.18em] opacity-70"
            style={{ fontFamily: FONTS.sans }}
          >
            Next payday
          </div>
          <div
            className="text-[14px] mt-0.5 leading-tight"
            style={{ fontFamily: FONTS.serif, fontStyle: 'italic' }}
          >
            {nextPayday.label}
          </div>
        </div>
      </div>
    </div>
  );
}
