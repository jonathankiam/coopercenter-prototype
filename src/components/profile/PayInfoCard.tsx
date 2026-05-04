import { CreditCard, FileText, Building2 } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { fmtMoney } from '@/lib/utils';
import SettingsCard, { FieldRow } from './SettingsCard';
import type { CurrentUser } from '@/lib/mock-data';
import type { NextPayday } from '@/lib/profile';

interface PayInfoCardProps {
  user: CurrentUser;
  nextPayday: NextPayday;
  onViewStubs?: () => void;
  onChangeBank?: () => void;
}

export default function PayInfoCard({
  user,
  nextPayday,
  onViewStubs,
  onChangeBank,
}: PayInfoCardProps) {
  const action = (
    <button
      onClick={onViewStubs}
      className="flex items-center gap-1.5 h-8 px-3 rounded-full transition-colors hover:opacity-90"
      style={{
        backgroundColor: C.bone,
        color: C.inkSoft,
        border: `1px solid ${C.borderSoft}`,
        fontFamily: FONTS.sans,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      <FileText size={12} strokeWidth={2.2} />
      Pay stubs & W-2
    </button>
  );

  return (
    <SettingsCard
      icon={CreditCard}
      title="Pay & banking"
      description="Direct deposit and pay schedule details."
      action={action}
    >
      <FieldRow
        label="Pay schedule"
        value={user.payInfo.schedule}
        hint={`Next payday · ${nextPayday.label}`}
      />
      <FieldRow
        label="Estimated next net"
        value={
          <span
            className="tabular-nums"
            style={{ fontFamily: FONTS.mono, fontWeight: 500 }}
          >
            {fmtMoney(user.payInfo.estimatedNet)}
          </span>
        }
        hint="Based on submitted entries · subject to withholdings"
      />
      <FieldRow
        label="Payment method"
        value={user.payInfo.paymentMethod}
        badge={
          <span
            className="text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider"
            style={{ backgroundColor: '#E5E5E5', color: '#0A0A0A', fontFamily: FONTS.sans }}
          >
            Verified
          </span>
        }
      />
      <FieldRow
        label="Deposit account"
        value={
          <span className="flex items-center gap-2">
            <Building2 size={13} strokeWidth={2} style={{ color: C.muted }} />
            <span style={{ fontFamily: FONTS.sans }}>{user.payInfo.bankName}</span>
            <span
              className="tabular-nums text-[12px]"
              style={{ color: C.muted, fontFamily: FONTS.mono }}
            >
              ····{user.payInfo.accountLast4}
            </span>
          </span>
        }
        trailing={
          <button
            onClick={onChangeBank}
            className="text-[12px] underline-offset-2 hover:underline"
            style={{ color: C.inkSoft, fontFamily: FONTS.sans }}
          >
            Change
          </button>
        }
      />
    </SettingsCard>
  );
}
