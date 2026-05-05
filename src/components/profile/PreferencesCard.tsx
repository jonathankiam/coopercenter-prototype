'use client';

import { Settings } from 'lucide-react';
import SettingsCard from './SettingsCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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
    <div className="inline-flex items-center rounded-md p-0.5 bg-muted border">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'h-7 px-3 rounded-sm transition-colors text-xs',
              active
                ? 'bg-card text-foreground font-semibold shadow-sm'
                : 'text-muted-foreground hover:text-foreground font-medium',
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
    <SettingsCard
      icon={Settings}
      title="Preferences"
      description="Display and default behavior across the app."
    >
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
        control={
          <Select
            value={prefs.defaultExpenseCategory}
            onValueChange={(v) => v && onChange('defaultExpenseCategory', v)}
          >
            <SelectTrigger className="h-8 min-w-[160px]">
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
    </SettingsCard>
  );
}

function PrefRow({
  label,
  hint,
  control,
}: {
  label: string;
  hint: string;
  control: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5 border-b last:border-b-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[11px] mt-0.5 text-muted-foreground">{hint}</div>
      </div>
      {control}
    </div>
  );
}
