import { MapPin, Mail, Phone, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { CurrentUser } from '@/lib/mock-data';

interface ProfileHeroProps {
  user: CurrentUser;
  activeAssignmentCount: number;
}

export default function ProfileHero({ user, activeAssignmentCount }: ProfileHeroProps) {
  return (
    <Card className="flex-row items-center gap-6 px-6 py-6 mb-3 shadow-none">
      <Avatar className="size-24 rounded-2xl shrink-0">
        <AvatarImage src={undefined} alt={user.fullName} />
        <AvatarFallback className="rounded-2xl bg-foreground text-background text-2xl font-semibold">
          {user.initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h2 className="text-3xl font-semibold tracking-tight leading-none">
          {user.fullName}
        </h2>
        <div className="text-[13px] mt-2 flex items-center gap-2 flex-wrap text-muted-foreground">
          <span className="text-foreground font-medium">{user.role}</span>
          <span>·</span>
          <span>Employee ID {user.employeeId}</span>
          <span>·</span>
          <span>{user.region}</span>
        </div>

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

function ContactChip({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <Badge variant="outline" className="gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-normal">
      <Icon size={11} strokeWidth={2.2} className="text-muted-foreground" />
      <span className="text-foreground">{value}</span>
    </Badge>
  );
}
