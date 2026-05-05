import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { STATUS_LABELS, type EntryStatus } from '@/lib/design';

interface StatusPillProps {
  status: EntryStatus;
  size?: 'sm' | 'md';
  className?: string;
}

// Each status keeps shadcn's compact Badge proportions but tints with a Tailwind
// palette color so users can scan a list and tell drafts from pending from paid.
const STATUS_STYLES: Record<EntryStatus, string> = {
  draft:
    'bg-muted text-muted-foreground border-transparent',
  pending:
    'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60',
  submitted:
    'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60',
  approved:
    'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60',
  paid:
    'bg-emerald-600 text-white border-transparent dark:bg-emerald-700',
  rejected:
    'bg-destructive/10 text-destructive border-transparent',
};

export default function StatusPill({ status, size = 'sm', className }: StatusPillProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'uppercase tracking-wide font-medium',
        size === 'sm' ? 'h-5 text-[10px] px-2' : 'h-6 text-[11px] px-2.5',
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
