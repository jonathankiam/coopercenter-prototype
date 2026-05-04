// Design tokens — single source of truth for the bone/cream/ink palette.
// Mirrors the original prototype so visual language stays consistent across
// the legacy mobile screen and the new desktop shell.

export const C = {
  bone: '#EFEBE2',
  cream: '#F8F5EE',
  paper: '#FBF9F4',
  ink: '#1A1612',
  inkSoft: '#3D3730',
  muted: '#8B8275',
  mutedSoft: '#B5AC9E',
  border: '#E0DAD0',
  borderSoft: '#EBE5DA',
  lime: '#D4FF3F',
  limeDeep: '#B8E62E',
  clay: '#C75D3F',
  moss: '#6B7F3A',
  amber: '#E8A33D',
  ocean: '#3B6E7F',
  rose: '#D4847A',
} as const;

export type EntryStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'submitted' | 'paid';

export const STATUS_META: Record<EntryStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: 'Draft',     color: C.muted,  bg: '#EBE5DA' },
  pending:   { label: 'Pending',   color: '#8A6420', bg: '#F5E5C5' },
  approved:  { label: 'Approved',  color: '#3F5320', bg: '#DDE8C4' },
  rejected:  { label: 'Rejected',  color: '#7A2A1A', bg: '#F0CFC5' },
  submitted: { label: 'Submitted', color: '#8A6420', bg: '#F5E5C5' },
  paid:      { label: 'Paid',      color: '#2C4A1F', bg: '#C8DCA8' },
};

export const FONTS = {
  sans: 'Geist, system-ui, sans-serif',
  serif: 'Instrument Serif, serif',
  mono: 'JetBrains Mono, ui-monospace, monospace',
} as const;
