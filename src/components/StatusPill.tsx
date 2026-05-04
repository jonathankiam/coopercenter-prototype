import { STATUS_META, FONTS } from '@/lib/design';
import type { EntryStatus } from '@/lib/design';

interface StatusPillProps {
  status: EntryStatus;
  size?: 'sm' | 'md';
}

export default function StatusPill({ status, size = 'sm' }: StatusPillProps) {
  const m = STATUS_META[status];
  const sz = size === 'sm' ? 'text-[10px] px-2 py-[3px]' : 'text-xs px-2.5 py-1';
  return (
    <span
      className={`${sz} rounded-full font-medium tracking-wider uppercase inline-flex items-center`}
      style={{ color: m.color, backgroundColor: m.bg, fontFamily: FONTS.sans }}
    >
      {m.label}
    </span>
  );
}
