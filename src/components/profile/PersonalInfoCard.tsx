import { User, Pencil } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import SettingsCard, { FieldRow } from './SettingsCard';
import type { CurrentUser } from '@/lib/mock-data';

interface PersonalInfoCardProps {
  user: CurrentUser;
  onEditField?: (field: string) => void;
}

export default function PersonalInfoCard({ user, onEditField }: PersonalInfoCardProps) {
  const editButton = (field: string) => (
    <button
      onClick={() => onEditField?.(field)}
      className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/60"
      style={{ color: C.muted }}
      title={`Edit ${field}`}
      aria-label={`Edit ${field}`}
    >
      <Pencil size={11} strokeWidth={2.4} />
    </button>
  );

  return (
    <SettingsCard
      icon={User}
      title="Personal information"
      description="Contact details and emergency contact on file."
    >
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
          <span style={{ fontFamily: FONTS.sans }}>
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
