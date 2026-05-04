import { Edit3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ManualBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const fontSize = size === 'sm' ? 'text-[9px]' : 'text-[10px]';
  const iconSize = size === 'sm' ? 9 : 10;
  return (
    <Badge
      variant="outline"
      className={`${fontSize} uppercase tracking-wider gap-1 rounded`}
    >
      <Edit3 size={iconSize} strokeWidth={2.5} />
      Manual
    </Badge>
  );
}
