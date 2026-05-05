'use client';

import { Shield, KeyRound, Smartphone, LogOut, ChevronRight } from 'lucide-react';
import SettingsCard from './SettingsCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SecurityCardProps {
  twoFactorEnabled?: boolean;
  lastSignInLabel?: string;
  onChangePassword?: () => void;
  onToggle2FA?: () => void;
  onSignOut?: () => void;
}

export default function SecurityCard({
  twoFactorEnabled = true,
  lastSignInLabel = 'Today · 8:42 AM · Portland, OR',
  onChangePassword,
  onToggle2FA,
  onSignOut,
}: SecurityCardProps) {
  return (
    <SettingsCard
      icon={Shield}
      title="Account & security"
      description="Sign-in, two-factor authentication, and session control."
    >
      <ActionRow
        icon={KeyRound}
        label="Password"
        hint="Last changed 4 months ago · recommend rotating annually."
        action="Change password"
        onClick={onChangePassword}
      />
      <ActionRow
        icon={Smartphone}
        label="Two-factor authentication"
        hint={
          twoFactorEnabled
            ? 'Enabled · Authenticator app on your registered phone.'
            : 'Disabled · enable to protect your account from sign-in fraud.'
        }
        action={twoFactorEnabled ? 'Manage' : 'Enable'}
        onClick={onToggle2FA}
        badge={
          <Badge
            variant="outline"
            className={cn(
              'uppercase tracking-wide text-[9px]',
              twoFactorEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60'
                : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60',
            )}
          >
            {twoFactorEnabled ? 'On' : 'Off'}
          </Badge>
        }
      />
      <div className="px-5 py-3.5 border-b">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          Last sign-in
        </div>
        <div className="text-sm mt-1 tabular-nums">{lastSignInLabel}</div>
      </div>

      <Button
        onClick={onSignOut}
        variant="ghost"
        className="w-full justify-center gap-2 py-4 h-auto rounded-none uppercase tracking-wide text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold"
      >
        <LogOut className="size-3.5" />
        Sign out
      </Button>
    </SettingsCard>
  );
}

function ActionRow({
  icon: Icon,
  label,
  hint,
  action,
  onClick,
  badge,
}: {
  icon: typeof KeyRound;
  label: string;
  hint: string;
  action: string;
  onClick?: () => void;
  badge?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full grid grid-cols-[24px_1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-accent/50 text-left border-b"
    >
      <Icon className="size-4 text-foreground" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{label}</span>
          {badge}
        </div>
        <div className="text-[11px] mt-0.5 text-muted-foreground">{hint}</div>
      </div>
      <span className="flex items-center gap-1.5 text-xs text-foreground font-medium">
        {action}
        <ChevronRight className="size-3" />
      </span>
    </button>
  );
}
