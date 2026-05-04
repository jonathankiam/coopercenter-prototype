import { Edit3 } from 'lucide-react';
import { C, FONTS } from '@/lib/design';

export default function ManualBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const dims = size === 'sm'
    ? { fontSize: 9, px: 'px-1.5', py: 'py-0.5', icon: 9 }
    : { fontSize: 10, px: 'px-2', py: 'py-0.5', icon: 10 };
  return (
    <span
      className={`${dims.px} ${dims.py} rounded inline-flex items-center gap-1 font-medium tracking-wider uppercase`}
      style={{
        backgroundColor: C.bone,
        color: C.inkSoft,
        border: `1px solid ${C.borderSoft}`,
        fontSize: dims.fontSize,
        fontFamily: FONTS.sans,
      }}
    >
      <Edit3 size={dims.icon} strokeWidth={2.5} />
      Manual
    </span>
  );
}
