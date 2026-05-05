'use client';

import { Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusPill from '@/components/StatusPill';
import { cn } from '@/lib/utils';
import type { ClientGroup } from '@/lib/timesheet';

export type ClientFilter = 'all' | string;

interface ClientTabsProps {
  groups: ClientGroup[];
  active: ClientFilter;
  onChange: (filter: ClientFilter) => void;
}

export default function ClientTabs({ groups, active, onChange }: ClientTabsProps) {
  const totalEntries = groups.reduce((s, g) => s + g.entries.length, 0);

  return (
    <Card className="flex flex-row items-stretch gap-px overflow-hidden mb-3 p-0 bg-border">
      <TabButton
        active={active === 'all'}
        onClick={() => onChange('all')}
        accentColor="hsl(var(--primary))"
        title={
          <span className="flex items-center gap-2">
            <Layers className="size-3.5" />
            <span>All clients</span>
          </span>
        }
        count={totalEntries}
      />
      {groups.map((g) => {
        const accent = g.jobs[0]?.color ?? 'hsl(var(--muted-foreground))';
        return (
          <TabButton
            key={g.client}
            active={active === g.client}
            onClick={() => onChange(g.client)}
            accentColor={accent}
            title={
              <span className="flex items-center gap-2">
                <span
                  className="block size-2 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <span>{g.client}</span>
              </span>
            }
            count={g.entries.length}
            status={g.entries.length > 0 ? g.status : undefined}
          />
        );
      })}
    </Card>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  title: React.ReactNode;
  count: number;
  accentColor: string;
  status?: ClientGroup['status'];
}

function TabButton({ active, onClick, title, count, accentColor, status }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 px-5 py-3 text-left transition-colors relative',
        active ? 'bg-card text-foreground' : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{title}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant={active ? 'secondary' : 'outline'} className="tabular-nums text-[11px]">
            {count}
          </Badge>
          {status && <StatusPill status={status} />}
        </div>
      </div>
      {active && (
        <span
          className="absolute left-0 right-0 bottom-0 h-[2px]"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </button>
  );
}
