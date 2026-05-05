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
    <Card className="flex flex-row items-center justify-between gap-4 px-5 py-3 mb-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          Account & preferences
        </div>
        <Badge
          variant="outline"
          className="gap-1.5 uppercase tracking-wide text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60"
        >
          <BadgeCheck className="size-3" />
          Active · {tenure}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onExport} variant="outline" size="sm" className="gap-1.5">
          <Download className="size-3.5" />
          Export account data
        </Button>
        <Button onClick={onEdit} size="sm" className="gap-1.5">
          <Pencil className="size-3.5" />
          Edit profile
        </Button>
      </div>
    </Card>
  );
}
