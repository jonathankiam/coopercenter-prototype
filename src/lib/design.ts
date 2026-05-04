// Design tokens — monochrome wireframe palette.
// Original keys preserved so existing components keep importing the same
// names; values remapped to pure greyscale (no chroma) so the prototype
// reads as a basic black/white/grey wireframe.
//
// When components are migrated to shadcn primitives, these will be replaced
// with semantic shadcn tokens (--background, --foreground, --muted, etc.).

export const C = {
  bone:       '#FFFFFF', // page background
  cream:      '#FAFAFA', // surfaces just above the page
  paper:      '#FFFFFF', // card background
  ink:        '#0A0A0A', // primary text
  inkSoft:    '#404040', // secondary text
  muted:      '#737373', // muted/meta text
  mutedSoft:  '#A3A3A3', // disabled / placeholder
  border:     '#E5E5E5', // hairline borders
  borderSoft: '#F0F0F0', // softest dividers
  lime:       '#171717', // primary accent (was lime green) — now near-black
  limeDeep:   '#0A0A0A', // hover state of accent
  clay:       '#525252', // was clay orange — mid-dark grey
  moss:       '#525252', // was moss green
  amber:      '#737373', // was amber yellow
  ocean:      '#525252', // was ocean teal
  rose:       '#737373', // was rose pink
} as const;

export type EntryStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'submitted' | 'paid';

// Status badges in pure greyscale — distinguished by tonal weight, not hue.
export const STATUS_META: Record<EntryStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: 'Draft',     color: '#737373', bg: '#F5F5F5' },
  pending:   { label: 'Pending',   color: '#404040', bg: '#E5E5E5' },
  approved:  { label: 'Approved',  color: '#0A0A0A', bg: '#D4D4D4' },
  rejected:  { label: 'Rejected',  color: '#FFFFFF', bg: '#404040' },
  submitted: { label: 'Submitted', color: '#404040', bg: '#E5E5E5' },
  paid:      { label: 'Paid',      color: '#FFFFFF', bg: '#0A0A0A' },
};

export const FONTS = {
  sans: 'Geist, system-ui, sans-serif',
  serif: 'Instrument Serif, serif',
  mono: 'JetBrains Mono, ui-monospace, monospace',
} as const;
