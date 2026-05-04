import { Badge } from '@/components/ui/badge';
import type { EntryStatus } from '@/lib/design';

const STATUS_LABEL: Record<EntryStatus, string> = {
  draft: 'Draft',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  submitted: 'Submitted',
  paid: 'Paid',
};

// Greyscale tonal hierarchy: lighter = softer, darker = more emphasis.
// All variants use shadcn Badge primitive; styling is purely tonal.
const STATUS_VARIANT: Record<
  EntryStatus,
  { variant: 'secondary' | 'outline' | 'default' | 'destructive'; className?: string }
> = {
  draft:     { variant: 'outline' },
  pending:   { variant: 'secondary' },
  approved:  { variant: 'secondary', className: 'bg-neutral-300 text-neutral-900' },
  rejected:  { variant: 'destructive' },
  submitted: { variant: 'secondary' },
  paid:      { variant: 'default' },
};

interface StatusPillProps {
  status: EntryStatus;
  size?: 'sm' | 'md';
}

export default function StatusPill({ status, size = 'sm' }: StatusPillProps) {
  const cfg = STATUS_VARIANT[status];
  const sizeClass = size === 'sm' ? 'text-[10px]' : 'text-xs';
  return (
    <Badge
      variant={cfg.variant}
      className={`${sizeClass} uppercase tracking-wider rounded-full ${cfg.className ?? ''}`}
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}
