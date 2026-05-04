'use client';

import { Pencil, Download, BadgeCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProfileToolbarProps {
  tenure: string;
  onEdit?: () => void;
  onExport?: () => void;
}

export default function ProfileToolbar({ tenure, onEdit, onExport }: ProfileToolbarProps) {
  return (
    <Card className="flex-row items-center justify-between gap-4 px-5 py-3 mb-3 shadow-none">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Account &amp; preferences
        </span>
        <Badge variant="secondary" className="gap-1 text-[10px] uppercase tracking-[0.1em]">
          <BadgeCheck size={10} strokeWidth={2.5} />
          Active · {tenure}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download size={13} strokeWidth={2.2} />
          Export account data
        </Button>
        <Button size="sm" onClick={onEdit}>
          <Pencil size={13} strokeWidth={2.2} />
          Edit profile
        </Button>
      </div>
    </Card>
  );
}
