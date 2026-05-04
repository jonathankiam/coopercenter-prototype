'use client';

import { Layers, FileText, Send, Check } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
}

const TABS: TabConfig[] = [
  { key: 'all',       label: 'All reports', icon: Layers },
  { key: 'open',      label: 'Open drafts', icon: FileText },
  { key: 'submitted', label: 'Submitted',   icon: Send },
  { key: 'paid',      label: 'Paid',        icon: Check },
];

export default function StatusTabs({ summaries, active, onChange }: StatusTabsProps) {
  return (
    <Tabs
      value={active}
      onValueChange={(v) => onChange(v as StatusFilter)}
      className="mb-3"
    >
      <TabsList variant="line" className="h-auto w-full justify-start gap-2">
        {TABS.map((t) => {
          const filtered = filterReports(summaries, t.key);
          const total = filtered.reduce((s, r) => s + r.total, 0);
          const Icon = t.icon;
          return (
            <TabsTrigger key={t.key} value={t.key} className="gap-2 px-4 py-2">
              <Icon size={13} strokeWidth={2.2} />
              <span>{t.label}</span>
              <Badge variant="outline" className="ml-1 text-[10px] tabular-nums">
                {filtered.length}
              </Badge>
              <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
                {fmtMoney(total)}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
