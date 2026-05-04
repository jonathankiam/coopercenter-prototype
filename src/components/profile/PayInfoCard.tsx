import { CreditCard, FileText, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fmtMoney } from '@/lib/utils';
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
  return (
    <Card className="shadow-none gap-0 py-0">
      <CardHeader className="flex-row items-center justify-between gap-4 px-5 py-3.5 border-b">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex-shrink-0 size-8 rounded-md flex items-center justify-center bg-muted text-foreground">
            <CreditCard size={15} strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-sm leading-tight">
              Pay &amp; banking
            </CardTitle>
            <p className="text-[11px] mt-0.5 text-muted-foreground font-normal">
              Direct deposit and pay schedule details.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onViewStubs}>
          <FileText size={12} strokeWidth={2.2} />
          Pay stubs &amp; W-2
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <FieldRow
          label="Pay schedule"
          value={user.payInfo.schedule}
          hint={`Next payday · ${nextPayday.label}`}
        />
        <FieldRow
          label="Estimated next net"
          value={
            <span className="font-mono tabular-nums font-medium">
              {fmtMoney(user.payInfo.estimatedNet)}
            </span>
          }
          hint="Based on submitted entries · subject to withholdings"
        />
        <FieldRow
          label="Payment method"
          value={user.payInfo.paymentMethod}
          badge={
            <Badge variant="secondary" className="text-[9px] uppercase tracking-wider rounded">
              Verified
            </Badge>
          }
        />
        <FieldRow
          label="Deposit account"
          value={
            <span className="flex items-center gap-2">
              <Building2 size={13} strokeWidth={2} className="text-muted-foreground" />
              <span>{user.payInfo.bankName}</span>
              <span className="font-mono tabular-nums text-[12px] text-muted-foreground">
                ····{user.payInfo.accountLast4}
              </span>
            </span>
          }
          trailing={
            <Button
              variant="link"
              size="sm"
              onClick={onChangeBank}
              className="h-auto p-0 text-[12px] text-foreground"
            >
              Change
            </Button>
          }
          last
        />
      </CardContent>
    </Card>
  );
}

function FieldRow({
  label,
  value,
  hint,
  badge,
  trailing,
  last = false,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  badge?: React.ReactNode;
  trailing?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[180px_1fr_auto] items-start gap-4 px-5 py-3 ${
        last ? '' : 'border-b'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        {badge}
      </div>
      <div className="min-w-0">
        <div className="text-[13px] text-foreground">{value}</div>
        {hint && (
          <div className="text-[11px] mt-0.5 text-muted-foreground">{hint}</div>
        )}
      </div>
      {trailing && <div className="flex items-center">{trailing}</div>}
    </div>
  );
}
