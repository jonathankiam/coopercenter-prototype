'use client';

import { Shield, KeyRound, Smartphone, LogOut, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    <Card className="shadow-none gap-0 py-0 overflow-hidden">
      <CardHeader className="flex-row items-center gap-3 px-5 py-3.5 border-b">
        <span className="flex-shrink-0 size-8 rounded-md flex items-center justify-center bg-muted text-foreground">
          <Shield size={15} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <CardTitle className="text-sm leading-tight">
            Account &amp; security
          </CardTitle>
          <p className="text-[11px] mt-0.5 text-muted-foreground font-normal">
            Sign-in, two-factor authentication, and session control.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
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
              variant={twoFactorEnabled ? 'secondary' : 'outline'}
              className="text-[9px] uppercase tracking-wider rounded"
            >
              {twoFactorEnabled ? 'On' : 'Off'}
            </Badge>
          }
        />
        <div className="px-5 py-3.5 border-b">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Last sign-in
          </div>
          <div className="text-[13px] mt-1 font-mono tabular-nums text-foreground">
            {lastSignInLabel}
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={onSignOut}
          className="w-full justify-center gap-2 py-4 h-auto rounded-none uppercase tracking-[0.04em] text-[13px] font-semibold"
        >
          <LogOut size={14} strokeWidth={2.4} />
          Sign out
        </Button>
      </CardContent>
    </Card>
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
  icon: LucideIcon;
  label: string;
  hint: string;
  action: string;
  onClick?: () => void;
  badge?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full grid grid-cols-[24px_1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40 text-left border-b"
    >
      <Icon size={15} strokeWidth={2.2} className="text-foreground" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-foreground">
            {label}
          </span>
          {badge}
        </div>
        <div className="text-[11px] mt-0.5 text-muted-foreground">
          {hint}
        </div>
      </div>
      <span className="flex items-center gap-1.5 text-[12px] text-foreground font-medium">
        {action}
        <ChevronRight size={13} strokeWidth={2.2} />
      </span>
    </button>
  );
}
