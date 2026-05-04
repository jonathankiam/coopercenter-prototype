import type { LucideIcon } from 'lucide-react';
import { C, FONTS } from '@/lib/design';

interface SettingsCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export default function SettingsCard({
  icon: Icon,
  title,
  description,
  action,
  children,
}: SettingsCardProps) {
  return (
    <section
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
    >
      <header
        className="flex items-center justify-between gap-4 px-5 py-3.5"
        style={{ borderBottom: `1px solid ${C.borderSoft}`, backgroundColor: C.paper }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: C.bone, color: C.inkSoft }}
          >
            <Icon size={15} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h2
              className="text-[14px] font-medium leading-tight"
              style={{ color: C.ink, fontFamily: FONTS.sans }}
            >
              {title}
            </h2>
            {description && (
              <p
                className="text-[11px] mt-0.5"
                style={{ color: C.muted, fontFamily: FONTS.sans }}
              >
                {description}
              </p>
            )}
          </div>
        </div>
        {action}
      </header>

      <div>{children}</div>
    </section>
  );
}

// Reusable label-value pair row for settings cards.
// Used so every "field" line in the Profile page has consistent rhythm and spacing.
export function FieldRow({
  label,
  value,
  hint,
  badge,
  trailing,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  badge?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div
      className="grid grid-cols-[180px_1fr_auto] items-start gap-4 px-5 py-3"
      style={{ borderBottom: `1px solid ${C.borderSoft}` }}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-[11px] uppercase tracking-[0.18em]"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          {label}
        </span>
        {badge}
      </div>
      <div className="min-w-0">
        <div
          className="text-[13px]"
          style={{ color: C.ink, fontFamily: FONTS.sans }}
        >
          {value}
        </div>
        {hint && (
          <div
            className="text-[11px] mt-0.5"
            style={{ color: C.muted, fontFamily: FONTS.sans }}
          >
            {hint}
          </div>
        )}
      </div>
      {trailing && <div className="flex items-center">{trailing}</div>}
    </div>
  );
}
