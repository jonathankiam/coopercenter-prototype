'use client';

import { Plus, Download, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ExpensesToolbarProps {
  onAdd: () => void;
}

export default function ExpensesToolbar({ onAdd }: ExpensesToolbarProps) {
  return (
    <Card className="flex flex-row items-center justify-between gap-4 px-5 py-3 mb-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          Reports & line items
        </div>
        <Badge variant="secondary" className="uppercase tracking-wide text-[10px]">
          Reimbursable
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Filter className="size-3.5" />
          Filter
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="size-3.5" />
          Export
        </Button>
        <Button onClick={onAdd} size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add expense
        </Button>
      </div>
    </Card>
  );
}
