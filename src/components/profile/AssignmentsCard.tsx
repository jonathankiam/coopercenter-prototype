import { Briefcase, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fmtMoney, cn } from '@/lib/utils';
import SettingsCard from './SettingsCard';
import type { Job } from '@/lib/types';

interface AssignmentsCardProps {
  jobs: Job[];
}

export default function AssignmentsCard({ jobs }: AssignmentsCardProps) {
  return (
    <SettingsCard
      icon={Briefcase}
      title="Active assignments"
      description={`${jobs.length} ${jobs.length === 1 ? 'assignment' : 'assignments'} you can clock in on right now.`}
    >
      {jobs.map((job) => (
        <div
          key={job.id}
          className="flex items-center gap-4 px-5 py-3.5 border-b last:border-b-0"
        >
          <span
            className="block w-1.5 h-12 rounded-full flex-shrink-0"
            style={{ backgroundColor: job.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">{job.name}</span>
              <Badge
                variant="outline"
                className={cn(
                  'uppercase tracking-wide text-[10px] font-medium',
                  job.kind === 'live'
                    ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60'
                    : '',
                )}
              >
                {job.kind === 'live' ? 'Live punch' : 'Manual punch'}
              </Badge>
            </div>
            <div className="text-[11px] mt-1 flex items-center gap-3 flex-wrap text-muted-foreground">
              <span className="tabular-nums">{job.code}</span>
              <span>·</span>
              <span>{job.type}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="size-2.5" />
                {job.location}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-base tabular-nums font-medium font-mono">
              {fmtMoney(job.rate)}
            </div>
            <div className="text-[10px] uppercase tracking-wider mt-0.5 text-muted-foreground">
              per hour
            </div>
          </div>
        </div>
      ))}
    </SettingsCard>
  );
}
