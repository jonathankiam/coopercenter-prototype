import { User, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SettingsCard, { FieldRow } from './SettingsCard';
import type { CurrentUser } from '@/lib/mock-data';

interface PersonalInfoCardProps {
  user: CurrentUser;
  onEditField?: (field: string) => void;
}

export default function PersonalInfoCard({ user, onEditField }: PersonalInfoCardProps) {
  const editButton = (field: string) => (
    <Button
      onClick={() => onEditField?.(field)}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground"
      title={`Edit ${field}`}
      aria-label={`Edit ${field}`}
    >
      <Pencil className="size-3" />
    </Button>
  );

  return (
    <SettingsCard
      icon={User}
      title="Personal information"
      description="Contact details and emergency contact on file."
    >
      <FieldRow label="Full name" value={user.fullName} trailing={editButton('name')} />
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
      />
    </SettingsCard>
  );
}
