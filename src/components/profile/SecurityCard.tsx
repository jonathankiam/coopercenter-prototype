'use client';

import { Shield, KeyRound, Smartphone, LogOut, ChevronRight } from 'lucide-react';
import SettingsCard from './SettingsCard';
import { C, FONTS } from '@/lib/design';

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
          <span
            className="text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider"
            style={{
              backgroundColor: twoFactorEnabled ? '#E5E5E5' : '#F0F0F0',
              color: twoFactorEnabled ? '#0A0A0A' : '#404040',
              fontFamily: FONTS.sans,
            }}
          >
            {twoFactorEnabled ? 'On' : 'Off'}
          </span>
        }
      />
      <div
        className="px-5 py-3.5"
        style={{ borderBottom: `1px solid ${C.borderSoft}` }}
      >
        <div
          className="text-[11px] uppercase tracking-[0.18em]"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          Last sign-in
        </div>
        <div
          className="text-[13px] mt-1 tabular-nums"
          style={{ color: C.ink, fontFamily: FONTS.sans }}
        >
          {lastSignInLabel}
        </div>
      </div>

      <button
        onClick={onSignOut}
        className="w-full flex items-center justify-center gap-2 py-4 transition-colors hover:bg-white/40"
        style={{
          color: C.clay,
          fontFamily: FONTS.sans,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.04em',
        }}
      >
        <LogOut size={14} strokeWidth={2.4} />
        <span className="uppercase">Sign out</span>
      </button>
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
      className="w-full grid grid-cols-[24px_1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/40 text-left"
      style={{ borderBottom: `1px solid ${C.borderSoft}` }}
    >
      <Icon size={15} strokeWidth={2.2} style={{ color: C.inkSoft }} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-[13px] font-medium"
            style={{ color: C.ink, fontFamily: FONTS.sans }}
          >
            {label}
          </span>
          {badge}
        </div>
        <div
          className="text-[11px] mt-0.5"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          {hint}
        </div>
      </div>
      <span
        className="flex items-center gap-1.5 text-[12px]"
        style={{ color: C.inkSoft, fontFamily: FONTS.sans, fontWeight: 500 }}
      >
        {action}
        <ChevronRight size={13} strokeWidth={2.2} />
      </span>
    </button>
  );
}
