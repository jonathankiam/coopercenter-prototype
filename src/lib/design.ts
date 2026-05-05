// Status type and human-readable labels.
// Visual styling for status now lives in <StatusBadge> (src/components/StatusBadge.tsx)
// using shadcn's Badge primitive.

export type EntryStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'submitted' | 'paid';

export const STATUS_LABELS: Record<EntryStatus, string> = {
  draft:     'Draft',
  pending:   'Pending',
  approved:  'Approved',
  rejected:  'Rejected',
  submitted: 'Submitted',
  paid:      'Paid',
};
