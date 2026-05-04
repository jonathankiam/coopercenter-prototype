'use client';

import { Plus, Download, Filter } from 'lucide-react';
import { C, FONTS } from '@/lib/design';

interface ExpensesToolbarProps {
  onAdd: () => void;
}

export default function ExpensesToolbar({ onAdd }: ExpensesToolbarProps) {
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
          Reports & line items
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-[0.1em]"
          style={{ backgroundColor: C.bone, color: C.muted, fontFamily: FONTS.sans }}
        >
          Reimbursable
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 h-9 px-3 rounded-full transition-colors hover:opacity-90"
          style={{
            backgroundColor: C.bone,
            border: `1px solid ${C.borderSoft}`,
            color: C.inkSoft,
            fontFamily: FONTS.sans,
            fontSize: 12,
            fontWeight: 500,
          }}
          title="Filter (coming soon)"
        >
          <Filter size={13} strokeWidth={2.2} />
          Filter
        </button>
        <button
          className="flex items-center gap-1.5 h-9 px-3 rounded-full transition-colors hover:opacity-90"
          style={{
            backgroundColor: C.bone,
            border: `1px solid ${C.borderSoft}`,
            color: C.inkSoft,
            fontFamily: FONTS.sans,
            fontSize: 12,
            fontWeight: 500,
          }}
          title="Export reports"
        >
          <Download size={13} strokeWidth={2.2} />
          Export
        </button>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 h-9 pl-3 pr-4 rounded-full transition-all hover:translate-y-[-1px]"
          style={{
            backgroundColor: C.lime,
            border: `1px solid ${C.limeDeep}`,
            color: C.ink,
            fontFamily: FONTS.sans,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            boxShadow: `0 6px 14px -8px ${C.ink}40`,
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Add expense
        </button>
      </div>
    </div>
  );
}
