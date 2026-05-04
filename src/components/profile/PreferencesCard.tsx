'use client';

import { Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/cn';

export type PrefKey = 'timeFormat' | 'weekStartDay' | 'measurementUnits' | 'defaultExpenseCategory';

export interface UserPrefs {
  timeFormat: '12h' | '24h';
  weekStartDay: 'Sunday' | 'Monday';
  measurementUnits: 'imperial' | 'metric';
  defaultExpenseCategory: string;
}

interface PreferencesCardProps {
  prefs: UserPrefs;
  expenseCategories: readonly string[];
  onChange: <K extends PrefKey>(key: K, value: UserPrefs[K]) => void;
}

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-md border bg-muted/40 p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'h-7 px-3 rounded-sm transition-colors text-xs',
              active
                ? 'bg-foreground text-background font-semibold'
                : 'text-foreground/80 hover:bg-background font-medium',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function PreferencesCard({
  prefs,
  expenseCategories,
  onChange,
}: PreferencesCardProps) {
  return (
    <Card className="shadow-none gap-0 py-0">
      <CardHeader className="flex-row items-center gap-3 px-5 py-3.5 border-b">
        <span className="flex-shrink-0 size-8 rounded-md flex items-center justify-center bg-muted text-foreground">
          <Settings size={15} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <CardTitle className="text-sm leading-tight">
            Preferences
          </CardTitle>
          <p className="text-[11px] mt-0.5 text-muted-foreground font-normal">
            Display and default behavior across the app.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <PrefRow
          label="Time format"
          hint="How times appear on timecards and entries."
          control={
            <Segmented
              value={prefs.timeFormat}
              options={[
                { value: '12h', label: '12-hour' },
                { value: '24h', label: '24-hour' },
              ]}
              onChange={(v) => onChange('timeFormat', v)}
            />
          }
        />
        <PrefRow
          label="Week starts on"
          hint="Affects weekly timesheet and Sunday vs Monday-anchored views."
          control={
            <Segmented
              value={prefs.weekStartDay}
              options={[
                { value: 'Sunday', label: 'Sunday' },
                { value: 'Monday', label: 'Monday' },
              ]}
              onChange={(v) => onChange('weekStartDay', v)}
            />
          }
        />
        <PrefRow
          label="Measurement units"
          hint="Used for mileage entries and distance display."
          control={
            <Segmented
              value={prefs.measurementUnits}
              options={[
                { value: 'imperial', label: 'Miles' },
                { value: 'metric', label: 'Kilometers' },
              ]}
              onChange={(v) => onChange('measurementUnits', v)}
            />
          }
        />
        <PrefRow
          label="Default expense category"
          hint="Pre-selected when adding a new expense."
          last
          control={
            <Select
              value={prefs.defaultExpenseCategory}
              onValueChange={(v) => onChange('defaultExpenseCategory', v)}
            >
              <SelectTrigger size="sm" className="min-w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      </CardContent>
    </Card>
  );
}

function PrefRow({
  label,
  hint,
  control,
  last = false,
}: {
  label: string;
  hint: string;
  control: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5',
        !last && 'border-b',
      )}
    >
      <div>
        <div className="text-[13px] font-medium text-foreground">
          {label}
        </div>
        <div className="text-[11px] mt-0.5 text-muted-foreground">
          {hint}
        </div>
      </div>
      {control}
    </div>
  );
}
