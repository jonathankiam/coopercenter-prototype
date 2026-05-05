'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, ArrowRight, Square, Briefcase } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fmtClock, fmtMoney, cn } from '@/lib/utils';
import type { Job } from '@/lib/types';

interface ActiveAssignmentCardProps {
  jobs: Job[];
  initialJobId?: number;
}

export default function ActiveAssignmentCard({ jobs, initialJobId }: ActiveAssignmentCardProps) {
  const [selectedId, setSelectedId] = useState<number>(initialJobId ?? jobs[0]?.id);
  const [clockedIn, setClockedIn] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const startRef = useRef<number | null>(null);

  const selected = jobs.find((j) => j.id === selectedId) ?? jobs[0];

  useEffect(() => {
    if (!clockedIn) return;
    const id = setInterval(() => {
      if (startRef.current != null) {
        setSeconds(Math.floor((Date.now() - startRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [clockedIn]);

  const handleToggle = () => {
    if (clockedIn) {
      setClockedIn(false);
      setSeconds(0);
      startRef.current = null;
    } else {
      startRef.current = Date.now();
      setSeconds(0);
      setClockedIn(true);
    }
  };

  const liveEarnings = (seconds / 3600) * (selected?.rate ?? 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <h2 className="text-base font-semibold leading-tight">Active assignment</h2>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          {jobs.length} jobs
        </span>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-7 pt-0">
        {/* Job selector */}
        <div className="flex flex-wrap gap-1 mb-6 p-1 rounded-md bg-muted">
          {jobs.map((j) => {
            const active = j.id === selectedId;
            return (
              <button
                key={j.id}
                onClick={() => !clockedIn && setSelectedId(j.id)}
                disabled={clockedIn && !active}
                className={cn(
                  'flex-1 min-w-[140px] flex items-center gap-2 px-3 py-2 rounded-sm transition-all text-left',
                  active
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                  clockedIn && !active && 'opacity-40 cursor-not-allowed',
                )}
                title={clockedIn && !active ? 'Clock out before switching' : undefined}
              >
                <span
                  className="block size-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: j.color }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate leading-tight">{j.name}</div>
                  <div className="text-[10px] tracking-wider mt-0.5 truncate text-muted-foreground">
                    {j.code}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected job detail */}
        <div className="flex-1 flex flex-col items-center text-center px-2">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                'block size-2 rounded-full',
                clockedIn ? 'bg-emerald-500' : 'bg-muted-foreground/40',
              )}
            />
            <span
              className={cn(
                'text-[10px] uppercase tracking-widest font-medium',
                clockedIn ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
              )}
            >
              {clockedIn ? 'On the clock' : 'Ready to start'}
            </span>
          </div>

          <div className="text-2xl font-semibold tracking-tight leading-tight mb-1">
            {selected?.name ?? '—'}
          </div>

          <div className="flex items-center gap-3 text-xs mb-8 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Briefcase className="size-3" />
              {selected?.code} · {selected?.type}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {selected?.location}
            </span>
            <span>·</span>
            <span>{fmtMoney(selected?.rate ?? 0)}/hr</span>
          </div>

          <div
            className={cn(
              'text-[88px] font-mono font-light leading-none tracking-tight tabular-nums mb-1',
              clockedIn ? 'text-foreground' : 'text-muted-foreground/60',
            )}
          >
            {fmtClock(seconds)}
          </div>

          <div
            className={cn(
              'text-xs mb-8 tabular-nums',
              clockedIn ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
            )}
          >
            {clockedIn
              ? `Earning ${fmtMoney(liveEarnings)} so far`
              : 'Tap below to start your shift'}
          </div>

          <Button
            onClick={handleToggle}
            size="lg"
            variant={clockedIn ? 'destructive' : 'default'}
            className="w-full max-w-[420px] gap-2 uppercase tracking-widest font-semibold"
          >
            {clockedIn ? (
              <>
                <Square className="size-3.5" fill="currentColor" />
                Clock Out
              </>
            ) : (
              <>
                Clock In
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
