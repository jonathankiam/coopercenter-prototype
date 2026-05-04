import { MapPin, Mail, Phone, Briefcase } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import type { CurrentUser } from '@/lib/mock-data';

interface ProfileHeroProps {
  user: CurrentUser;
  activeAssignmentCount: number;
}

export default function ProfileHero({ user, activeAssignmentCount }: ProfileHeroProps) {
  return (
    <div
      className="rounded-2xl p-6 mb-3 flex items-center gap-6"
      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
    >
      {/* Avatar */}
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: C.ink,
          color: C.lime,
          fontFamily: FONTS.serif,
          fontSize: 44,
          fontStyle: 'italic',
          fontWeight: 400,
        }}
      >
        {user.initials}
      </div>

      {/* Identity */}
      <div className="flex-1 min-w-0">
        <h1
          className="text-[36px] tracking-tight leading-none"
          style={{ color: C.ink, fontFamily: FONTS.serif }}
        >
          {user.fullName}
        </h1>
        <div
          className="text-[13px] mt-2 flex items-center gap-2 flex-wrap"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          <span style={{ color: C.inkSoft, fontWeight: 500 }}>{user.role}</span>
          <span>·</span>
          <span>Employee ID {user.employeeId}</span>
          <span>·</span>
          <span>{user.region}</span>
        </div>

        {/* Contact chips */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <ContactChip icon={Briefcase} value={`${activeAssignmentCount} active assignments`} />
          <ContactChip icon={Mail} value={user.email} />
          <ContactChip icon={Phone} value={user.phone} />
          <ContactChip icon={MapPin} value={`${user.address.city}, ${user.address.state}`} />
        </div>
      </div>
    </div>
  );
}

function ContactChip({ icon: Icon, value }: { icon: typeof Mail; value: string }) {
  return (
    <span
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
      style={{
        backgroundColor: C.bone,
        color: C.inkSoft,
        border: `1px solid ${C.borderSoft}`,
        fontFamily: FONTS.sans,
      }}
    >
      <Icon size={11} strokeWidth={2.2} style={{ color: C.muted }} />
      {value}
    </span>
  );
}
