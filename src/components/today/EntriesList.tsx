import { ChevronRight, Plus, MapPin } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import StatusPill from '@/components/StatusPill';
import ManualBadge from '@/components/ManualBadge';
import { isBackfilledLivePunch } from '@/lib/utils';
import type { TimeEntry, Job } from '@/lib/types';

interface EntriesListProps {
  entries: TimeEntry[];
  jobs: Job[];
}

export default function EntriesList({ entries, jobs }: EntriesListProps) {
  const sorted = [...entries].sort((a, b) => a.start.localeCompare(b.start));
  const totalHours = sorted.reduce((s, e) => s + e.hours, 0);

  return (
    <section
      className="rounded-3xl p-6 h-full flex flex-col"
      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
    >
      <header className="flex items-baseline justify-between mb-5">
        <div>
          <h2
            className="text-[20px] leading-tight"
            style={{ color: C.ink, fontFamily: FONTS.serif, fontStyle: 'italic' }}
          >
            Today&rsquo;s entries
          </h2>
          <div
            className="text-[11px] mt-0.5"
            style={{ color: C.muted, fontFamily: FONTS.sans }}
          >
            {sorted.length} {sorted.length === 1 ? 'shift' : 'shifts'} · {totalHours.toFixed(1)}h total
          </div>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors"
          style={{
            backgroundColor: C.bone,
            color: C.inkSoft,
            border: `1px solid ${C.borderSoft}`,
            fontFamily: FONTS.sans,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <Plus size={13} strokeWidth={2.5} />
          Add manual
        </button>
      </header>

      {sorted.length === 0 ? (
        <div
          className="flex-1 flex flex-col items-center justify-center py-10 text-center rounded-2xl"
          style={{ backgroundColor: C.paper, border: `1px dashed ${C.border}` }}
        >
          <div
            className="text-[14px]"
            style={{ color: C.muted, fontFamily: FONTS.serif, fontStyle: 'italic' }}
          >
            Nothing logged yet today
          </div>
          <div
            className="text-[11px] mt-1"
            style={{ color: C.mutedSoft, fontFamily: FONTS.sans }}
          >
            Clock in or add a manual entry to get started
          </div>
        </div>
      ) : (
        <ul className="flex-1 flex flex-col gap-2 overflow-y-auto">
          {sorted.map((e) => {
            const job = jobs.find((j) => j.id === e.jobId);
            const showManual = isBackfilledLivePunch(e, jobs);
            return (
              <li key={e.id}>
                <button
                  className="w-full text-left flex items-center gap-3 p-3.5 rounded-2xl transition-all hover:translate-x-0.5"
                  style={{ backgroundColor: C.paper, border: `1px solid ${C.borderSoft}` }}
                >
                  <span
                    className="block w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ backgroundColor: job?.color ?? C.muted, minHeight: 36 }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[13px] font-medium"
                        style={{ color: C.ink, fontFamily: FONTS.sans }}
                      >
                        {job?.name ?? 'Unknown job'}
                      </span>
                      {showManual && <ManualBadge />}
                    </div>
                    <div
                      className="text-[11px] tabular-nums mt-0.5 flex items-center gap-2"
                      style={{ color: C.muted, fontFamily: FONTS.sans }}
                    >
                      <span>{e.start} → {e.end}</span>
                      <span>·</span>
                      <span>{e.hours.toFixed(1)}h</span>
                      {e.otH > 0 && (
                        <>
                          <span>·</span>
                          <span style={{ color: C.amber }}>+{e.otH.toFixed(1)} OT</span>
                        </>
                      )}
                    </div>
                    {(e.paycode || e.costCenter) && (
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {e.paycode && (
                          <span
                            className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: C.bone, color: C.inkSoft, fontFamily: FONTS.sans }}
                          >
                            {e.paycode}
                          </span>
                        )}
                        {e.costCenter && (
                          <span
                            className="text-[10px] flex items-center gap-1"
                            style={{ color: C.muted, fontFamily: FONTS.sans }}
                          >
                            <MapPin size={9} strokeWidth={2} />
                            {e.costCenter}
                          </span>
                        )}
                      </div>
                    )}
                    {e.note && (
                      <div
                        className="text-[11px] mt-1.5 italic line-clamp-2"
                        style={{ color: C.inkSoft, fontFamily: FONTS.sans }}
                      >
                        &ldquo;{e.note}&rdquo;
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <StatusPill status={e.status} />
                    <ChevronRight size={13} style={{ color: C.mutedSoft }} />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
