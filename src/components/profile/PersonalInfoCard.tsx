import { User, Pencil } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import type { CurrentUser } from '@/lib/mock-data';

interface PersonalInfoCardProps {
  user: CurrentUser;
  onEditField?: (field: string) => void;
}

export default function PersonalInfoCard({ user, onEditField }: PersonalInfoCardProps) {
  const editButton = (field: string) => (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => onEditField?.(field)}
      title={`Edit ${field}`}
      aria-label={`Edit ${field}`}
      className="text-muted-foreground"
    >
      <Pencil size={11} strokeWidth={2.4} />
    </Button>
  );

  return (
    <Card className="shadow-none gap-0 py-0">
      <CardHeader className="flex-row items-center gap-3 px-5 py-3.5 border-b">
        <span className="flex-shrink-0 size-8 rounded-md flex items-center justify-center bg-muted text-foreground">
          <User size={15} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <CardTitle className="text-sm leading-tight">
            Personal information
          </CardTitle>
          <p className="text-[11px] mt-0.5 text-muted-foreground font-normal">
            Contact details and emergency contact on file.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <FieldRow
          label="Full name"
          value={user.fullName}
          trailing={editButton('name')}
        />
        <FieldRow
          label="Email"
          value={user.email}
          hint="Used for pay statements and reset codes"
          trailing={editButton('email')}
        />
        <FieldRow
          label="Phone"
          value={user.phone}
          hint="Used for shift reminders"
          trailing={editButton('phone')}
        />
        <FieldRow
          label="Mailing address"
          value={
            <span>
              {user.address.line1}
              <br />
              {user.address.city}, {user.address.state} {user.address.zip}
            </span>
          }
          trailing={editButton('address')}
        />
        <FieldRow
          label="Emergency contact"
          value={user.emergencyContact.name}
          hint={`${user.emergencyContact.relation} · ${user.emergencyContact.phone}`}
          trailing={editButton('emergency contact')}
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
