import { MapPin, Mail, Phone, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { CurrentUser } from '@/lib/mock-data';

interface ProfileHeroProps {
  user: CurrentUser;
  activeAssignmentCount: number;
}

export default function ProfileHero({ user, activeAssignmentCount }: ProfileHeroProps) {
  return (
    <Card className="flex flex-row items-center gap-6 p-6 mb-3">
      {/* Avatar */}
      <Avatar className="size-24 rounded-2xl">
        <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-semibold rounded-2xl">
          {user.initials}
        </AvatarFallback>
      </Avatar>

      {/* Identity */}
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-semibold tracking-tight leading-none">{user.fullName}</h1>
        <div className="text-sm mt-2 flex items-center gap-2 flex-wrap text-muted-foreground">
          <span className="text-foreground font-medium">{user.role}</span>
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
    </Card>
  );
}

function ContactChip({ icon: Icon, value }: { icon: typeof Mail; value: string }) {
  return (
    <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-[11px] font-normal h-auto">
      <Icon className="size-3 text-muted-foreground" />
      {value}
    </Badge>
  );
}
