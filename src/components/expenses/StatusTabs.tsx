'use client';

import { Layers, FileText, Send, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fmtMoney, cn } from '@/lib/utils';
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
  accentClass: string;
}

const TABS: TabConfig[] = [
  { key: 'all',       label: 'All reports', icon: Layers,   accentClass: 'bg-foreground' },
  { key: 'open',      label: 'Open drafts', icon: FileText, accentClass: 'bg-primary' },
  { key: 'submitted', label: 'Submitted',   icon: Send,     accentClass: 'bg-amber-500' },
  { key: 'paid',      label: 'Paid',        icon: Check,    accentClass: 'bg-emerald-500' },
];

export default function StatusTabs({ summaries, active, onChange }: StatusTabsProps) {
  return (
    <Card className="flex flex-row items-stretch gap-px overflow-hidden mb-3 p-0 bg-border">
      {TABS.map((t) => {
        const filtered = filterReports(summaries, t.key);
        const total = filtered.reduce((s, r) => s + r.total, 0);
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={cn(
              'flex-1 px-5 py-3 text-left transition-colors relative',
              isActive
                ? 'bg-card text-foreground'
                : 'bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground',
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium flex items-center gap-2">
                <t.icon className="size-3.5" />
                {t.label}
                <Badge variant={isActive ? 'secondary' : 'outline'} className="tabular-nums text-[11px] ml-1">
                  {filtered.length}
                </Badge>
              </span>
              <span className="text-xs tabular-nums text-muted-foreground font-mono">
                {fmtMoney(total)}
              </span>
            </div>
            {isActive && (
              <span className={cn('absolute left-0 right-0 bottom-0 h-[2px]', t.accentClass)} />
            )}
          </button>
        );
      })}
    </Card>
  );
}
