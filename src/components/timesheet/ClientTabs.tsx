'use client';

import { Layers } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import StatusPill from '@/components/StatusPill';
import type { ClientGroup } from '@/lib/timesheet';

export type ClientFilter = 'all' | string;

interface ClientTabsProps {
  groups: ClientGroup[];
  active: ClientFilter;
  onChange: (filter: ClientFilter) => void;
}

export default function ClientTabs({ groups, active, onChange }: ClientTabsProps) {
  const totalEntries = groups.reduce((s, g) => s + g.entries.length, 0);

  return (
    <div
      className="flex items-stretch gap-px rounded-2xl overflow-hidden mb-3"
      style={{ backgroundColor: C.borderSoft, border: `1px solid ${C.border}` }}
    >
      <TabButton
        active={active === 'all'}
        onClick={() => onChange('all')}
        accentColor={C.ink}
        title={
          <span className="flex items-center gap-2">
            <Layers size={13} strokeWidth={2.2} />
            <span>All clients</span>
          </span>
        }
        count={totalEntries}
      />
      {groups.map((g) => {
        const accent = g.jobs[0]?.color ?? C.muted;
        return (
          <TabButton
            key={g.client}
            active={active === g.client}
            onClick={() => onChange(g.client)}
            accentColor={accent}
            title={
              <span className="flex items-center gap-2">
                <span
                  className="block w-2 h-2 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <span>{g.client}</span>
              </span>
            }
            count={g.entries.length}
            status={g.entries.length > 0 ? g.status : undefined}
          />
        );
      })}
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  title: React.ReactNode;
  count: number;
  accentColor: string;
  status?: ClientGroup['status'];
}

function TabButton({ active, onClick, title, count, accentColor, status }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 px-5 py-3 text-left transition-colors relative"
      style={{
        backgroundColor: active ? C.cream : C.paper,
        color: active ? C.ink : C.inkSoft,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="text-[13px] font-medium"
          style={{ fontFamily: FONTS.sans }}
        >
          {title}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-[11px] tabular-nums px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: active ? C.bone : 'transparent',
              color: active ? C.inkSoft : C.muted,
              fontFamily: FONTS.sans,
              border: active ? 'none' : `1px solid ${C.borderSoft}`,
            }}
          >
            {count}
          </span>
          {status && <StatusPill status={status} />}
        </div>
      </div>
      {active && (
        <span
          className="absolute left-0 right-0 bottom-0 h-[2px]"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </button>
  );
}
