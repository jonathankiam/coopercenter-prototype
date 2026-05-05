'use client';

import { Switch } from '@/components/ui/switch';

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  size?: 'sm' | 'md'; // unused — shadcn Switch is single size
}

// Thin wrapper preserving the original onChange signature so call sites don't
// need to migrate to onCheckedChange. Internally delegates to shadcn Switch.
export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      aria-label={label}
    />
  );
}
