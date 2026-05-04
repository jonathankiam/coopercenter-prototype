'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, ArrowRight, Square, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fmtClock, fmtMoney } from '@/lib/utils';
import { cn } from '@/lib/cn';
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
    <Card className="h-full flex flex-col shadow-none">
      <CardHeader className="flex-row items-baseline justify-between">
        <CardTitle className="text-lg">Active assignment</CardTitle>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {jobs.length} jobs
        </span>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Job selector */}
        <div className="flex flex-wrap gap-1 mb-6 p-1 rounded-md border bg-muted/40">
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
                    ? 'bg-foreground text-background'
                    : 'text-foreground/80 hover:bg-background',
                  clockedIn && !active && 'opacity-40 cursor-not-allowed',
                )}
                title={clockedIn && !active ? 'Clock out before switching' : undefined}
              >
                <span
                  className="block w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate leading-tight">{j.name}</div>
                  <div className="text-[9px] opacity-70 tracking-wider mt-0.5 truncate">
                    {j.code}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected job detail */}
        <div className="flex-1 flex flex-col items-center text-center px-2">
          <Badge
            variant={clockedIn ? 'default' : 'outline'}
            className="mb-3 uppercase tracking-[0.15em] text-[10px]"
          >
            <span
              className={cn(
                'block w-1.5 h-1.5 rounded-full mr-1',
                clockedIn ? 'bg-background' : 'bg-muted-foreground',
              )}
            />
            {clockedIn ? 'On the clock' : 'Ready to start'}
          </Badge>

          <div className="text-2xl font-semibold tracking-tight leading-tight mb-2">
            {selected?.name ?? '—'}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground mb-8">
            <span className="flex items-center gap-1">
              <Briefcase size={11} strokeWidth={2} />
              {selected?.code} · {selected?.type}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin size={11} strokeWidth={2} />
              {selected?.location}
            </span>
            <span>·</span>
            <span>{fmtMoney(selected?.rate ?? 0)}/hr</span>
          </div>

          <div
            className={cn(
              'text-[88px] leading-none tracking-tight tabular-nums mb-1 font-mono font-light',
              clockedIn ? 'text-foreground' : 'text-muted-foreground/50',
            )}
            style={{ letterSpacing: '-0.02em' }}
          >
            {fmtClock(seconds)}
          </div>

          <div
            className={cn(
              'text-xs mb-8 tabular-nums',
              clockedIn ? 'text-foreground' : 'text-muted-foreground',
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
            className="w-full max-w-[420px] uppercase tracking-[0.15em]"
          >
            {clockedIn ? (
              <>
                <Square size={14} strokeWidth={2.5} fill="currentColor" />
                Clock Out
              </>
            ) : (
              <>
                Clock In
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
