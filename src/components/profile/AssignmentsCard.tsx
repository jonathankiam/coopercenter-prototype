import { Briefcase, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fmtMoney } from '@/lib/utils';
import type { Job } from '@/lib/types';

interface AssignmentsCardProps {
  jobs: Job[];
}

export default function AssignmentsCard({ jobs }: AssignmentsCardProps) {
  return (
    <Card className="shadow-none gap-0 py-0">
      <CardHeader className="flex-row items-center gap-3 px-5 py-3.5 border-b">
        <span className="flex-shrink-0 size-8 rounded-md flex items-center justify-center bg-muted text-foreground">
          <Briefcase size={15} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <CardTitle className="text-sm leading-tight">
            Active assignments
          </CardTitle>
          <p className="text-[11px] mt-0.5 text-muted-foreground font-normal">
            {jobs.length} {jobs.length === 1 ? 'assignment' : 'assignments'} you can clock in on right now.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {jobs.map((job, idx) => (
          <div
            key={job.id}
            className={`flex items-center gap-4 px-5 py-3.5 ${
              idx === jobs.length - 1 ? '' : 'border-b'
            }`}
          >
            <span className="block w-1.5 h-12 rounded-full flex-shrink-0 bg-foreground/60" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[14px] font-medium text-foreground">
                  {job.name}
                </span>
                <Badge
                  variant={job.kind === 'live' ? 'secondary' : 'outline'}
                  className="text-[10px] uppercase tracking-wider rounded"
                >
                  {job.kind === 'live' ? 'Live punch' : 'Manual punch'}
                </Badge>
              </div>
              <div className="text-[11px] mt-1 flex items-center gap-3 flex-wrap text-muted-foreground">
                <span className="font-mono tabular-nums">{job.code}</span>
                <span>·</span>
                <span>{job.type}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin size={10} strokeWidth={2} />
                  {job.location}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[16px] font-mono tabular-nums font-medium text-foreground">
                {fmtMoney(job.rate)}
              </div>
              <div className="text-[10px] uppercase tracking-wider mt-0.5 text-muted-foreground">
                per hour
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
