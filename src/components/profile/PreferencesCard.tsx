'use client';

import { Settings } from 'lucide-react';
import SettingsCard from './SettingsCard';
import { C, FONTS } from '@/lib/design';

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
    <div
      className="inline-flex items-center rounded-full p-0.5"
      style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}` }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="h-7 px-3 rounded-full transition-colors"
            style={{
              backgroundColor: active ? C.ink : 'transparent',
              color: active ? C.cream : C.inkSoft,
              fontFamily: FONTS.sans,
              fontSize: 12,
              fontWeight: active ? 600 : 500,
            }}
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
          <select
            value={prefs.defaultExpenseCategory}
            onChange={(e) => onChange('defaultExpenseCategory', e.target.value)}
            className="h-8 px-3 rounded-full transition-colors"
            style={{
              backgroundColor: C.bone,
              border: `1px solid ${C.borderSoft}`,
              color: C.ink,
              fontFamily: FONTS.sans,
              fontSize: 12,
              fontWeight: 500,
              minWidth: 160,
            }}
          >
            {expenseCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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
    <div
      className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5"
      style={{ borderBottom: `1px solid ${C.borderSoft}` }}
    >
      <div>
        <div
          className="text-[13px] font-medium"
          style={{ color: C.ink, fontFamily: FONTS.sans }}
        >
          {label}
        </div>
        <div
          className="text-[11px] mt-0.5"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          {hint}
        </div>
      </div>
      {control}
    </div>
  );
}
