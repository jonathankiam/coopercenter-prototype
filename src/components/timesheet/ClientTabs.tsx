'use client';

import { Layers } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import StatusPill from '@/components/StatusPill';
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
    <Tabs value={active} onValueChange={(v) => onChange(v as ClientFilter)} className="mb-3">
      <TabsList variant="line" className="h-auto w-full justify-start gap-2">
        <TabsTrigger value="all" className="gap-2 px-4 py-2">
          <Layers size={13} strokeWidth={2.2} />
          <span>All clients</span>
          <Badge variant="outline" className="ml-1 text-[10px] tabular-nums">
            {totalEntries}
          </Badge>
        </TabsTrigger>
        {groups.map((g) => (
          <TabsTrigger key={g.client} value={g.client} className="gap-2 px-4 py-2">
            <span className="block w-2 h-2 rounded-full bg-foreground" />
            <span>{g.client}</span>
            <Badge variant="outline" className="ml-1 text-[10px] tabular-nums">
              {g.entries.length}
            </Badge>
            {g.entries.length > 0 && <StatusPill status={g.status} />}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
