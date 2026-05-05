import { Edit3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ManualBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'uppercase tracking-wide font-medium gap-1',
        size === 'sm' ? 'h-5 text-[9px] px-1.5' : 'h-5 text-[10px] px-2',
      )}
    >
      <Edit3 strokeWidth={2.5} />
      Manual
    </Badge>
  );
}
