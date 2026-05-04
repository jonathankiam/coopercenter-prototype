import { Briefcase, MapPin } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { fmtMoney } from '@/lib/utils';
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
          className="flex items-center gap-4 px-5 py-3.5"
          style={{ borderBottom: `1px solid ${C.borderSoft}` }}
        >
          <span
            className="block w-1.5 h-12 rounded-full flex-shrink-0"
            style={{ backgroundColor: job.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[14px] font-medium"
                style={{ color: C.ink, fontFamily: FONTS.sans }}
              >
                {job.name}
              </span>
              <span
                className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: job.kind === 'live' ? '#F5E5C5' : C.bone,
                  color: job.kind === 'live' ? '#8A6420' : C.inkSoft,
                  fontFamily: FONTS.sans,
                }}
              >
                {job.kind === 'live' ? 'Live punch' : 'Manual punch'}
              </span>
            </div>
            <div
              className="text-[11px] mt-1 flex items-center gap-3 flex-wrap"
              style={{ color: C.muted, fontFamily: FONTS.sans }}
            >
              <span className="tabular-nums">{job.code}</span>
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
            <div
              className="text-[16px] tabular-nums font-medium"
              style={{ color: C.ink, fontFamily: FONTS.mono }}
            >
              {fmtMoney(job.rate)}
            </div>
            <div
              className="text-[10px] uppercase tracking-wider mt-0.5"
              style={{ color: C.muted, fontFamily: FONTS.sans }}
            >
              per hour
            </div>
          </div>
        </div>
      ))}
    </SettingsCard>
  );
}
