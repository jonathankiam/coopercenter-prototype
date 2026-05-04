'use client';

import { Layers, FileText, Send, Check } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { fmtMoney } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReportSummary, StatusFilter } from '@/lib/expenses';
import { filterReports } from '@/lib/expenses';

interface StatusTabsProps {
  summaries: ReportSummary[];
  active: StatusFilter;
  onChange: (filter: StatusFilter) => void;
}

interface TabConfig {
  key: StatusFilter;
  label: string;
  icon: LucideIcon;
  accent: string;
}

const TABS: TabConfig[] = [
  { key: 'all',       label: 'All reports', icon: Layers,   accent: C.ink },
  { key: 'open',      label: 'Open drafts', icon: FileText, accent: C.lime },
  { key: 'submitted', label: 'Submitted',   icon: Send,     accent: C.amber },
  { key: 'paid',      label: 'Paid',        icon: Check,    accent: C.moss },
];

export default function StatusTabs({ summaries, active, onChange }: StatusTabsProps) {
  return (
    <div
      className="flex items-stretch gap-px rounded-2xl overflow-hidden mb-3"
      style={{ backgroundColor: C.borderSoft, border: `1px solid ${C.border}` }}
    >
      {TABS.map((t) => {
        const filtered = filterReports(summaries, t.key);
        const total = filtered.reduce((s, r) => s + r.total, 0);
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className="flex-1 px-5 py-3 text-left transition-colors relative"
            style={{
              backgroundColor: isActive ? C.cream : C.paper,
              color: isActive ? C.ink : C.inkSoft,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className="text-[13px] font-medium flex items-center gap-2"
                style={{ fontFamily: FONTS.sans }}
              >
                <t.icon size={13} strokeWidth={2.2} />
                {t.label}
                <span
                  className="text-[11px] tabular-nums px-1.5 py-0.5 rounded ml-1"
                  style={{
                    backgroundColor: isActive ? C.bone : 'transparent',
                    color: isActive ? C.inkSoft : C.muted,
                    fontFamily: FONTS.sans,
                    border: isActive ? 'none' : `1px solid ${C.borderSoft}`,
                  }}
                >
                  {filtered.length}
                </span>
              </span>
              <span
                className="text-[12px] tabular-nums"
                style={{ color: C.muted, fontFamily: FONTS.mono }}
              >
                {fmtMoney(total)}
              </span>
            </div>
            {isActive && (
              <span
                className="absolute left-0 right-0 bottom-0 h-[2px]"
                style={{ backgroundColor: t.accent }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
