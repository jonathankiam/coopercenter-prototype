'use client';

import { Plus, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ExpensesToolbarProps {
  onAdd: () => void;
}

export default function ExpensesToolbar({ onAdd }: ExpensesToolbarProps) {
  return (
    <Card className="flex-row items-center justify-between gap-4 px-5 py-3 mb-3 shadow-none">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Reports & line items
        </span>
        <Badge
          variant="secondary"
          className="text-[10px] uppercase tracking-[0.1em]"
        >
          Reimbursable
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" title="Filter (coming soon)">
          <Filter size={13} strokeWidth={2.2} />
          Filter
        </Button>
        <Button variant="outline" size="sm" title="Export reports">
          <Download size={13} strokeWidth={2.2} />
          Export
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button onClick={onAdd} size="sm">
          <Plus size={13} strokeWidth={2.5} />
          Add expense
        </Button>
      </div>
    </Card>
  );
}
