'use client';

import { Pencil, Download, BadgeCheck } from 'lucide-react';
import { C, FONTS } from '@/lib/design';

interface ProfileToolbarProps {
  tenure: string;
  onEdit?: () => void;
  onExport?: () => void;
}

export default function ProfileToolbar({ tenure, onEdit, onExport }: ProfileToolbarProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-5 py-3 rounded-2xl mb-3"
      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          Account & preferences
        </div>
        <span
          className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-[0.1em]"
          style={{ backgroundColor: '#DDE8C4', color: '#3F5320', fontFamily: FONTS.sans }}
        >
          <BadgeCheck size={10} strokeWidth={2.5} />
          Active · {tenure}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 h-9 px-3 rounded-full transition-colors hover:opacity-90"
          style={{
            backgroundColor: C.bone,
            border: `1px solid ${C.borderSoft}`,
            color: C.inkSoft,
            fontFamily: FONTS.sans,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <Download size={13} strokeWidth={2.2} />
          Export account data
        </button>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 h-9 pl-3 pr-4 rounded-full transition-all hover:translate-y-[-1px]"
          style={{
            backgroundColor: C.ink,
            color: C.cream,
            border: `1px solid ${C.ink}`,
            fontFamily: FONTS.sans,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          <Pencil size={13} strokeWidth={2.2} />
          Edit profile
        </button>
      </div>
    </div>
  );
}
