import { CreditCard, FileText, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <Button onClick={onViewStubs} variant="outline" size="sm" className="gap-1.5">
      <FileText className="size-3" />
      Pay stubs & W-2
    </Button>
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
          <span className="tabular-nums font-mono font-medium">
            {fmtMoney(user.payInfo.estimatedNet)}
          </span>
        }
        hint="Based on submitted entries · subject to withholdings"
      />
      <FieldRow
        label="Payment method"
        value={user.payInfo.paymentMethod}
        badge={
          <Badge
            variant="outline"
            className="uppercase tracking-wide text-[9px] bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60"
          >
            Verified
          </Badge>
        }
      />
      <FieldRow
        label="Deposit account"
        value={
          <span className="flex items-center gap-2">
            <Building2 className="size-3.5 text-muted-foreground" />
            <span>{user.payInfo.bankName}</span>
            <span className="tabular-nums text-xs text-muted-foreground font-mono">
              ····{user.payInfo.accountLast4}
            </span>
          </span>
        }
        trailing={
          <Button
            onClick={onChangeBank}
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
          >
            Change
          </Button>
        }
      />
    </SettingsCard>
  );
}
