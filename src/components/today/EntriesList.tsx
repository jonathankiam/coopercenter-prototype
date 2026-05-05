import { ChevronRight, Plus, MapPin } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <h2 className="text-base font-semibold leading-tight">Today&rsquo;s entries</h2>
          <div className="text-xs mt-0.5 text-muted-foreground">
            {sorted.length} {sorted.length === 1 ? 'shift' : 'shifts'} · {totalHours.toFixed(1)}h total
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add manual
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        {sorted.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-center rounded-md border border-dashed bg-muted/30">
            <div className="text-sm text-muted-foreground">Nothing logged yet today</div>
            <div className="text-xs mt-1 text-muted-foreground/70">
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
                  <button className="w-full text-left flex items-center gap-3 p-3 rounded-md border bg-card hover:bg-accent transition-colors">
                    <span
                      className="block w-1 self-stretch rounded-full flex-shrink-0 min-h-9"
                      style={{ backgroundColor: job?.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{job?.name ?? 'Unknown job'}</span>
                        {showManual && <ManualBadge />}
                      </div>
                      <div className="text-xs tabular-nums mt-0.5 flex items-center gap-2 text-muted-foreground font-mono">
                        <span>{e.start} → {e.end}</span>
                        <span>·</span>
                        <span>{e.hours.toFixed(1)}h</span>
                        {e.otH > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-amber-600 dark:text-amber-400">
                              +{e.otH.toFixed(1)} OT
                            </span>
                          </>
                        )}
                      </div>
                      {(e.paycode || e.costCenter) && (
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {e.paycode && (
                            <Badge variant="secondary" className="h-4 text-[9px] uppercase tracking-wider">
                              {e.paycode}
                            </Badge>
                          )}
                          {e.costCenter && (
                            <span className="text-[10px] flex items-center gap-1 text-muted-foreground">
                              <MapPin className="size-2.5" />
                              {e.costCenter}
                            </span>
                          )}
                        </div>
                      )}
                      {e.note && (
                        <div className="text-xs mt-1.5 italic line-clamp-2 text-muted-foreground">
                          &ldquo;{e.note}&rdquo;
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <StatusPill status={e.status} />
                      <ChevronRight className="size-3 text-muted-foreground/60" />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
