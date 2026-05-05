import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
    <Card className="overflow-hidden p-0 gap-0">
      <header className="flex items-center justify-between gap-4 px-5 py-3.5 border-b bg-muted/30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 size-8 rounded-md flex items-center justify-center bg-muted text-foreground">
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-medium leading-tight">{title}</h2>
            {description && (
              <p className="text-[11px] mt-0.5 text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {action}
      </header>
      <div>{children}</div>
    </Card>
  );
}

// Reusable label-value row for settings cards.
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
    <div className="grid grid-cols-[180px_1fr_auto] items-start gap-4 px-5 py-3 border-b last:border-b-0">
      <div className="flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          {label}
        </span>
        {badge}
      </div>
      <div className="min-w-0">
        <div className="text-sm">{value}</div>
        {hint && <div className="text-[11px] mt-0.5 text-muted-foreground">{hint}</div>}
      </div>
      {trailing && <div className="flex items-center">{trailing}</div>}
    </div>
  );
}
