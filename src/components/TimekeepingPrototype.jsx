'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Clock, Calendar, CalendarDays, Receipt, User, Plus, Check, X, ChevronRight, ChevronLeft, ChevronDown,
  MapPin, Camera, ArrowUpRight, MoreHorizontal, FileText, CreditCard,
  Briefcase, Zap, AlertCircle, ArrowRight, Sparkles, TrendingUp, Settings,
  Bell, LogOut, Edit3, Trash2, Coffee, Fuel, Wrench, Utensils, Car, Upload, Image as ImageIcon
} from 'lucide-react';

// — — — DESIGN TOKENS — — —
const C = {
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
};

// — — — MOCK DATA — — —
const JOBS = [
  { id: 1, name: 'Goose Manufacturing', client: 'Goose Manufacturing', code: 'GSE-2104', color: C.clay, type: 'Hourly + OT', kind: 'live', location: '847 Industrial Pkwy', rate: 26.50,
    paycodes: ['Regular', 'Overtime', 'Double Time', 'Holiday'],
    costCenters: ['Production - Line A', 'Production - Line B', 'Maintenance', 'QA / Inspection'] },
  { id: 2, name: 'Plant Academy · Greenhouse Lead', client: 'Plant Academy', code: 'PA-GHL', color: C.moss, type: 'Manual Punch', kind: 'manual', location: 'Greenhouse Pavilion', rate: 38.00,
    paycodes: ['Regular', 'Overtime', 'Holiday'],
    costCenters: ['Adult Programs', 'Youth Programs', 'Corporate Workshops'] },
  { id: 3, name: 'Plant Academy · Field Workshop', client: 'Plant Academy', code: 'PA-FW', color: C.amber, type: 'Manual Punch', kind: 'manual', location: 'Outdoor Field Sites', rate: 26.00,
    paycodes: ['Regular', 'Overtime', 'Travel'],
    costCenters: ['Adult Programs', 'Youth Programs', 'Off-site'] },
  { id: 4, name: 'Plant Academy · Lab Prep', client: 'Plant Academy', code: 'PA-LP', color: C.ocean, type: 'Manual Punch', kind: 'manual', location: 'Curriculum Lab, Bldg C', rate: 22.00,
    paycodes: ['Regular', 'Overtime'],
    costCenters: ['Curriculum Dev', 'Materials Prep', 'Inventory'] },
];

const todayDate = new Date();
const dayMs = 86400000;

// Resolve a date by offset from this week (0 = current Sun-Sat) and day-of-week (0 = Sun)
const dayOf = (weekOffset, dayOfWeek) => {
  const d = new Date(todayDate);
  d.setHours(12, 0, 0, 0); // noon avoids DST edge cases
  d.setDate(d.getDate() - d.getDay() + dayOfWeek + weekOffset * 7);
  return d;
};

const MOCK_ENTRIES = [
  // 4 days ago — Goose live shift, slight OT (already submitted in prior cycle)
  { id: 1, jobId: 1, date: new Date(todayDate.getTime() - 4 * dayMs), start: '07:02', end: '15:30', hours: 8.5, regularH: 8.0, otH: 0.5, dtH: 0, status: 'approved', note: '' },

  // 3 days ago — TWO Plant Academy assignments same day (already approved)
  { id: 2, jobId: 2, date: new Date(todayDate.getTime() - 3 * dayMs), start: '09:00', end: '13:00', hours: 4.0, regularH: 4.0, otH: 0, dtH: 0, status: 'approved', note: 'Morning workshop session', paycode: 'Regular', costCenter: 'Adult Programs' },
  { id: 3, jobId: 4, date: new Date(todayDate.getTime() - 3 * dayMs), start: '14:00', end: '17:00', hours: 3.0, regularH: 3.0, otH: 0, dtH: 0, status: 'approved', note: 'Curriculum prep for next week', paycode: 'Regular', costCenter: 'Curriculum Dev' },

  // 2 days ago — Goose MULTI-PUNCH long day, drafts (still being reviewed by Jerry)
  { id: 4, jobId: 1, date: new Date(todayDate.getTime() - 2 * dayMs), start: '06:00', end: '11:00', hours: 5.0, regularH: 5.0, otH: 0, dtH: 0, status: 'draft', note: 'Morning shift' },
  { id: 5, jobId: 1, date: new Date(todayDate.getTime() - 2 * dayMs), start: '11:30', end: '19:30', hours: 8.0, regularH: 3.0, otH: 4.0, dtH: 1.0, status: 'draft', note: 'Stayed for emergency line repair — no relief crew available' },

  // 1 day ago — Plant Academy Field Workshop, draft
  { id: 6, jobId: 3, date: new Date(todayDate.getTime() - 1 * dayMs), start: '08:00', end: '16:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'draft', note: 'Outdoor youth workshop · weather cooperated', paycode: 'Regular', costCenter: 'Youth Programs' },

  // TODAY — all drafts; status will progress as Jerry submits each client's timecard
  { id: 7, jobId: 1, date: todayDate, start: '06:30', end: '10:30', hours: 4.0, regularH: 4.0, otH: 0, dtH: 0, status: 'draft', note: 'Morning shift' },
  { id: 8, jobId: 2, date: todayDate, start: '11:30', end: '13:30', hours: 2.0, regularH: 2.0, otH: 0, dtH: 0, status: 'draft', note: 'Adult workshop · short session', paycode: 'Regular', costCenter: 'Adult Programs' },
  { id: 9, jobId: 4, date: todayDate, start: '14:00', end: '16:00', hours: 2.0, regularH: 2.0, otH: 0, dtH: 0, status: 'draft', note: '', paycode: 'Regular', costCenter: 'Curriculum Dev' },

  // — — — WEEK OF APR 12 (2 weeks ago) — fully paid cycle
  { id: 100, jobId: 1, date: dayOf(-2, 1), start: '07:00', end: '15:30', hours: 8.5, regularH: 8.0, otH: 0.5, dtH: 0, status: 'paid', note: '' },
  { id: 101, jobId: 2, date: dayOf(-2, 2), start: '09:00', end: '13:00', hours: 4.0, regularH: 4.0, otH: 0, dtH: 0, status: 'paid', note: 'Adult workshop morning', paycode: 'Regular', costCenter: 'Adult Programs' },
  { id: 102, jobId: 4, date: dayOf(-2, 2), start: '14:00', end: '17:00', hours: 3.0, regularH: 3.0, otH: 0, dtH: 0, status: 'paid', note: '', paycode: 'Regular', costCenter: 'Curriculum Dev' },
  { id: 103, jobId: 1, date: dayOf(-2, 3), start: '07:00', end: '15:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'paid', note: '' },
  { id: 104, jobId: 3, date: dayOf(-2, 4), start: '08:00', end: '16:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'paid', note: 'Field workshop · adult intensive', paycode: 'Regular', costCenter: 'Adult Programs' },
  { id: 105, jobId: 1, date: dayOf(-2, 5), start: '07:00', end: '15:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'paid', note: '' },

  // — — — WEEK OF APR 19 (last week) — submitted, pending approval
  { id: 110, jobId: 1, date: dayOf(-1, 1), start: '07:00', end: '15:30', hours: 8.5, regularH: 8.0, otH: 0.5, dtH: 0, status: 'pending', note: '' },
  { id: 111, jobId: 2, date: dayOf(-1, 2), start: '09:00', end: '13:00', hours: 4.0, regularH: 4.0, otH: 0, dtH: 0, status: 'pending', note: 'Adult workshop', paycode: 'Regular', costCenter: 'Adult Programs' },
  { id: 112, jobId: 1, date: dayOf(-1, 3), start: '06:00', end: '15:30', hours: 9.5, regularH: 8.0, otH: 1.5, dtH: 0, status: 'pending', note: 'Early start · OT for line changeover' },
  { id: 113, jobId: 3, date: dayOf(-1, 4), start: '08:00', end: '16:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'pending', note: 'Youth workshop', paycode: 'Regular', costCenter: 'Youth Programs' },
  { id: 114, jobId: 1, date: dayOf(-1, 5), start: '07:00', end: '15:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'pending', manuallyEntered: true, note: 'Forgot to clock in · backfilled at end of day' },

  // — — — WEEK OF MAY 3 (next week) — drafts only, scheduled in advance
  { id: 120, jobId: 1, date: dayOf(1, 1), start: '07:00', end: '15:00', hours: 8.0, regularH: 8.0, otH: 0, dtH: 0, status: 'draft', note: 'Pre-scheduled shift' },
  { id: 121, jobId: 2, date: dayOf(1, 2), start: '09:00', end: '13:00', hours: 4.0, regularH: 4.0, otH: 0, dtH: 0, status: 'draft', note: 'Workshop on the books', paycode: 'Regular', costCenter: 'Adult Programs' },
];

// IRS standard mileage rate (2024–25) — hardcoded for prototype, server-driven in production
const MILEAGE_RATE = 0.67;

const EXPENSE_CATEGORIES = [
  'Meals',
  'Lodging',
  'Parking',
  'Tolls',
  'Supplies',
  'Equipment',
  'Phone / Internet',
  'Training',
  'Other',
];

// Expense items are the atomic units. Each carries a kind (regular | mileage), a jobId for client
// routing, and a reportId tying it to its pay-period bundle.
const MOCK_EXPENSES = [
  // — — — Apr 12 week (paid cycle) —
  { id: 1, kind: 'regular', jobId: 1, reportId: 'rpt-apr12-goose',
    date: dayOf(-2, 1), amount: 42.50, category: 'Meals', vendor: 'Sunrise Diner',
    receipt: { type: 'placeholder', label: 'IMG_4421.jpg' }, note: '' },
  { id: 2, kind: 'mileage', jobId: 1, reportId: 'rpt-apr12-goose',
    date: dayOf(-2, 2), miles: 38, tripFrom: 'Office', tripTo: 'Goose plant', amount: 38 * MILEAGE_RATE,
    receipt: { type: 'placeholder', label: 'odometer_apr12.jpg' }, note: 'Site visit + return' },
  { id: 3, kind: 'regular', jobId: 3, reportId: 'rpt-apr12-pa',
    date: dayOf(-2, 3), amount: 87.20, category: 'Supplies', vendor: 'Garden Supply Co.',
    receipt: { type: 'placeholder', label: 'IMG_4438.jpg' }, note: 'Field workshop materials' },

  // — — — Apr 19 week (pending) —
  { id: 4, kind: 'regular', jobId: 1, reportId: 'rpt-apr19-goose',
    date: dayOf(-1, 2), amount: 18.00, category: 'Parking', vendor: 'LAZ Lot 14',
    receipt: { type: 'placeholder', label: 'IMG_4452.jpg' }, note: '' },
  { id: 5, kind: 'mileage', jobId: 2, reportId: 'rpt-apr19-pa',
    date: dayOf(-1, 4), miles: 22, tripFrom: 'Curriculum Lab', tripTo: 'Outdoor field site', amount: 22 * MILEAGE_RATE,
    receipt: { type: 'placeholder', label: 'odometer_apr24.jpg' }, note: 'Drove to field site for youth workshop' },

  // — — — Current week (drafts, not yet submitted) —
  { id: 6, kind: 'regular', jobId: 2, reportId: 'rpt-apr27-pa',
    date: todayDate, amount: 12.50, category: 'Meals', vendor: 'Roasters Co.',
    receipt: { type: 'placeholder', label: 'IMG_4461.jpg' }, note: 'Crew coffee run' },
  { id: 7, kind: 'mileage', jobId: 1, reportId: 'rpt-apr27-goose',
    date: new Date(todayDate.getTime() - 2 * dayMs), miles: 14, tripFrom: 'Home', tripTo: 'Goose plant',
    amount: 14 * MILEAGE_RATE,
    receipt: { type: 'placeholder', label: 'odometer_apr28.jpg' }, note: '' },
];

const MOCK_REPORTS = [
  // Apr 12 — paid both clients
  { id: 'rpt-apr12-goose',  client: 'Goose Manufacturing', weekStart: dayOf(-2, 0), status: 'paid' },
  { id: 'rpt-apr12-pa',     client: 'Plant Academy',       weekStart: dayOf(-2, 0), status: 'paid' },
  // Apr 19 — submitted, supervisor reviewing
  { id: 'rpt-apr19-goose',  client: 'Goose Manufacturing', weekStart: dayOf(-1, 0), status: 'pending' },
  { id: 'rpt-apr19-pa',     client: 'Plant Academy',       weekStart: dayOf(-1, 0), status: 'pending' },
  // Current week — drafts in progress
  { id: 'rpt-apr27-goose',  client: 'Goose Manufacturing', weekStart: dayOf(0, 0), status: 'draft' },
  { id: 'rpt-apr27-pa',     client: 'Plant Academy',       weekStart: dayOf(0, 0), status: 'draft' },
];

// — — — UTIL — — —
const fmtTime = (s) => {
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${h}:${m}:${sec}`;
};
const fmtHours = (h) => `${h.toFixed(1)}h`;
const dayLabel = (d) => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()];
const dayNum = (d) => d.getDate();
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const monthName = (d) => d.toLocaleDateString('en-US', { month: 'long' });

// Compute regular/OT/DT breakdown across a list of entries
const computeBreakdown = (entries) => entries.reduce((acc, e) => ({
  total: acc.total + e.hours,
  regular: acc.regular + (e.regularH ?? e.hours),
  ot: acc.ot + (e.otH ?? 0),
  dt: acc.dt + (e.dtH ?? 0),
}), { total: 0, regular: 0, ot: 0, dt: 0 });

// True when an entry was manually backfilled at a live-clock-in/out assignment.
// We don't show the Manual badge for assignments that are inherently manual (Plant Academy)
// because every entry there is manual by definition — the badge would just be noise.
const isBackfilledLivePunch = (entry, jobs) => {
  if (!entry?.manuallyEntered) return false;
  const job = jobs.find(j => j.id === entry.jobId);
  return job?.kind === 'live';
};

const STATUS_META = {
  draft:     { label: 'Draft',     color: C.muted, bg: '#EBE5DA' },
  pending:   { label: 'Pending',   color: '#8A6420', bg: '#F5E5C5' },
  approved:  { label: 'Approved',  color: '#3F5320', bg: '#DDE8C4' },
  rejected:  { label: 'Rejected',  color: '#7A2A1A', bg: '#F0CFC5' },
  submitted: { label: 'Submitted', color: '#8A6420', bg: '#F5E5C5' },
  paid:      { label: 'Paid',      color: '#2C4A1F', bg: '#C8DCA8' },
};

// Worker-facing status mapping (used in Today's Entries — workers think in terms
// of "did I submit it" and "did I get paid", not in approval-pipeline terms).
const workerFacingStatus = (s) => {
  if (s === 'draft') return 'draft';
  if (s === 'paid') return 'paid';
  if (s === 'rejected') return 'rejected';
  return 'submitted'; // pending and approved both surface as "Submitted" to the worker
};

// — — — SHARED COMPONENTS — — —
const StatusPill = ({ status, size = 'sm' }) => {
  const m = STATUS_META[status];
  const sz = size === 'sm' ? 'text-[10px] px-2 py-[3px]' : 'text-xs px-2.5 py-1';
  return (
    <span
      className={`${sz} rounded-full font-medium tracking-wider uppercase`}
      style={{ color: m.color, backgroundColor: m.bg, fontFamily: 'Geist, system-ui, sans-serif' }}
    >
      {m.label}
    </span>
  );
};

// Indicates an entry was manually entered/backfilled rather than captured live.
// Surfaces on every entry view so supervisors and workers know the audit context.
const ManualBadge = ({ size = 'sm' }) => {
  const dims = size === 'sm'
    ? { fontSize: 9, px: 'px-1.5', py: 'py-0.5', icon: 9 }
    : { fontSize: 10, px: 'px-2', py: 'py-0.5', icon: 10 };
  return (
    <span
      className={`${dims.px} ${dims.py} rounded inline-flex items-center gap-1 font-medium tracking-wider uppercase`}
      style={{
        backgroundColor: C.bone,
        color: C.inkSoft,
        border: `1px solid ${C.borderSoft}`,
        fontSize: dims.fontSize,
        fontFamily: 'Geist, system-ui, sans-serif',
      }}
    >
      <Edit3 size={dims.icon} strokeWidth={2.5} />
      Manual
    </span>
  );
};

const JobChip = ({ job, selected, onClick }) => (
  <button
    onClick={onClick}
    className="flex-shrink-0 transition-all duration-200 active:scale-95"
    style={{
      backgroundColor: selected ? C.ink : C.paper,
      color: selected ? C.cream : C.ink,
      border: `1px solid ${selected ? C.ink : C.border}`,
      borderRadius: '14px',
      padding: '10px 14px',
      fontFamily: 'Geist, system-ui, sans-serif',
    }}
  >
    <div className="flex items-center gap-2.5">
      <span
        className="block rounded-full"
        style={{ width: 10, height: 10, backgroundColor: job.color, boxShadow: selected ? `0 0 0 2px ${C.cream}40` : 'none' }}
      />
      <div className="text-left">
        <div className="text-[13px] font-medium leading-tight whitespace-nowrap">{job.name}</div>
        <div className="text-[10px] opacity-60 tracking-wider mt-0.5">{job.code} · {job.type}</div>
      </div>
    </div>
  </button>
);

// Compact dropdown selector that matches the bone/ink aesthetic
const SelectField = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full text-left rounded-2xl px-4 py-3 transition-colors"
        style={{
          backgroundColor: C.bone,
          border: `1px solid ${open ? C.ink : C.borderSoft}`,
        }}
      >
        <div className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
          {label}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-medium truncate" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
            {value || '—'}
          </span>
          <ChevronDown
            size={14}
            style={{
              color: C.muted,
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
              flexShrink: 0,
            }}
          />
        </div>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute z-20 mt-1.5 left-0 right-0 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: C.paper,
              border: `1px solid ${C.border}`,
              boxShadow: `0 12px 32px -8px ${C.ink}40`,
            }}
          >
            {options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors"
                style={{
                  backgroundColor: value === opt ? C.cream : 'transparent',
                  borderTop: i > 0 ? `1px solid ${C.borderSoft}` : 'none',
                  color: C.ink,
                  fontFamily: 'Geist, system-ui, sans-serif',
                  fontSize: 13,
                }}
              >
                <span>{opt}</span>
                {value === opt && <Check size={12} style={{ color: C.moss }} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// — — — MANUAL PUNCH CONTENT — — —
const ManualPunchContent = ({ selectedJob, todayEntries, onSubmit }) => {
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('16:30');
  const [paycode, setPaycode] = useState(selectedJob.paycodes?.[0] || 'Regular');
  const [costCenter, setCostCenter] = useState(selectedJob.costCenters?.[0] || 'General');
  const [comment, setComment] = useState('');

  // Reset paycode/costCenter when assignment changes (each client has different lists)
  useEffect(() => {
    setPaycode(selectedJob.paycodes?.[0] || 'Regular');
    setCostCenter(selectedJob.costCenters?.[0] || 'General');
  }, [selectedJob.id]);

  const parseMin = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const newStart = parseMin(start);
  const newEnd = parseMin(end);
  const totalHours = Math.max(0, (newEnd - newStart) / 60);

  // Detect overlap with any existing entry today (any job)
  const conflict = todayEntries.find(e => {
    const eStart = parseMin(e.start);
    const eEnd = parseMin(e.end);
    return newStart < eEnd && newEnd > eStart;
  });

  const earned = totalHours * selectedJob.rate;
  const valid = totalHours > 0 && !conflict;

  const TimeField = ({ label, value, onChange }) => (
    <div
      className="rounded-2xl px-4 py-3"
      style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}` }}
    >
      <div className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
        {label}
      </div>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent w-full focus:outline-none tabular-nums"
        style={{
          color: C.ink,
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 22,
          fontWeight: 400,
          letterSpacing: '-0.01em',
        }}
      />
    </div>
  );

  return (
    <>
      {/* Time inputs */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <TimeField label="Start" value={start} onChange={setStart} />
        <TimeField label="End" value={end} onChange={setEnd} />
      </div>

      {/* Conflict warning */}
      {conflict && (
        <div
          className="mb-4 p-3 rounded-2xl flex items-start gap-2.5"
          style={{ backgroundColor: '#F0CFC5', border: '1px solid #E5B5A8' }}
        >
          <AlertCircle size={16} style={{ color: '#7A2A1A', flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium" style={{ color: '#7A2A1A', fontFamily: 'Geist, system-ui, sans-serif' }}>
              Overlaps an existing entry
            </div>
            <div className="text-[11px] mt-0.5 tabular-nums" style={{ color: '#9A4A3A', fontFamily: 'Geist, system-ui, sans-serif' }}>
              {conflict.start}–{conflict.end} · {JOBS.find(j => j.id === conflict.jobId)?.name}
            </div>
          </div>
        </div>
      )}

      {/* Pay code + Cost center */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <SelectField
          label="Pay code"
          value={paycode}
          options={selectedJob.paycodes || ['Regular']}
          onChange={setPaycode}
        />
        <SelectField
          label="Cost center"
          value={costCenter}
          options={selectedJob.costCenters || ['General']}
          onChange={setCostCenter}
        />
      </div>

      {/* Comments */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
            Comments
          </span>
          <span className="text-[9px]" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
            Optional · {comment.length}/240
          </span>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 240))}
          placeholder="e.g. covered for absent staff, off-site setup, special event..."
          rows={2}
          className="w-full p-3 rounded-2xl text-[13px] resize-none focus:outline-none transition-colors"
          style={{
            backgroundColor: C.bone,
            border: `1px solid ${C.borderSoft}`,
            color: C.ink,
            fontFamily: 'Geist, system-ui, sans-serif',
          }}
          onFocus={(e) => e.target.style.borderColor = C.ink}
          onBlur={(e) => e.target.style.borderColor = C.borderSoft}
        />
      </div>

      {/* Total + earnings display */}
      <div className="flex items-end justify-between mb-5 pb-5 border-b" style={{ borderColor: C.borderSoft }}>
        <div>
          <div className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
            Total today
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className="text-[56px] leading-none tabular-nums tracking-tight"
              style={{
                color: valid ? C.ink : C.mutedSoft,
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontWeight: 300,
                letterSpacing: '-0.02em',
              }}
            >
              {totalHours.toFixed(2)}
            </span>
            <span className="text-lg" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
              hrs
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <Sparkles size={11} style={{ color: valid ? C.moss : C.mutedSoft }} />
            <span className="text-sm tabular-nums font-medium" style={{ color: valid ? C.ink : C.mutedSoft, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
              ${earned.toFixed(2)}
            </span>
          </div>
          <div className="text-[10px] mt-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
            ${selectedJob.rate.toFixed(2)}/hr
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={() => valid && onSubmit({ start, end, hours: totalHours, paycode, costCenter, comment })}
        disabled={!valid}
        className="w-full flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
        style={{
          backgroundColor: valid ? C.ink : C.borderSoft,
          color: valid ? C.cream : C.muted,
          borderRadius: '20px',
          padding: '20px',
          fontFamily: 'Geist, system-ui, sans-serif',
          fontWeight: 600,
          fontSize: '15px',
          letterSpacing: '0.05em',
          boxShadow: valid ? `0 4px 12px -4px ${C.ink}40` : 'none',
          cursor: valid ? 'pointer' : 'not-allowed',
        }}
      >
        <span className="uppercase tracking-[0.15em]">{conflict ? 'Resolve Overlap to Log' : 'Log Punches'}</span>
        {!conflict && <ArrowRight size={16} />}
      </button>
    </>
  );
};

// — — — TODAY VIEW — — —
const TodayView = ({
  selectedJob,
  setSelectedJob,
  clockedIn,
  clockStart,
  elapsed,
  onClockIn,
  onClockOut,
  onSubmitPunch,
  onEditEntry,
  onDeleteEntry,
  allEntries,
  todayEntries,
}) => {
  const [editingEntry, setEditingEntry] = useState(null);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const dateString = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const earned = clockedIn ? (elapsed / 3600) * selectedJob.rate : 0;

  // Open the editing modal for any non-paid today entry. Submitted entries get rescinded
  // back to draft on save (handled at App level via onEditEntry's rescindOnEdit flag).
  const handleEntryTap = (entry) => {
    if (entry.status === 'paid') return; // paid is read-only
    setEditingEntry(entry);
  };

  const handleEditSubmit = (payload) => {
    onEditEntry(payload);
    setEditingEntry(null);
  };

  const handleDelete = (id) => {
    onDeleteEntry(id);
    setEditingEntry(null);
  };

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
          {dateString}
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <h1 className="text-3xl tracking-tight" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400 }}>
            {greeting},
          </h1>
          <span className="text-3xl tracking-tight" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
            Jerry
          </span>
        </div>
      </div>

      {/* Job switcher */}
      <div className="mt-4">
        <div className="px-5 mb-2 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
            Active Assignment
          </span>
          <button className="text-[11px] flex items-center gap-1" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
            All jobs <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex gap-2 px-5 overflow-x-auto pb-2 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {JOBS.map(j => (
            <JobChip key={j.id} job={j} selected={selectedJob.id === j.id} onClick={() => !clockedIn && setSelectedJob(j)} />
          ))}
        </div>
      </div>

      {/* Hero Clock Card */}
      <div className="px-5 mt-5">
        <div
          className="relative transition-all duration-500"
          style={{
            backgroundColor: (selectedJob.kind === 'live' && clockedIn) ? C.ink : C.paper,
            border: `1px solid ${(selectedJob.kind === 'live' && clockedIn) ? C.ink : C.border}`,
            borderRadius: '28px',
            padding: '28px 24px 24px',
          }}
        >
          {/* Top row: status + location */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {selectedJob.kind === 'live' && clockedIn && (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: C.lime }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: C.lime }} />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: C.lime, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    On the clock
                  </span>
                </>
              )}
              {selectedJob.kind === 'live' && !clockedIn && (
                <>
                  <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: C.mutedSoft }} />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    Ready to start
                  </span>
                </>
              )}
              {selectedJob.kind === 'manual' && (
                <>
                  <Edit3 size={10} style={{ color: C.muted }} />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    Manual entry
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px]" style={{ color: (selectedJob.kind === 'live' && clockedIn) ? C.mutedSoft : C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
              <MapPin size={10} />
              <span className="truncate max-w-[140px]">{selectedJob.location}</span>
            </div>
          </div>

          {/* Selected job */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-1">
              <span className="block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedJob.color }} />
              <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: (selectedJob.kind === 'live' && clockedIn) ? C.mutedSoft : C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                {selectedJob.code} · {selectedJob.type}
              </span>
            </div>
            <div
              className="text-2xl tracking-tight leading-tight"
              style={{ color: (selectedJob.kind === 'live' && clockedIn) ? C.cream : C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}
            >
              {selectedJob.name}
            </div>
          </div>

          {/* Mode-specific content */}
          {selectedJob.kind === 'live' ? (
            <>
              {/* Timer or call to action */}
              {clockedIn ? (
                <div>
                  <div
                    className="text-[64px] leading-none tracking-tight tabular-nums mb-2"
                    style={{ color: C.lime, fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 300, letterSpacing: '-0.02em' }}
                  >
                    {fmtTime(elapsed)}
                  </div>
                  <div className="flex items-baseline justify-between mb-7">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={12} style={{ color: C.lime }} />
                      <span className="text-xs tabular-nums" style={{ color: C.cream, fontFamily: 'Geist, system-ui, sans-serif' }}>
                        ${earned.toFixed(2)} earned
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      ${selectedJob.rate.toFixed(2)}/hr
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-7">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-[64px] leading-none tracking-tight tabular-nums"
                      style={{ color: C.mutedSoft, fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 300, letterSpacing: '-0.02em' }}
                    >
                      00:00:00
                    </span>
                  </div>
                  <div className="text-xs mt-2" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    Tap below to start your shift
                  </div>
                </div>
              )}

              {/* THE BUTTON */}
              <button
                onClick={clockedIn ? onClockOut : onClockIn}
                className="w-full flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                style={{
                  backgroundColor: clockedIn ? C.lime : C.ink,
                  color: clockedIn ? C.ink : C.cream,
                  borderRadius: '20px',
                  padding: '20px',
                  fontFamily: 'Geist, system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  letterSpacing: '0.05em',
                  boxShadow: clockedIn ? `0 8px 24px -4px ${C.lime}80` : `0 4px 12px -4px ${C.ink}40`,
                }}
              >
                <span className="uppercase tracking-[0.15em]">{clockedIn ? 'Clock Out' : 'Clock In'}</span>
                <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <ManualPunchContent selectedJob={selectedJob} todayEntries={todayEntries} onSubmit={onSubmitPunch} />
          )}
        </div>
      </div>

      {/* Today's entries */}
      <div className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
            Today's Entries
          </h3>
          <span className="text-[11px]" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
            {todayEntries.length} {todayEntries.length === 1 ? 'shift' : 'shifts'}
          </span>
        </div>

        {todayEntries.length === 0 ? (
          <div
            className="text-center py-10 rounded-2xl border-dashed"
            style={{ border: `1.5px dashed ${C.border}`, backgroundColor: C.cream }}
          >
            <Clock size={20} style={{ color: C.mutedSoft }} className="mx-auto mb-2" />
            <p className="text-xs" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
              Nothing logged yet — your day starts when you clock in
            </p>
            <button
              className="mt-3 text-[11px] underline underline-offset-2"
              style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}
            >
              Add manual punch instead
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayEntries.map(e => {
              const job = JOBS.find(j => j.id === e.jobId);
              const editable = e.status !== 'paid';
              const Wrapper = editable ? 'button' : 'div';
              return (
                <Wrapper
                  key={e.id}
                  onClick={editable ? () => handleEntryTap(e) : undefined}
                  className={`w-full text-left flex items-center gap-3 p-3.5 rounded-2xl ${editable ? 'active:scale-[0.995] transition-transform' : ''}`}
                  style={{ backgroundColor: C.cream, border: `1px solid ${C.borderSoft}` }}
                >
                  <span className="block w-1 self-stretch rounded-full" style={{ backgroundColor: job.color, minHeight: 32 }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-medium" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                        {job.name}
                      </span>
                      {isBackfilledLivePunch(e, JOBS) && <ManualBadge />}
                    </div>
                    <div className="text-[11px] tabular-nums mt-0.5" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      {e.start} → {e.end} · {fmtHours(e.hours)}
                    </div>
                    {(e.paycode || e.costCenter) && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {e.paycode && (
                          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: C.bone, color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                            {e.paycode}
                          </span>
                        )}
                        {e.costCenter && (
                          <span className="text-[10px]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                            {e.costCenter}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusPill status={workerFacingStatus(e.status)} />
                    {editable && <Edit3 size={11} style={{ color: C.mutedSoft }} />}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        )}
      </div>

      {editingEntry && (
        <AddPunchModal
          initialDate={editingEntry.date}
          jobs={JOBS}
          allEntries={allEntries}
          editingEntry={editingEntry}
          onSubmit={handleEditSubmit}
          onDelete={handleDelete}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </div>
  );
};

// — — — TIMESHEET VIEW — — —
const TimesheetView = ({ entries, onSubmitClient, onAddPunch, onDeletePunch }) => {
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [addPunchOpen, setAddPunchOpen] = useState(false);
  const [addPunchDate, setAddPunchDate] = useState(new Date());
  const [addPunchClient, setAddPunchClient] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);
  startOfWeek.setHours(0, 0, 0, 0);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
  const endOfWeek = weekDays[6];

  // Pay-period gating: today must fall within (or after) the viewed week for submission to unlock.
  // Past weeks can still be submitted (late submission). Future weeks are locked until they begin.
  const isFutureWeek = startOfWeek > today;
  const isCurrentWeek = weekOffset === 0;

  const entriesByDay = weekDays.map(d => ({
    date: d,
    entries: entries.filter(e => sameDay(e.date, d)),
  }));

  const weekEntries = entries.filter(e => weekDays.some(d => sameDay(d, e.date)));
  const breakdown = computeBreakdown(weekEntries);
  const weekTotal = breakdown.total;

  // Overall week status (for the dark hero card pill) — drafts beat pending beats approved beats paid
  const wkDraft = weekEntries.some(e => e.status === 'draft');
  const wkPending = weekEntries.some(e => e.status === 'pending');
  const wkApproved = weekEntries.some(e => e.status === 'approved');
  const wkAllPaid = weekEntries.length > 0 && weekEntries.every(e => e.status === 'paid');
  const overallStatus = wkDraft ? 'draft' : wkPending ? 'pending' : wkApproved ? 'approved' : wkAllPaid ? 'paid' : 'draft';

  // Smart date default: if today is in this week, use today; else use the last day of the viewed week
  const openAddPunch = (date, client) => {
    if (date) {
      setAddPunchDate(date);
    } else if (weekDays.some(d => sameDay(d, today))) {
      setAddPunchDate(today);
    } else {
      setAddPunchDate(weekDays[6]);
    }
    setAddPunchClient(client || null);
    setEditingEntry(null);
    setAddPunchOpen(true);
  };

  const openEditPunch = (entry) => {
    setEditingEntry(entry);
    setAddPunchDate(entry.date);
    setAddPunchClient(null);
    setAddPunchOpen(true);
  };

  const closeAddPunch = () => {
    setAddPunchOpen(false);
    setEditingEntry(null);
    setAddPunchClient(null);
  };

  const handleAddPunchSubmit = (payload) => {
    onAddPunch(payload);
    closeAddPunch();
  };

  const handleDeletePunch = (id) => {
    onDeletePunch(id);
    closeAddPunch();
  };

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex items-end justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
            Timesheet
            {isCurrentWeek && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: C.lime, color: C.ink, letterSpacing: '0.1em' }}>
                NOW
              </span>
            )}
            {isFutureWeek && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: C.bone, color: C.muted, letterSpacing: '0.1em' }}>
                UPCOMING
              </span>
            )}
            {!isCurrentWeek && !isFutureWeek && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: C.bone, color: C.muted, letterSpacing: '0.1em' }}>
                PAST
              </span>
            )}
          </div>
          <h1 className="text-3xl tracking-tight mt-1" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
            <span style={{ fontStyle: 'italic' }}>Week of </span>{monthName(weekDays[0])} {dayNum(weekDays[0])}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setWeekOffset(o => o - 1)}
            className="p-2 rounded-full active:scale-95 transition-transform"
            style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
          >
            <ChevronLeft size={14} style={{ color: C.ink }} />
          </button>
          {!isCurrentWeek && (
            <button
              onClick={() => setWeekOffset(0)}
              className="px-3 py-1.5 rounded-full active:scale-95 transition-transform text-[11px] font-medium"
              style={{ backgroundColor: C.ink, color: C.cream, fontFamily: 'Geist, system-ui, sans-serif' }}
            >
              Today
            </button>
          )}
          <button
            onClick={() => setWeekOffset(o => o + 1)}
            className="p-2 rounded-full active:scale-95 transition-transform"
            style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
          >
            <ChevronRight size={14} style={{ color: C.ink }} />
          </button>
        </div>
      </div>

      {/* Week summary card */}
      <div className="px-5 mt-5">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: C.ink, color: C.cream }}
        >
          {/* Tappable header */}
          <button
            onClick={() => setBreakdownOpen(o => !o)}
            className="w-full text-left p-5 transition-colors"
            style={{ backgroundColor: 'transparent' }}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                Pay Period · {monthName(weekDays[0]).slice(0,3)} {dayNum(weekDays[0])} — {monthName(endOfWeek).slice(0,3)} {dayNum(endOfWeek)}
              </div>
              <StatusPill status={overallStatus} size="md" />
            </div>
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl tabular-nums tracking-tight" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 300 }}>
                  {weekTotal.toFixed(1)}
                </span>
                <span className="text-lg" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  hrs
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  {breakdownOpen ? 'Hide' : 'Breakdown'}
                </span>
                <ChevronDown
                  size={14}
                  style={{
                    color: C.mutedSoft,
                    transform: breakdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.25s',
                  }}
                />
              </div>
            </div>
          </button>

          {/* Breakdown panel */}
          {breakdownOpen && (
            <div className="px-5 pb-5">
              <div className="grid grid-cols-3 gap-2 pt-1 pb-4 border-t border-b" style={{ borderColor: '#3D3730' }}>
                <div className="pt-3">
                  <div className="text-[9px] uppercase tracking-wider" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    Regular
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl tabular-nums" style={{ color: C.cream, fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 300 }}>
                      {breakdown.regular.toFixed(1)}
                    </span>
                    <span className="text-[10px]" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>hrs</span>
                  </div>
                </div>
                <div className="pt-3" style={{ borderLeft: `1px solid #3D3730`, paddingLeft: 12 }}>
                  <div className="text-[9px] uppercase tracking-wider flex items-center gap-1" style={{ color: C.amber, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    OT <span style={{ color: C.mutedSoft }}>· 1.5×</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl tabular-nums" style={{ color: breakdown.ot > 0 ? C.amber : C.mutedSoft, fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 300 }}>
                      {breakdown.ot.toFixed(1)}
                    </span>
                    <span className="text-[10px]" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>hrs</span>
                  </div>
                </div>
                <div className="pt-3" style={{ borderLeft: `1px solid #3D3730`, paddingLeft: 12 }}>
                  <div className="text-[9px] uppercase tracking-wider flex items-center gap-1" style={{ color: C.clay, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    DT <span style={{ color: C.mutedSoft }}>· 2×</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl tabular-nums" style={{ color: breakdown.dt > 0 ? C.clay : C.mutedSoft, fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 300 }}>
                      {breakdown.dt.toFixed(1)}
                    </span>
                    <span className="text-[10px]" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>hrs</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] mt-3" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                Calculated daily · &gt;8h becomes OT, &gt;12h becomes DT
              </div>
            </div>
          )}

          {/* 7-day strip */}
          <div className="px-5 pb-5">
            <div className="flex items-end justify-between gap-1 mt-2">
              {entriesByDay.map(({ date, entries: dayEntries }, i) => {
                const dayBd = computeBreakdown(dayEntries);
                const total = dayBd.total;
                const isToday = sameDay(date, today);
                const hasEntries = dayEntries.length > 0;
                const hasOT = dayBd.ot > 0 || dayBd.dt > 0;
                const dayStatus = hasEntries ? dayEntries[0].status : null;
                const barColor = !hasEntries ? '#3D3730' : (dayStatus === 'approved' || dayStatus === 'paid') ? C.lime : (dayStatus === 'pending' || dayStatus === 'submitted') ? C.amber : C.mutedSoft;
                const maxHeight = 38;
                const barHeight = hasEntries ? Math.max(8, (total / 13) * maxHeight) : 4;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    {/* OT/DT indicator dot */}
                    <div className="h-1.5 flex items-center">
                      {hasOT && (
                        <span className="block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dayBd.dt > 0 ? C.clay : C.amber }} />
                      )}
                    </div>
                    <div className="w-full flex items-end justify-center" style={{ height: maxHeight }}>
                      <div
                        className="w-full rounded-sm transition-all duration-300"
                        style={{ height: barHeight, backgroundColor: barColor, opacity: hasEntries ? 1 : 0.4 }}
                      />
                    </div>
                    <div
                      className="flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-md"
                      style={{
                        backgroundColor: isToday ? C.lime : 'transparent',
                        color: isToday ? C.ink : C.cream,
                      }}
                    >
                      <span className="text-[9px] uppercase tracking-wider" style={{ fontFamily: 'Geist, system-ui, sans-serif', opacity: isToday ? 1 : 0.6 }}>
                        {dayLabel(date).slice(0, 1)}
                      </span>
                      <span className="text-[11px] tabular-nums font-medium" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                        {dayNum(date)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action row: Fill in the week + Submit */}
      <div className="px-5 mt-4 space-y-2">
        <button
          onClick={() => setBulkOpen(true)}
          className="w-full flex items-center justify-between p-4 rounded-2xl active:scale-[0.99] transition-transform"
          style={{
            backgroundColor: C.paper,
            border: `1px solid ${C.border}`,
            color: C.ink,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: C.ink }}>
              <CalendarDays size={14} style={{ color: C.cream }} strokeWidth={2.25} />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                Fill in the week
              </div>
              <div className="text-[11px] opacity-60" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                Tap any day to add or edit punches
              </div>
            </div>
          </div>
          <ChevronRight size={18} style={{ color: C.inkSoft }} />
        </button>

        {/* Submit / Review bar */}
        {weekEntries.length > 0 && (
          <button
            onClick={() => setReviewOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl transition-all active:scale-[0.99]"
            style={{
              backgroundColor: isFutureWeek ? C.cream : C.lime,
              border: `1px solid ${isFutureWeek ? C.border : C.limeDeep}`,
              color: C.ink,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: C.ink }}>
                <ArrowUpRight size={14} style={{ color: isFutureWeek ? C.cream : C.lime }} />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                  {isFutureWeek ? 'Preview upcoming timecards' : 'Review & submit timecards'}
                </div>
                <div className="text-[11px] opacity-70" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                  {isFutureWeek
                    ? `Submission unlocks ${monthName(weekDays[0]).slice(0,3)} ${dayNum(weekDays[0])}`
                    : 'Submit each client separately'}
                </div>
              </div>
            </div>
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Daily breakdown */}
      <div className="px-5 mt-6">
        <h3 className="text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
          Daily Breakdown
        </h3>
        <div className="space-y-3">
          {entriesByDay.filter(d => d.entries.length > 0).reverse().map(({ date, entries: dayEntries }) => {
            const dayTotal = dayEntries.reduce((s, e) => s + e.hours, 0);
            return (
              <div key={date.toISOString()} className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.cream, border: `1px solid ${C.borderSoft}` }}>
                <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      {dayLabel(date)}
                    </span>
                    <span className="text-base font-medium" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      {monthName(date).slice(0, 3)} {dayNum(date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAddPunch(date)}
                      className="w-6 h-6 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                      style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}`, color: C.inkSoft }}
                      title="Add a punch to this day"
                    >
                      <Plus size={11} strokeWidth={2.5} />
                    </button>
                    <span className="text-sm tabular-nums font-medium" style={{ color: C.ink, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
                      {dayTotal.toFixed(1)}h
                    </span>
                  </div>
                </div>
                <div className="border-t" style={{ borderColor: C.borderSoft }}>
                  {dayEntries.map((e, i) => {
                    const job = JOBS.find(j => j.id === e.jobId);
                    const hasOT = (e.otH ?? 0) > 0;
                    const hasDT = (e.dtH ?? 0) > 0;
                    // Only drafts are editable from this list — submitted/approved/paid entries are locked
                    const editable = e.status === 'draft' && job?.kind === 'manual';
                    const Wrapper = editable ? 'button' : 'div';
                    return (
                      <Wrapper
                        key={e.id}
                        onClick={editable ? () => openEditPunch(e) : undefined}
                        className={`w-full text-left flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t' : ''} ${editable ? 'active:scale-[0.995] transition-transform' : ''}`}
                        style={{ borderColor: C.borderSoft }}
                      >
                        <span className="block w-1 self-stretch rounded-full" style={{ backgroundColor: job.color, minHeight: 28 }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-medium" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                              {job.name}
                            </span>
                            {isBackfilledLivePunch(e, JOBS) && <ManualBadge />}
                            {hasOT && (
                              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#F5E5C5', color: '#8A6420', fontFamily: 'Geist, system-ui, sans-serif' }}>
                                +{e.otH.toFixed(1)} OT
                              </span>
                            )}
                            {hasDT && (
                              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#F0CFC5', color: '#7A2A1A', fontFamily: 'Geist, system-ui, sans-serif' }}>
                                +{e.dtH.toFixed(1)} DT
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] tabular-nums mt-0.5" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                            {e.start} → {e.end} · {e.hours.toFixed(1)}h{e.note ? ` · ${e.note}` : ''}
                          </div>
                        </div>
                        {editable && <Edit3 size={12} style={{ color: C.mutedSoft, flexShrink: 0 }} />}
                      </Wrapper>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {addPunchOpen && (
        <AddPunchModal
          initialDate={addPunchDate}
          jobs={JOBS.filter(j => !addPunchClient || j.client === addPunchClient)}
          allEntries={entries}
          editingEntry={editingEntry}
          onSubmit={handleAddPunchSubmit}
          onDelete={handleDeletePunch}
          onClose={closeAddPunch}
        />
      )}

      {bulkOpen && (
        <BulkCalendarModal
          weekDays={weekDays}
          weekEntries={weekEntries}
          onCellTap={(date, client) => {
            setBulkOpen(false);
            openAddPunch(date, client);
          }}
          onClose={() => setBulkOpen(false)}
        />
      )}

      {reviewOpen && (
        <SubmitWeekModal
          weekDays={weekDays}
          weekEntries={weekEntries}
          isFutureWeek={isFutureWeek}
          onSubmitClient={onSubmitClient}
          onClose={() => setReviewOpen(false)}
        />
      )}
    </div>
  );
};

// — — — SUBMIT WEEK MODAL — — —
const SubmitWeekModal = ({ weekDays, weekEntries, isFutureWeek, onSubmitClient, onClose }) => {
  const [step, setStep] = useState('picker');
  const [pickedClient, setPickedClient] = useState(null);
  const startD = weekDays[0];
  const endD = weekDays[6];

  // Group week entries by client
  const clientSummaries = (() => {
    const byClient = {};
    weekEntries.forEach(e => {
      const job = JOBS.find(j => j.id === e.jobId);
      if (!job) return;
      if (!byClient[job.client]) byClient[job.client] = [];
      byClient[job.client].push(e);
    });
    return Object.entries(byClient).map(([client, clientEntries]) => {
      const bd = computeBreakdown(clientEntries);
      const days = new Set(clientEntries.map(e => e.date.toDateString())).size;
      const hasDraft = clientEntries.some(e => e.status === 'draft');
      const hasPending = clientEntries.some(e => e.status === 'pending');
      const hasApproved = clientEntries.some(e => e.status === 'approved');
      const allPaid = clientEntries.every(e => e.status === 'paid');
      // Precedence: drafts demand action first, then pending, then approved (waiting on payroll), then paid (done)
      const status = hasDraft ? 'draft' : hasPending ? 'pending' : hasApproved ? 'approved' : allPaid ? 'paid' : 'pending';
      // Use first job's color for this client as a visual anchor
      const firstJob = JOBS.find(j => j.client === client);
      return { client, entries: clientEntries, breakdown: bd, days, status, color: firstJob?.color || C.muted };
    });
  })();

  const handleSubmit = (clientName) => {
    onSubmitClient(clientName);
    setStep('picker');
    setPickedClient(null);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end" style={{ backgroundColor: '#1A161280' }} onClick={onClose}>
      <div
        className="w-full rounded-t-[32px] flex flex-col animate-slide-up"
        style={{ backgroundColor: C.paper, height: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" style={{ backgroundColor: C.border }} />

        {step === 'picker' ? (
          <>
            {/* Picker header */}
            <div className="px-6 pt-3 pb-4 flex-shrink-0 flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  Final review
                </div>
                <h2 className="text-3xl tracking-tight mt-0.5" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
                  <span style={{ fontStyle: 'italic' }}>Pick a </span>timecard
                </h2>
                <div className="text-[12px] mt-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  {monthName(startD)} {dayNum(startD)} — {monthName(endD)} {dayNum(endD)} · Jerry Kovac
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full"
                style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
              >
                <X size={14} style={{ color: C.ink }} />
              </button>
            </div>

            {/* Scrollable client list */}
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <div className="space-y-2.5">
                {clientSummaries.map(s => {
                  const draftCount = s.entries.filter(e => e.status === 'draft').length;
                  const isSubmittable = draftCount > 0;
                  return (
                    <button
                      key={s.client}
                      onClick={() => { setPickedClient(s.client); setStep('timecard'); }}
                      className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.99]"
                      style={{ backgroundColor: C.cream, border: `1px solid ${C.borderSoft}` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                          <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                            {s.client}
                          </span>
                        </div>
                        <StatusPill status={s.status} />
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl tabular-nums tracking-tight" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 300, color: C.ink }}>
                              {s.breakdown.total.toFixed(1)}
                            </span>
                            <span className="text-sm" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>hrs</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="text-[10px]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                              {s.entries.length} {s.entries.length === 1 ? 'entry' : 'entries'} · {s.days} {s.days === 1 ? 'day' : 'days'}
                            </span>
                            {s.breakdown.ot > 0 && (
                              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#F5E5C5', color: '#8A6420', fontFamily: 'Geist, system-ui, sans-serif' }}>
                                {s.breakdown.ot.toFixed(1)} OT
                              </span>
                            )}
                            {s.breakdown.dt > 0 && (
                              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#F0CFC5', color: '#7A2A1A', fontFamily: 'Geist, system-ui, sans-serif' }}>
                                {s.breakdown.dt.toFixed(1)} DT
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {isSubmittable && (
                            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                              {draftCount} to submit
                            </span>
                          )}
                          <ChevronRight size={18} style={{ color: C.inkSoft }} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="mt-5 p-3.5 rounded-2xl flex items-start gap-2.5" style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}` }}>
                <AlertCircle size={14} style={{ color: C.inkSoft, flexShrink: 0, marginTop: 2 }} />
                <div className="text-[11px] leading-relaxed" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  {isFutureWeek
                    ? <>This pay period hasn't started yet. You can review and edit drafts now, but timecards become submittable on <strong>{monthName(startD)} {dayNum(startD)}</strong>.</>
                    : 'Each client receives their own timecard. Submit them separately so each supervisor reviews only the work that belongs to them.'}
                </div>
              </div>
            </div>
          </>
        ) : (
          <ClientTimecard
            client={pickedClient}
            entries={clientSummaries.find(s => s.client === pickedClient)?.entries || []}
            breakdown={clientSummaries.find(s => s.client === pickedClient)?.breakdown}
            color={clientSummaries.find(s => s.client === pickedClient)?.color}
            startD={startD}
            endD={endD}
            isFutureWeek={isFutureWeek}
            onBack={() => { setStep('picker'); setPickedClient(null); }}
            onSubmit={() => handleSubmit(pickedClient)}
          />
        )}
      </div>
    </div>
  );
};

// Per-client timecard view (rendered inside SubmitWeekModal when step === 'timecard')
const ClientTimecard = ({ client, entries, breakdown, color, startD, endD, isFutureWeek, onBack, onSubmit }) => {
  // Group entries by day (only days that have entries for this client)
  const dayMap = {};
  entries.forEach(e => {
    const key = e.date.toDateString();
    if (!dayMap[key]) dayMap[key] = { date: e.date, entries: [] };
    dayMap[key].entries.push(e);
  });
  const days = Object.values(dayMap).sort((a, b) => a.date - b.date);
  const draftCount = entries.filter(e => e.status === 'draft').length;
  const pendingCount = entries.filter(e => e.status === 'pending').length;
  const approvedCount = entries.filter(e => e.status === 'approved').length;
  const hasDrafts = draftCount > 0;
  const canSubmit = hasDrafts && !isFutureWeek;
  const allApproved = entries.length > 0 && entries.every(e => e.status === 'approved');
  const allPaid = entries.length > 0 && entries.every(e => e.status === 'paid');
  const tcStatus = isFutureWeek ? 'draft' : draftCount > 0 ? 'draft' : pendingCount > 0 ? 'pending' : approvedCount > 0 ? 'approved' : allPaid ? 'paid' : 'pending';

  return (
    <>
      {/* Header with back */}
      <div className="px-6 pt-3 pb-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 mb-3 -ml-1"
          style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}
        >
          <ChevronLeft size={16} />
          <span className="text-[12px]">All timecards</span>
        </button>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <div className="text-[10px] uppercase tracking-[0.2em] truncate" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
              {client} · Timecard
            </div>
          </div>
          <StatusPill status={tcStatus} size="md" />
        </div>
        <h2 className="text-3xl tracking-tight" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
          <span style={{ fontStyle: 'italic' }}>{isFutureWeek ? 'Preview ' : canSubmit ? 'Submit ' : 'Review '}</span>this week
        </h2>
        <div className="text-[12px] mt-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
          {monthName(startD)} {dayNum(startD)} — {monthName(endD)} {dayNum(endD)}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {/* Summary card */}
        <div className="p-4 rounded-2xl mb-4" style={{ backgroundColor: C.ink, color: C.cream }}>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>Total</div>
              <div className="flex items-baseline gap-0.5 mt-1">
                <span className="text-xl tabular-nums" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>{breakdown.total.toFixed(1)}</span>
                <span className="text-[10px]" style={{ color: C.mutedSoft }}>h</span>
              </div>
            </div>
            <div style={{ borderLeft: `1px solid #3D3730`, paddingLeft: 10 }}>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>Reg</div>
              <div className="flex items-baseline gap-0.5 mt-1">
                <span className="text-xl tabular-nums" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>{breakdown.regular.toFixed(1)}</span>
                <span className="text-[10px]" style={{ color: C.mutedSoft }}>h</span>
              </div>
            </div>
            <div style={{ borderLeft: `1px solid #3D3730`, paddingLeft: 10 }}>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: C.amber, fontFamily: 'Geist, system-ui, sans-serif' }}>OT</div>
              <div className="flex items-baseline gap-0.5 mt-1">
                <span className="text-xl tabular-nums" style={{ color: breakdown.ot > 0 ? C.amber : C.cream, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>{breakdown.ot.toFixed(1)}</span>
                <span className="text-[10px]" style={{ color: C.mutedSoft }}>h</span>
              </div>
            </div>
            <div style={{ borderLeft: `1px solid #3D3730`, paddingLeft: 10 }}>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: C.clay, fontFamily: 'Geist, system-ui, sans-serif' }}>DT</div>
              <div className="flex items-baseline gap-0.5 mt-1">
                <span className="text-xl tabular-nums" style={{ color: breakdown.dt > 0 ? C.clay : C.cream, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>{breakdown.dt.toFixed(1)}</span>
                <span className="text-[10px]" style={{ color: C.mutedSoft }}>h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Day-by-day list (this client only) */}
        <div className="space-y-2.5">
          {days.map(({ date, entries: dayEntries }) => {
            const dayBd = computeBreakdown(dayEntries);
            return (
              <div key={date.toISOString()} className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.cream, border: `1px solid ${C.borderSoft}` }}>
                <div className="flex items-baseline justify-between px-4 pt-3 pb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      {dayLabel(date)}
                    </span>
                    <span className="text-[14px] font-medium" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      {monthName(date).slice(0, 3)} {dayNum(date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {dayBd.ot > 0 && (
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#F5E5C5', color: '#8A6420', fontFamily: 'Geist, system-ui, sans-serif' }}>OT</span>
                    )}
                    {dayBd.dt > 0 && (
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#F0CFC5', color: '#7A2A1A', fontFamily: 'Geist, system-ui, sans-serif' }}>DT</span>
                    )}
                    <span className="text-[13px] tabular-nums font-medium" style={{ color: C.ink, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
                      {dayBd.total.toFixed(2)}h
                    </span>
                  </div>
                </div>
                <div className="border-t" style={{ borderColor: C.borderSoft }}>
                  {dayEntries.map((e, i) => {
                    const job = JOBS.find(j => j.id === e.jobId);
                    return (
                      <div key={e.id} className={`flex items-center gap-2.5 px-4 py-2.5 ${i > 0 ? 'border-t' : ''}`} style={{ borderColor: C.borderSoft }}>
                        <span className="block w-1 self-stretch rounded-full" style={{ backgroundColor: job.color, minHeight: 24 }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[12px] font-medium truncate" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                              {job.name}
                            </span>
                            {isBackfilledLivePunch(e, JOBS) && <ManualBadge />}
                          </div>
                          <div className="text-[10px] tabular-nums mt-0.5" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                            {e.start} → {e.end} · {e.hours.toFixed(2)}h
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] tabular-nums" style={{ color: C.inkSoft, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
                            {e.regularH != null ? `${e.regularH.toFixed(1)}r` : ''}
                            {(e.otH ?? 0) > 0 ? ` ${e.otH.toFixed(1)}o` : ''}
                            {(e.dtH ?? 0) > 0 ? ` ${e.dtH.toFixed(1)}d` : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Attestation or future-week notice */}
        {canSubmit && (
          <div className="mt-5 p-3.5 rounded-2xl flex items-start gap-2.5" style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}` }}>
            <Check size={14} style={{ color: C.moss, flexShrink: 0, marginTop: 2 }} />
            <div className="text-[11px] leading-relaxed" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
              By submitting, you certify these hours worked at <strong>{client}</strong> are accurate. The full timecard is approved as a unit — your supervisor reviews all entries together.
            </div>
          </div>
        )}
        {isFutureWeek && hasDrafts && (
          <div className="mt-5 p-3.5 rounded-2xl flex items-start gap-2.5" style={{ backgroundColor: C.bone, border: `1px dashed ${C.border}` }}>
            <AlertCircle size={14} style={{ color: C.amber, flexShrink: 0, marginTop: 2 }} />
            <div className="text-[11px] leading-relaxed" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
              This is a future timecard. You can edit drafts now, but submission unlocks on <strong>{monthName(startD)} {dayNum(startD)}</strong> when the pay period begins.
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="flex gap-2 p-5 pt-3 flex-shrink-0" style={{ borderTop: `1px solid ${C.borderSoft}`, backgroundColor: C.paper }}>
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-2xl"
          style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif', fontSize: 13, fontWeight: 500 }}
        >
          Back
        </button>
        <button
          onClick={canSubmit ? onSubmit : onBack}
          disabled={!canSubmit}
          className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-[0.99] transition-transform"
          style={{
            backgroundColor: canSubmit ? C.ink : C.borderSoft,
            color: canSubmit ? C.cream : C.muted,
            fontFamily: 'Geist, system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.05em',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          {canSubmit && <Check size={14} />}
          <span className="uppercase tracking-wider">
            {canSubmit
              ? `Submit ${client.split(' ')[0]} Timecard`
              : isFutureWeek
                ? `Locked until ${monthName(startD).slice(0,3)} ${dayNum(startD)}`
                : allPaid
                  ? 'Paid · all done'
                  : allApproved
                    ? 'Approved · awaiting payroll'
                    : 'Awaiting approval'}
          </span>
        </button>
      </div>
    </>
  );
};

// — — — ADD PUNCH MODAL (manual entry from Timesheet view) — — —
const AddPunchModal = ({ initialDate, jobs, allEntries, editingEntry, onSubmit, onDelete, onClose }) => {
  const isEditing = !!editingEntry;

  // When editing, seed from the existing entry. Otherwise use initialDate + defaults.
  const [date, setDate] = useState(editingEntry?.date || initialDate);

  // Resolve initial job: if editing, use the entry's job; else first manual-only job
  const initialJob = editingEntry
    ? jobs.find(j => j.id === editingEntry.jobId) || jobs[0]
    : jobs[0];
  const [selectedJob, setSelectedJob] = useState(initialJob);
  const [comment, setComment] = useState(editingEntry?.note || '');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const defaultPaycode = (j) => j?.paycodes?.[0] || 'Regular';
  const defaultCostCenter = (j) => j?.costCenters?.[0] || 'General';

  // Each punch is its own segment with its own coding. Shared: date, job, comment.
  // When editing, single-punch mode prefilled from the entry. Otherwise default to one new punch.
  const [punches, setPunches] = useState(
    editingEntry
      ? [{
          id: editingEntry.id,
          start: editingEntry.start,
          end: editingEntry.end,
          paycode: editingEntry.paycode || defaultPaycode(initialJob),
          costCenter: editingEntry.costCenter || defaultCostCenter(initialJob),
        }]
      : [{ id: 1, start: '08:00', end: '12:00', paycode: defaultPaycode(jobs[0]), costCenter: defaultCostCenter(jobs[0]) }]
  );

  // When the assignment changes, reset every punch's paycode/costCenter to the new job's defaults.
  // Skip the initial mount when editing — we want to keep the seeded values.
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setPunches(prev => prev.map(p => ({
      ...p,
      paycode: defaultPaycode(selectedJob),
      costCenter: defaultCostCenter(selectedJob),
    })));
  }, [selectedJob.id]);

  const updatePunch = (id, patch) => {
    setPunches(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  };

  const removePunch = (id) => {
    setPunches(prev => prev.length > 1 ? prev.filter(p => p.id !== id) : prev);
  };

  const addPunch = () => {
    // Smart default: new punch starts where the previous one ended, runs 1h
    const last = punches[punches.length - 1];
    const lastEnd = last?.end || '12:00';
    const [eh, em] = lastEnd.split(':').map(Number);
    const nextEnd = `${String(Math.min(23, eh + 1)).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
    setPunches(prev => [
      ...prev,
      {
        id: Date.now(),
        start: lastEnd,
        end: nextEnd,
        paycode: defaultPaycode(selectedJob),
        costCenter: defaultCostCenter(selectedJob),
      },
    ]);
  };

  const parseMin = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  // Compute hours for a single punch
  const punchHours = (p) => Math.max(0, (parseMin(p.end) - parseMin(p.start)) / 60);

  // Compute conflict — both internal (against other punches in this draft) and external (against existing entries on the date)
  const externalEntries = allEntries.filter(e => sameDay(e.date, date) && (!isEditing || e.id !== editingEntry.id));
  const punchConflicts = punches.map((p, i) => {
    const ps = parseMin(p.start);
    const pe = parseMin(p.end);
    if (pe <= ps) return { invalid: true };

    // Internal: another punch in this draft overlaps
    const internal = punches.find((other, j) => {
      if (j === i) return false;
      const os = parseMin(other.start);
      const oe = parseMin(other.end);
      return ps < oe && pe > os;
    });
    if (internal) {
      return { conflict: { kind: 'internal', start: internal.start, end: internal.end } };
    }

    // External: existing entry on this date overlaps
    const external = externalEntries.find(e => {
      const eS = parseMin(e.start);
      const eE = parseMin(e.end);
      return ps < eE && pe > eS;
    });
    if (external) {
      return {
        conflict: {
          kind: 'external',
          start: external.start,
          end: external.end,
          jobName: JOBS.find(j => j.id === external.jobId)?.name,
        },
      };
    }
    return {};
  });

  const totalHours = punches.reduce((s, p) => s + punchHours(p), 0);
  const earned = totalHours * selectedJob.rate;
  const anyInvalid = punchConflicts.some(c => c.invalid || c.conflict);
  const valid = totalHours > 0 && !anyInvalid;

  // Native date input wants YYYY-MM-DD in local time
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const handleDateChange = (e) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split('-').map(Number);
      setDate(new Date(y, m - 1, d, 12, 0, 0));
    }
  };

  const handleSubmit = () => {
    if (!valid) return;
    onSubmit({
      date,
      jobId: selectedJob.id,
      comment,
      editingId: isEditing ? editingEntry.id : null,
      punches: punches.map(p => ({
        start: p.start,
        end: p.end,
        hours: punchHours(p),
        paycode: p.paycode,
        costCenter: p.costCenter,
      })),
    });
  };

  const handleDelete = () => {
    if (!isEditing) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    onDelete(editingEntry.id);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end" style={{ backgroundColor: '#1A161280' }} onClick={onClose}>
      <div
        className="w-full rounded-t-[32px] flex flex-col animate-slide-up"
        style={{ backgroundColor: C.paper, maxHeight: '94%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" style={{ backgroundColor: C.border }} />

        {/* Header */}
        <div className="px-6 pt-3 pb-3 flex-shrink-0">
          <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
            {isEditing
              ? 'Editing punch'
              : (() => {
                  // If all available jobs belong to a single client, show that client in the eyebrow.
                  const clients = [...new Set(jobs.map(j => j.client))];
                  const scoped = clients.length === 1;
                  if (scoped) {
                    return `${clients[0]} · ${punches.length} ${punches.length === 1 ? 'punch' : 'punches'}`;
                  }
                  return `Manual entry · ${punches.length} ${punches.length === 1 ? 'punch' : 'punches'}`;
                })()}
          </div>
          <h2 className="text-3xl tracking-tight mt-0.5" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
            <span style={{ fontStyle: 'italic' }}>
              {isEditing ? 'Edit ' : punches.length === 1 ? 'Add a ' : 'Log your '}
            </span>
            {isEditing ? 'this punch' : punches.length === 1 ? 'punch' : 'day'}
          </h2>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {/* Rescind notice — when editing a submitted/approved entry, warn that saving sends it back to draft */}
          {isEditing && editingEntry && (editingEntry.status === 'pending' || editingEntry.status === 'approved') && (
            <div className="mb-3 p-3 rounded-2xl flex items-start gap-2.5" style={{ backgroundColor: '#F5E5C5', border: '1px solid #E8D29A' }}>
              <AlertCircle size={14} style={{ color: '#8A6420', flexShrink: 0, marginTop: 2 }} />
              <div className="text-[11px] leading-relaxed" style={{ color: '#6B4F18', fontFamily: 'Geist, system-ui, sans-serif' }}>
                This punch was already submitted{editingEntry.status === 'approved' ? ' and approved' : ''}. Saving changes will <strong>rescind it from your supervisor</strong> and return it to draft. You'll need to resubmit your timecard.
              </div>
            </div>
          )}

          {/* Date field */}
          <div className="mb-3">
            <div className="text-[9px] uppercase tracking-[0.2em] mb-1.5 px-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
              Date
            </div>
            <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}` }}>
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    {dayLabel(date)}
                  </div>
                  <div className="text-xl mt-0.5" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif', fontWeight: 500 }}>
                    {monthName(date)} {dayNum(date)}
                  </div>
                </div>
                <input
                  type="date"
                  value={dateStr}
                  onChange={handleDateChange}
                  className="bg-transparent focus:outline-none text-right"
                  style={{
                    color: C.inkSoft,
                    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                    fontSize: 13,
                    border: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Assignment picker */}
          <div className="mb-4">
            <div className="text-[9px] uppercase tracking-[0.2em] mb-1.5 px-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
              Assignment
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
              {(isEditing ? [selectedJob] : jobs).map(j => (
                <JobChip
                  key={j.id}
                  job={j}
                  selected={selectedJob.id === j.id}
                  onClick={() => !isEditing && setSelectedJob(j)}
                />
              ))}
            </div>
            {isEditing && (
              <div className="text-[10px] mt-1.5 px-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                Delete this entry to recreate it on a different assignment.
              </div>
            )}
            {!isEditing && selectedJob.kind === 'live' && (
              <div className="mt-2 p-2.5 rounded-xl flex items-start gap-2" style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}` }}>
                <Edit3 size={12} style={{ color: C.inkSoft, flexShrink: 0, marginTop: 2 }} strokeWidth={2.5} />
                <div className="text-[10px] leading-relaxed" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  This is a live clock-in/out assignment. Punches you add here will be flagged as <strong>manually entered</strong> on the timecard.
                </div>
              </div>
            )}
          </div>

          {/* Punches list */}
          <div className="mb-3">
            <div className="text-[9px] uppercase tracking-[0.2em] mb-2 px-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
              Punches
            </div>
            <div className="space-y-2">
              {punches.map((p, i) => {
                const hrs = punchHours(p);
                const c = punchConflicts[i];
                const showConflict = c.conflict;
                return (
                  <div
                    key={p.id}
                    className="rounded-2xl p-3"
                    style={{
                      backgroundColor: C.cream,
                      border: `1px solid ${showConflict ? '#E5B5A8' : C.borderSoft}`,
                    }}
                  >
                    {/* Punch header: number, hours, remove */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold tabular-nums"
                          style={{ backgroundColor: C.ink, color: C.cream, fontFamily: 'Geist, system-ui, sans-serif' }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-[11px] tabular-nums font-medium" style={{ color: C.inkSoft, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
                          {hrs > 0 ? `${hrs.toFixed(2)} hrs` : '—'}
                        </span>
                      </div>
                      {punches.length > 1 && (
                        <button
                          onClick={() => removePunch(p.id)}
                          className="w-6 h-6 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                          style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}`, color: C.muted }}
                          title="Remove this punch"
                        >
                          <X size={11} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>

                    {/* Times */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="rounded-xl px-3 py-2" style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}` }}>
                        <div className="text-[9px] uppercase tracking-[0.18em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                          Start
                        </div>
                        <input
                          type="time"
                          value={p.start}
                          onChange={(e) => updatePunch(p.id, { start: e.target.value })}
                          className="bg-transparent w-full focus:outline-none tabular-nums mt-0.5"
                          style={{ color: C.ink, fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 18, fontWeight: 400 }}
                        />
                      </div>
                      <div className="rounded-xl px-3 py-2" style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}` }}>
                        <div className="text-[9px] uppercase tracking-[0.18em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                          End
                        </div>
                        <input
                          type="time"
                          value={p.end}
                          onChange={(e) => updatePunch(p.id, { end: e.target.value })}
                          className="bg-transparent w-full focus:outline-none tabular-nums mt-0.5"
                          style={{ color: C.ink, fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 18, fontWeight: 400 }}
                        />
                      </div>
                    </div>

                    {/* Per-punch coding */}
                    <div className="grid grid-cols-2 gap-2">
                      <SelectField
                        label="Pay code"
                        value={p.paycode}
                        options={selectedJob.paycodes || ['Regular']}
                        onChange={(v) => updatePunch(p.id, { paycode: v })}
                      />
                      <SelectField
                        label="Cost center"
                        value={p.costCenter}
                        options={selectedJob.costCenters || ['General']}
                        onChange={(v) => updatePunch(p.id, { costCenter: v })}
                      />
                    </div>

                    {/* Conflict warning per-punch */}
                    {showConflict && (
                      <div className="mt-2 p-2.5 rounded-xl flex items-start gap-2" style={{ backgroundColor: '#F0CFC5' }}>
                        <AlertCircle size={13} style={{ color: '#7A2A1A', flexShrink: 0, marginTop: 1 }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-medium" style={{ color: '#7A2A1A', fontFamily: 'Geist, system-ui, sans-serif' }}>
                            {c.conflict.kind === 'internal' ? 'Overlaps another punch above' : 'Overlaps an existing entry'}
                          </div>
                          <div className="text-[10px] mt-0.5 tabular-nums" style={{ color: '#9A4A3A', fontFamily: 'Geist, system-ui, sans-serif' }}>
                            {c.conflict.start}–{c.conflict.end}
                            {c.conflict.jobName ? ` · ${c.conflict.jobName}` : ''}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add another punch (hidden in edit mode — single punch focus) */}
            {!isEditing && (
              <>
                <button
                  onClick={addPunch}
                  className="w-full mt-2 py-2.5 rounded-2xl border-dashed flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
                  style={{ border: `1.5px dashed ${C.border}`, color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}
                >
                  <Plus size={13} />
                  <span className="text-[12px]">Add another punch</span>
                </button>
                <div className="text-[10px] mt-1.5 px-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  Use multiple punches to log split shifts (e.g. 8–11, lunch, 12–5).
                </div>
              </>
            )}
          </div>

          {/* Comments */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                Comments
              </span>
              <span className="text-[9px]" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                Optional · {comment.length}/240
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 240))}
              placeholder="Applies to all punches above · e.g. covered for absent staff..."
              rows={2}
              className="w-full p-3 rounded-2xl text-[13px] resize-none focus:outline-none transition-colors"
              style={{
                backgroundColor: C.bone,
                border: `1px solid ${C.borderSoft}`,
                color: C.ink,
                fontFamily: 'Geist, system-ui, sans-serif',
              }}
            />
          </div>

          {/* Total + earnings */}
          <div className="flex items-end justify-between pt-4 border-t" style={{ borderColor: C.borderSoft }}>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                Day total · {punches.length} {punches.length === 1 ? 'punch' : 'punches'}
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className="leading-none tabular-nums tracking-tight"
                  style={{
                    color: valid ? C.ink : C.mutedSoft,
                    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                    fontWeight: 300,
                    fontSize: 40,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {totalHours.toFixed(2)}
                </span>
                <span className="text-sm" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>hrs</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Sparkles size={11} style={{ color: valid ? C.moss : C.mutedSoft }} />
                <span className="text-sm tabular-nums font-medium" style={{ color: valid ? C.ink : C.mutedSoft, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
                  ${earned.toFixed(2)}
                </span>
              </div>
              <div className="text-[10px] mt-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                ${selectedJob.rate.toFixed(2)}/hr
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="p-5 pt-3 flex-shrink-0" style={{ borderTop: `1px solid ${C.borderSoft}`, backgroundColor: C.paper }}>
          {isEditing && confirmingDelete && (
            <div className="mb-2 p-2.5 rounded-xl flex items-center justify-between gap-2" style={{ backgroundColor: '#F0CFC5' }}>
              <span className="text-[11px] font-medium" style={{ color: '#7A2A1A', fontFamily: 'Geist, system-ui, sans-serif' }}>
                {editingEntry?.status === 'pending' || editingEntry?.status === 'approved'
                  ? 'Delete & rescind from supervisor?'
                  : "Delete this punch? This can't be undone."}
              </span>
              <button
                onClick={() => setConfirmingDelete(false)}
                className="text-[10px] underline underline-offset-2"
                style={{ color: '#7A2A1A', fontFamily: 'Geist, system-ui, sans-serif' }}
              >
                Cancel
              </button>
            </div>
          )}
          <div className="flex gap-2">
            {isEditing ? (
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-2xl active:scale-[0.98] transition-transform"
                style={{
                  backgroundColor: confirmingDelete ? '#7A2A1A' : C.cream,
                  border: `1px solid ${confirmingDelete ? '#7A2A1A' : C.border}`,
                  color: confirmingDelete ? C.cream : '#7A2A1A',
                  fontFamily: 'Geist, system-ui, sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                }}
                title="Delete this punch"
              >
                <Trash2 size={14} />
                {confirmingDelete && <span className="uppercase tracking-wider text-[12px] font-semibold">Confirm</span>}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl"
                style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif', fontSize: 13, fontWeight: 500 }}
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!valid}
              className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-[0.99] transition-transform"
              style={{
                backgroundColor: valid ? C.ink : C.borderSoft,
                color: valid ? C.cream : C.muted,
                fontFamily: 'Geist, system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: valid ? 'pointer' : 'not-allowed',
              }}
            >
              {valid && (isEditing ? <Check size={14} /> : <Plus size={14} />)}
              <span className="uppercase tracking-wider">
                {anyInvalid
                  ? 'Resolve Conflicts'
                  : isEditing
                    ? 'Save Changes'
                    : punches.length === 1
                      ? 'Add Punch'
                      : `Add ${punches.length} Punches`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// — — — BULK CALENDAR MODAL — — —
// Calendar surface for bulk weekly entry, scoped per client. Two-step flow:
// 1) Pick a client (matches Submit picker pattern)
// 2) See that client's week as a vertical day-card stack — empty days dashed, filled days
//    show their punches inline. Tapping a cell opens AddPunchModal pre-filled to that date
//    AND that client (worker picks which assignment within that client when adding).
const BulkCalendarModal = ({ weekDays, weekEntries, onCellTap, onClose }) => {
  const [step, setStep] = useState('picker');
  const [pickedClient, setPickedClient] = useState(null);
  const today = new Date();
  const startD = weekDays[0];
  const endD = weekDays[6];

  // Build a list of every client this worker has assignments at, regardless of capture mode.
  // Live-punch clients still appear here so the worker sees their full client roster, but they
  // route to the Today tab for capture — drill-in is disabled and a hint explains why.
  const allClients = (() => {
    const seen = new Set();
    const list = [];
    JOBS.forEach(j => {
      if (!seen.has(j.client)) {
        seen.add(j.client);
        const clientJobs = JOBS.filter(jj => jj.client === j.client);
        const hasManual = clientJobs.some(jj => jj.kind === 'manual');
        const hasLive = clientJobs.some(jj => jj.kind === 'live');
        list.push({
          name: j.client,
          color: j.color,
          hasManual,
          // If a client has BOTH live and manual assignments, treat it as manual-supporting (worker
          // can fill manual punches; the live ones are captured separately on Today).
          mode: hasManual ? 'manual' : hasLive ? 'live' : 'manual',
        });
      }
    });
    return list;
  })();

  // For each client, summarize the week
  const clientSummaries = allClients.map(c => {
    const clientEntries = weekEntries.filter(e => {
      const job = JOBS.find(j => j.id === e.jobId);
      return job?.client === c.name;
    });
    const days = new Set(clientEntries.map(e => e.date.toDateString())).size;
    const breakdown = computeBreakdown(clientEntries);
    return { ...c, entries: clientEntries, filledDays: days, total: breakdown.total };
  });

  return (
    <div className="absolute inset-0 z-50 flex items-end" style={{ backgroundColor: '#1A161280' }} onClick={onClose}>
      <div
        className="w-full rounded-t-[32px] flex flex-col animate-slide-up"
        style={{ backgroundColor: C.paper, maxHeight: '94%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" style={{ backgroundColor: C.border }} />

        {step === 'picker' ? (
          <>
            {/* Picker header */}
            <div className="px-6 pt-3 pb-3 flex-shrink-0 flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  Bulk entry
                </div>
                <h2 className="text-3xl tracking-tight mt-0.5" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
                  <span style={{ fontStyle: 'italic' }}>Which </span>client?
                </h2>
                <div className="text-[12px] mt-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  {monthName(startD)} {dayNum(startD)} — {monthName(endD)} {dayNum(endD)}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full"
                style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
              >
                <X size={14} style={{ color: C.ink }} />
              </button>
            </div>

            {/* Client cards */}
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <div className="space-y-2.5">
                {clientSummaries.map(s => {
                  const isLive = s.mode === 'live';
                  return (
                    <button
                      key={s.name}
                      onClick={() => { setPickedClient(s.name); setStep('calendar'); }}
                      className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.99]"
                      style={{ backgroundColor: C.cream, border: `1px solid ${C.borderSoft}` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                          <span className="text-[10px] uppercase tracking-[0.2em] font-medium truncate" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                            {s.name}
                          </span>
                          {isLive && (
                            <span className="text-[8px] uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: C.bone, color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif', fontWeight: 600, border: `1px solid ${C.border}` }}>
                              Live
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] uppercase tracking-wider flex-shrink-0" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                          {s.filledDays} of 7 days
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl tabular-nums tracking-tight" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 300, color: C.ink }}>
                              {s.total.toFixed(1)}
                            </span>
                            <span className="text-sm" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>hrs</span>
                          </div>
                          <div className="text-[10px] mt-1.5" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                            {isLive && s.entries.length === 0
                              ? 'Clock in/out from Today, or backfill manually'
                              : `${s.entries.length} ${s.entries.length === 1 ? 'entry' : 'entries'} so far`}
                          </div>
                        </div>
                        <ChevronRight size={18} style={{ color: C.inkSoft }} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tip */}
              <div className="mt-4 p-3 rounded-2xl flex items-start gap-2.5" style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}` }}>
                <AlertCircle size={14} style={{ color: C.inkSoft, flexShrink: 0, marginTop: 2 }} />
                <div className="text-[11px] leading-relaxed" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  Fill in your week one client at a time. Each client's punches stay separate even on days when you worked both.
                </div>
              </div>
            </div>
          </>
        ) : (
          <BulkClientCalendar
            client={pickedClient}
            color={clientSummaries.find(s => s.name === pickedClient)?.color}
            weekDays={weekDays}
            weekEntries={weekEntries.filter(e => {
              const job = JOBS.find(j => j.id === e.jobId);
              return job?.client === pickedClient;
            })}
            onBack={() => { setStep('picker'); setPickedClient(null); }}
            onCellTap={(date) => onCellTap(date, pickedClient)}
          />
        )}
      </div>
    </div>
  );
};

// Per-client calendar shown inside BulkCalendarModal at step === 'calendar'
const BulkClientCalendar = ({ client, color, weekDays, weekEntries, onBack, onCellTap }) => {
  const today = new Date();
  const entriesByDay = weekDays.map((d) => ({
    date: d,
    isToday: sameDay(d, today),
    entries: weekEntries.filter(e => sameDay(e.date, d)),
  }));
  const filledDays = entriesByDay.filter(d => d.entries.length > 0).length;
  const weekTotal = computeBreakdown(weekEntries).total;

  return (
    <>
      {/* Header with back */}
      <div className="px-6 pt-3 pb-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 mb-3 -ml-1"
          style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}
        >
          <ChevronLeft size={16} />
          <span className="text-[12px]">All clients</span>
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
            {client} · {filledDays} of 7 filled
          </div>
        </div>
        <h2 className="text-3xl tracking-tight" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
          <span style={{ fontStyle: 'italic' }}>Fill in </span>this week
        </h2>
        <div className="text-[12px] mt-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
          {weekTotal.toFixed(1)}h logged so far
        </div>
      </div>

      {/* Calendar body */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Day-of-week labels */}
        <div className="grid grid-cols-7 gap-1.5 mb-2 px-1">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
            <div
              key={i}
              className="text-[9px] uppercase tracking-[0.15em] text-center"
              style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Date row with mini hour totals */}
        <div className="grid grid-cols-7 gap-1.5 mb-3">
          {entriesByDay.map(({ date, isToday, entries: dayEntries }, i) => {
            const dayTotal = dayEntries.reduce((s, e) => s + e.hours, 0);
            const hasEntries = dayEntries.length > 0;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] tabular-nums font-medium"
                  style={{
                    backgroundColor: isToday ? C.lime : 'transparent',
                    color: isToday ? C.ink : C.inkSoft,
                    fontFamily: 'Geist, system-ui, sans-serif',
                  }}
                >
                  {dayNum(date)}
                </div>
                <span
                  className="text-[8px] tabular-nums"
                  style={{
                    color: hasEntries ? C.ink : C.mutedSoft,
                    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                    fontWeight: hasEntries ? 600 : 400,
                  }}
                >
                  {hasEntries ? `${dayTotal.toFixed(1)}h` : '—'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Day cells */}
        <div className="space-y-2">
          {entriesByDay.map(({ date, isToday, entries: dayEntries }) => {
            const dayBd = computeBreakdown(dayEntries);
            const hasEntries = dayEntries.length > 0;
            return (
              <button
                key={date.toISOString()}
                onClick={() => onCellTap(date)}
                className="w-full text-left rounded-2xl p-3 active:scale-[0.99] transition-transform"
                style={{
                  backgroundColor: hasEntries ? C.cream : C.paper,
                  border: `${hasEntries ? '1px solid' : '1.5px dashed'} ${hasEntries ? C.borderSoft : C.border}`,
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      {dayLabel(date)}
                    </span>
                    <span className="text-[14px] font-medium" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      {monthName(date).slice(0, 3)} {dayNum(date)}
                    </span>
                    {isToday && (
                      <span className="text-[8px] uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: C.lime, color: C.ink, fontFamily: 'Geist, system-ui, sans-serif', fontWeight: 600 }}>
                        Today
                      </span>
                    )}
                  </div>
                  {hasEntries ? (
                    <div className="flex items-center gap-2">
                      {dayBd.ot > 0 && (
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#F5E5C5', color: '#8A6420', fontFamily: 'Geist, system-ui, sans-serif' }}>OT</span>
                      )}
                      {dayBd.dt > 0 && (
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#F0CFC5', color: '#7A2A1A', fontFamily: 'Geist, system-ui, sans-serif' }}>DT</span>
                      )}
                      <span className="text-[13px] tabular-nums font-medium" style={{ color: C.ink, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
                        {dayBd.total.toFixed(1)}h
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      <Plus size={11} />
                      <span>Add</span>
                    </div>
                  )}
                </div>

                {hasEntries && (
                  <div className="mt-2 space-y-1">
                    {dayEntries.map(e => {
                      const job = JOBS.find(j => j.id === e.jobId);
                      return (
                        <div key={e.id} className="flex items-center gap-2 text-[11px]">
                          <span className="block w-1 h-3 rounded-full" style={{ backgroundColor: job?.color }} />
                          <span className="flex-1 truncate" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                            {job?.name.replace(`${client} · `, '')}
                          </span>
                          {isBackfilledLivePunch(e, JOBS) && <ManualBadge />}
                          <span className="tabular-nums" style={{ color: C.muted, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
                            {e.start}–{e.end}
                          </span>
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-1 text-[10px] mt-1.5" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      <Plus size={10} />
                      <span>Add another to this day</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

// Tiny inline error message shown under a field after a submit attempt fails.
// Uses the clay/rust palette established by the overlap-warning blocks.
const FieldError = ({ message }) => (
  <div className="flex items-center gap-1 mt-1.5 px-1">
    <AlertCircle size={10} style={{ color: '#7A2A1A', flexShrink: 0 }} />
    <span className="text-[10px] font-medium" style={{ color: '#7A2A1A', fontFamily: 'Geist, system-ui, sans-serif' }}>
      {message}
    </span>
  </div>
);

// Reusable field border style — flips to clay when the field is invalid post-submit-attempt.
const fieldBorder = (hasError) => `1px solid ${hasError ? '#C75D3F' : C.borderSoft}`;

// — — — ADD EXPENSE MODAL — — —
// Three-step flow: kind picker → form → save. Edit mode skips the picker.
const AddExpenseModal = ({
  reports,        // existing reports for routing — we add to whichever matches (client, week)
  jobs,           // all jobs (used to derive client)
  initialKind,    // optional: pre-pick kind (e.g., from a quick-add button)
  editingExpense, // optional: edit mode
  onSubmit,
  onDelete,
  onClose,
}) => {
  const isEditing = !!editingExpense;
  const [step, setStep] = useState(isEditing ? 'form' : (initialKind ? 'form' : 'kind'));
  const [kind, setKind] = useState(editingExpense?.kind || initialKind || 'regular');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Shared fields
  const [date, setDate] = useState(editingExpense?.date || new Date());
  const [selectedJob, setSelectedJob] = useState(
    editingExpense ? jobs.find(j => j.id === editingExpense.jobId) || jobs[0] : jobs[0]
  );
  const [note, setNote] = useState(editingExpense?.note || '');
  const [receipt, setReceipt] = useState(editingExpense?.receipt || null);

  // Regular-only fields
  const [amount, setAmount] = useState(
    editingExpense?.kind === 'regular' ? String(editingExpense.amount) : ''
  );
  const [category, setCategory] = useState(
    editingExpense?.category || EXPENSE_CATEGORIES[0]
  );
  const [vendor, setVendor] = useState(editingExpense?.vendor || '');

  // Mileage-only fields
  const [miles, setMiles] = useState(
    editingExpense?.kind === 'mileage' ? String(editingExpense.miles) : ''
  );
  const [tripFrom, setTripFrom] = useState(editingExpense?.tripFrom || '');
  const [tripTo, setTripTo] = useState(editingExpense?.tripTo || '');

  // attemptedSubmit flips when the worker taps the submit button on an invalid form.
  // After that, errors are rendered inline. We don't show errors while typing — that's nagging.
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const computedAmount = kind === 'mileage'
    ? (parseFloat(miles) || 0) * MILEAGE_RATE
    : parseFloat(amount) || 0;

  // Per-field validation. Each key maps to a human-readable error string when invalid; null means OK.
  const errors = (() => {
    const e = {};
    if (!receipt) e.receipt = 'Snap or upload a receipt';
    if (kind === 'regular') {
      if (!amount || parseFloat(amount) <= 0) e.amount = 'Enter an amount greater than zero';
      if (!vendor.trim()) e.vendor = 'Add the vendor name';
    } else {
      if (!miles || parseFloat(miles) <= 0) e.miles = 'Enter miles greater than zero';
      if (!tripFrom.trim()) e.tripFrom = 'Add a starting location';
      if (!tripTo.trim()) e.tripTo = 'Add a destination';
    }
    return e;
  })();
  const errorCount = Object.keys(errors).length;
  const valid = errorCount === 0;
  const showError = (key) => attemptedSubmit && errors[key];

  // Native date input wants YYYY-MM-DD
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const handleDateChange = (e) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split('-').map(Number);
      setDate(new Date(y, m - 1, d, 12, 0, 0));
    }
  };

  // Receipt capture — fakes the camera/upload action with a placeholder
  const handleSnapReceipt = () => {
    setReceipt({
      type: 'placeholder',
      label: `IMG_${Math.floor(4000 + Math.random() * 1000)}.jpg`,
      method: 'camera',
    });
  };
  const handleUploadReceipt = () => {
    setReceipt({
      type: 'placeholder',
      label: `Scan_${monthName(new Date()).slice(0,3).toLowerCase()}_${dayNum(new Date())}.pdf`,
      method: 'upload',
    });
  };

  const handleSubmit = () => {
    if (!valid) {
      setAttemptedSubmit(true);
      return;
    }
    const payload = {
      editingId: isEditing ? editingExpense.id : null,
      kind,
      date,
      jobId: selectedJob.id,
      note,
      receipt,
    };
    if (kind === 'regular') {
      Object.assign(payload, {
        amount: parseFloat(amount),
        category,
        vendor: vendor.trim(),
      });
    } else {
      Object.assign(payload, {
        miles: parseFloat(miles),
        tripFrom: tripFrom.trim(),
        tripTo: tripTo.trim(),
        amount: computedAmount,
      });
    }
    onSubmit(payload);
  };

  const handleDelete = () => {
    if (!isEditing) return;
    if (!confirmingDelete) { setConfirmingDelete(true); return; }
    onDelete(editingExpense.id);
  };

  // Determine if editing is locked due to status
  const editLocked = isEditing && (editingExpense.reportStatus === 'paid' || editingExpense.reportStatus === 'approved');

  return (
    <div className="absolute inset-0 z-50 flex items-end" style={{ backgroundColor: '#1A161280' }} onClick={onClose}>
      <div
        className="w-full rounded-t-[32px] flex flex-col animate-slide-up"
        style={{ backgroundColor: C.paper, maxHeight: '94%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" style={{ backgroundColor: C.border }} />

        {step === 'kind' ? (
          <>
            {/* Kind picker step */}
            <div className="px-6 pt-3 pb-3 flex-shrink-0 flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  New expense
                </div>
                <h2 className="text-3xl tracking-tight mt-0.5" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
                  <span style={{ fontStyle: 'italic' }}>What </span>type?
                </h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-full" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
                <X size={14} style={{ color: C.ink }} />
              </button>
            </div>

            <div className="px-6 pb-6 space-y-2.5">
              <button
                onClick={() => { setKind('regular'); setStep('form'); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl active:scale-[0.99] transition-transform"
                style={{ backgroundColor: C.cream, border: `1px solid ${C.borderSoft}` }}
              >
                <div className="p-3 rounded-2xl" style={{ backgroundColor: C.bone }}>
                  <Receipt size={20} style={{ color: C.ink }} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-[15px] font-semibold" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    Regular expense
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    Meals, supplies, parking, lodging, etc.
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: C.inkSoft }} />
              </button>

              <button
                onClick={() => { setKind('mileage'); setStep('form'); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl active:scale-[0.99] transition-transform"
                style={{ backgroundColor: C.cream, border: `1px solid ${C.borderSoft}` }}
              >
                <div className="p-3 rounded-2xl" style={{ backgroundColor: C.bone }}>
                  <Car size={20} style={{ color: C.ink }} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-[15px] font-semibold" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    Mileage
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    Reimbursed at ${MILEAGE_RATE.toFixed(2)}/mile · IRS standard rate
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: C.inkSoft }} />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Form step */}
            <div className="px-6 pt-3 pb-3 flex-shrink-0">
              {!isEditing && (
                <button
                  onClick={() => setStep('kind')}
                  className="flex items-center gap-1.5 mb-3 -ml-1"
                  style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}
                >
                  <ChevronLeft size={16} />
                  <span className="text-[12px]">Change type</span>
                </button>
              )}
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                {isEditing ? 'Editing expense' : kind === 'mileage' ? 'New mileage' : 'New expense'}
              </div>
              <h2 className="text-3xl tracking-tight mt-0.5" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
                <span style={{ fontStyle: 'italic' }}>{isEditing ? 'Edit ' : 'Add '}</span>
                {kind === 'mileage' ? 'a trip' : 'an expense'}
              </h2>
            </div>

            {/* Scrollable form body */}
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              {/* Rescind warning if editing a submitted/approved expense */}
              {isEditing && (editingExpense.reportStatus === 'pending' || editingExpense.reportStatus === 'approved') && (
                <div className="mb-3 p-3 rounded-2xl flex items-start gap-2.5" style={{ backgroundColor: '#F5E5C5', border: '1px solid #E8D29A' }}>
                  <AlertCircle size={14} style={{ color: '#8A6420', flexShrink: 0, marginTop: 2 }} />
                  <div className="text-[11px] leading-relaxed" style={{ color: '#6B4F18', fontFamily: 'Geist, system-ui, sans-serif' }}>
                    This expense is part of a {editingExpense.reportStatus === 'approved' ? 'an approved' : 'a submitted'} report. Saving changes will <strong>rescind the report to draft</strong>. You'll need to resubmit it.
                  </div>
                </div>
              )}

              {/* Validation summary — appears after a failed submit attempt; clears once valid */}
              {attemptedSubmit && errorCount > 0 && (
                <div className="mb-3 p-3 rounded-2xl flex items-start gap-2.5" style={{ backgroundColor: '#F0CFC5', border: '1px solid #E5B5A8' }}>
                  <AlertCircle size={14} style={{ color: '#7A2A1A', flexShrink: 0, marginTop: 2 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium" style={{ color: '#7A2A1A', fontFamily: 'Geist, system-ui, sans-serif' }}>
                      {errorCount === 1 ? '1 field needs your attention' : `${errorCount} fields need your attention`}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: '#9A4A3A', fontFamily: 'Geist, system-ui, sans-serif' }}>
                      Highlighted below — fill them in to save this expense.
                    </div>
                  </div>
                </div>
              )}

              {/* Receipt capture — required */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: showError('receipt') ? '#7A2A1A' : C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    Receipt · Required
                  </span>
                  {receipt && (
                    <button
                      onClick={() => setReceipt(null)}
                      className="text-[10px] underline underline-offset-2"
                      style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}
                    >
                      Replace
                    </button>
                  )}
                </div>
                {receipt ? (
                  <div className="rounded-2xl p-3 flex items-center gap-3" style={{ backgroundColor: C.cream, border: `1px solid ${C.borderSoft}` }}>
                    <div
                      className="w-12 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: C.bone, border: `1px solid ${C.border}` }}
                    >
                      <ImageIcon size={18} style={{ color: C.inkSoft }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Check size={11} style={{ color: C.moss }} />
                        <span className="text-[12px] font-medium" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                          Receipt attached
                        </span>
                      </div>
                      <div className="text-[10px] tabular-nums mt-0.5 truncate" style={{ color: C.muted, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
                        {receipt.label}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="grid grid-cols-2 gap-2"
                    style={showError('receipt') ? { padding: 6, borderRadius: 18, border: '1.5px dashed #C75D3F', backgroundColor: '#F0CFC520' } : {}}
                  >
                    <button
                      onClick={handleSnapReceipt}
                      className="flex items-center gap-2.5 p-3.5 rounded-2xl active:scale-[0.98] transition-transform"
                      style={{ backgroundColor: C.ink, color: C.cream }}
                    >
                      <div className="p-1.5 rounded-full" style={{ backgroundColor: C.lime }}>
                        <Camera size={14} style={{ color: C.ink }} />
                      </div>
                      <div className="text-left">
                        <div className="text-[12px] font-medium" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>Snap receipt</div>
                        <div className="text-[10px] opacity-60" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>Use the camera</div>
                      </div>
                    </button>
                    <button
                      onClick={handleUploadReceipt}
                      className="flex items-center gap-2.5 p-3.5 rounded-2xl active:scale-[0.98] transition-transform"
                      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.ink }}
                    >
                      <div className="p-1.5 rounded-full" style={{ backgroundColor: C.bone }}>
                        <Upload size={14} style={{ color: C.ink }} />
                      </div>
                      <div className="text-left">
                        <div className="text-[12px] font-medium" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>Upload</div>
                        <div className="text-[10px]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>From files</div>
                      </div>
                    </button>
                  </div>
                )}
                {showError('receipt') && <FieldError message={errors.receipt} />}
              </div>

              {/* Date */}
              <div className="mb-3">
                <div className="text-[9px] uppercase tracking-[0.2em] mb-1.5 px-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  Date
                </div>
                <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}` }}>
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                        {dayLabel(date)}
                      </div>
                      <div className="text-xl mt-0.5" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif', fontWeight: 500 }}>
                        {monthName(date)} {dayNum(date)}
                      </div>
                    </div>
                    <input
                      type="date"
                      value={dateStr}
                      onChange={handleDateChange}
                      className="bg-transparent focus:outline-none text-right"
                      style={{ color: C.inkSoft, fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 13, border: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div className="mb-3">
                <div className="text-[9px] uppercase tracking-[0.2em] mb-1.5 px-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  Assignment · Determines reimbursing client
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                  {jobs.map(j => (
                    <JobChip key={j.id} job={j} selected={selectedJob.id === j.id} onClick={() => setSelectedJob(j)} />
                  ))}
                </div>
              </div>

              {/* Kind-specific fields */}
              {kind === 'regular' ? (
                <>
                  {/* Amount */}
                  <div className="mb-3">
                    <div className="text-[9px] uppercase tracking-[0.2em] mb-1.5 px-1" style={{ color: showError('amount') ? '#7A2A1A' : C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      Amount
                    </div>
                    <div className="rounded-2xl px-4 py-3 flex items-baseline gap-2" style={{ backgroundColor: C.bone, border: fieldBorder(showError('amount')) }}>
                      <span className="text-xl" style={{ color: C.muted, fontFamily: 'Instrument Serif, serif' }}>$</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-transparent flex-1 focus:outline-none tabular-nums"
                        style={{
                          color: C.ink,
                          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                          fontSize: 28,
                          fontWeight: 300,
                          letterSpacing: '-0.01em',
                          minWidth: 0,
                        }}
                      />
                    </div>
                    {showError('amount') && <FieldError message={errors.amount} />}
                  </div>

                  {/* Category + Vendor */}
                  <div className="grid grid-cols-2 gap-2 mb-3 items-start">
                    <SelectField
                      label="Category"
                      value={category}
                      options={EXPENSE_CATEGORIES}
                      onChange={setCategory}
                    />
                    <div>
                      <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: C.bone, border: fieldBorder(showError('vendor')) }}>
                        <div className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: showError('vendor') ? '#7A2A1A' : C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                          Vendor
                        </div>
                        <input
                          type="text"
                          value={vendor}
                          onChange={(e) => setVendor(e.target.value)}
                          placeholder="e.g. Sunrise Diner"
                          className="bg-transparent w-full focus:outline-none"
                          style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif', fontSize: 13, fontWeight: 500 }}
                        />
                      </div>
                      {showError('vendor') && <FieldError message={errors.vendor} />}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Miles */}
                  <div className="mb-3">
                    <div className="text-[9px] uppercase tracking-[0.2em] mb-1.5 px-1" style={{ color: showError('miles') ? '#7A2A1A' : C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      Miles driven
                    </div>
                    <div className="rounded-2xl px-4 py-3 flex items-baseline gap-2" style={{ backgroundColor: C.bone, border: fieldBorder(showError('miles')) }}>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="0"
                        value={miles}
                        onChange={(e) => setMiles(e.target.value)}
                        placeholder="0"
                        className="bg-transparent flex-1 focus:outline-none tabular-nums"
                        style={{
                          color: C.ink,
                          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                          fontSize: 28,
                          fontWeight: 300,
                          letterSpacing: '-0.01em',
                          minWidth: 0,
                        }}
                      />
                      <span className="text-sm" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>mi</span>
                    </div>
                    {showError('miles') && <FieldError message={errors.miles} />}
                    {parseFloat(miles) > 0 && !showError('miles') && (
                      <div className="flex items-center gap-1.5 mt-1.5 px-1">
                        <Sparkles size={10} style={{ color: C.moss }} />
                        <span className="text-[11px] tabular-nums" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                          ${computedAmount.toFixed(2)} reimbursement at ${MILEAGE_RATE.toFixed(2)}/mi
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Trip from / to */}
                  <div className="grid grid-cols-2 gap-2 mb-3 items-start">
                    <div>
                      <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: C.bone, border: fieldBorder(showError('tripFrom')) }}>
                        <div className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: showError('tripFrom') ? '#7A2A1A' : C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                          From
                        </div>
                        <input
                          type="text"
                          value={tripFrom}
                          onChange={(e) => setTripFrom(e.target.value)}
                          placeholder="Office, Home..."
                          className="bg-transparent w-full focus:outline-none"
                          style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif', fontSize: 13, fontWeight: 500 }}
                        />
                      </div>
                      {showError('tripFrom') && <FieldError message={errors.tripFrom} />}
                    </div>
                    <div>
                      <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: C.bone, border: fieldBorder(showError('tripTo')) }}>
                        <div className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: showError('tripTo') ? '#7A2A1A' : C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                          To
                        </div>
                        <input
                          type="text"
                          value={tripTo}
                          onChange={(e) => setTripTo(e.target.value)}
                          placeholder="Job site..."
                          className="bg-transparent w-full focus:outline-none"
                          style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif', fontSize: 13, fontWeight: 500 }}
                        />
                      </div>
                      {showError('tripTo') && <FieldError message={errors.tripTo} />}
                    </div>
                  </div>
                </>
              )}

              {/* Note */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    Note
                  </span>
                  <span className="text-[9px]" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    Optional · {note.length}/240
                  </span>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 240))}
                  placeholder={kind === 'mileage' ? 'e.g. Drove crew to off-site workshop' : 'e.g. Team lunch after long shift'}
                  rows={2}
                  className="w-full p-3 rounded-2xl text-[13px] resize-none focus:outline-none"
                  style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}`, color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}
                />
              </div>
            </div>

            {/* Sticky footer */}
            <div className="p-5 pt-3 flex-shrink-0" style={{ borderTop: `1px solid ${C.borderSoft}`, backgroundColor: C.paper }}>
              {isEditing && confirmingDelete && (
                <div className="mb-2 p-2.5 rounded-xl flex items-center justify-between gap-2" style={{ backgroundColor: '#F0CFC5' }}>
                  <span className="text-[11px] font-medium" style={{ color: '#7A2A1A', fontFamily: 'Geist, system-ui, sans-serif' }}>
                    {editingExpense?.reportStatus === 'pending' || editingExpense?.reportStatus === 'approved'
                      ? 'Delete & rescind report?'
                      : "Delete this expense?"}
                  </span>
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    className="text-[10px] underline underline-offset-2"
                    style={{ color: '#7A2A1A', fontFamily: 'Geist, system-ui, sans-serif' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                {isEditing ? (
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-2xl active:scale-[0.98] transition-transform"
                    style={{
                      backgroundColor: confirmingDelete ? '#7A2A1A' : C.cream,
                      border: `1px solid ${confirmingDelete ? '#7A2A1A' : C.border}`,
                      color: confirmingDelete ? C.cream : '#7A2A1A',
                      fontFamily: 'Geist, system-ui, sans-serif',
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    <Trash2 size={14} />
                    {confirmingDelete && <span className="uppercase tracking-wider text-[12px] font-semibold">Confirm</span>}
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-2xl"
                    style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif', fontSize: 13, fontWeight: 500 }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-[0.99] transition-transform"
                  style={{
                    backgroundColor: valid ? C.ink : (attemptedSubmit ? '#C75D3F' : C.borderSoft),
                    color: valid ? C.cream : (attemptedSubmit ? C.cream : C.muted),
                    fontFamily: 'Geist, system-ui, sans-serif',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                  }}
                >
                  {valid
                    ? (isEditing ? <Check size={14} /> : <Plus size={14} />)
                    : (attemptedSubmit ? <AlertCircle size={14} /> : null)}
                  <span className="uppercase tracking-wider">
                    {!valid && attemptedSubmit
                      ? 'Complete Required Fields'
                      : isEditing
                        ? 'Save Changes'
                        : kind === 'mileage' ? 'Log Mileage' : 'Add Expense'}
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// — — — REPORT DETAIL MODAL — — —
// Drill-in view for a single expense report. Shows all items, supports edit/delete via the modal,
// and offers Submit when in draft state.
const ReportDetailModal = ({ report, items, jobs, onAddItem, onEditItem, onDeleteItem, onSubmit, onClose }) => {
  // Edit-mode state — submitted reports start read-only; worker opts into editing
  // which surfaces the rescind warning and unlocks tap-to-edit on items.
  const [editMode, setEditMode] = useState(false);

  // Reset to read-only whenever the modal opens for a new report
  useEffect(() => { setEditMode(false); }, [report?.id]);

  if (!report) return null;
  const total = items.reduce((s, e) => s + e.amount, 0);
  const mileageMiles = items.filter(e => e.kind === 'mileage').reduce((s, e) => s + e.miles, 0);
  const isDraft = report.status === 'draft';
  const isPaid = report.status === 'paid';
  const isSubmitted = report.status === 'pending' || report.status === 'approved';
  // Drafts are always editable. Paid is never editable. Submitted is read-only until worker opts in.
  const itemsTappable = isDraft || (isSubmitted && editMode);
  const weekEnd = new Date(report.weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  // Title verb adapts to mode
  const titleVerb = isDraft ? 'Submit '
                  : isPaid ? 'Review '
                  : editMode ? 'Edit '
                  : 'Review ';

  return (
    <div className="absolute inset-0 z-50 flex items-end" style={{ backgroundColor: '#1A161280' }} onClick={onClose}>
      <div
        className="w-full rounded-t-[32px] flex flex-col animate-slide-up"
        style={{ backgroundColor: C.paper, height: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" style={{ backgroundColor: C.border }} />

        {/* Header */}
        <div className="px-6 pt-3 pb-3 flex-shrink-0 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: jobs.find(j => j.client === report.client)?.color || C.muted }} />
              <div className="text-[10px] uppercase tracking-[0.2em] truncate" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                {report.client} · Expense Report
              </div>
            </div>
            <h2 className="text-3xl tracking-tight" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
              <span style={{ fontStyle: 'italic' }}>{titleVerb}</span>this report
            </h2>
            <div className="text-[12px] mt-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
              {monthName(report.weekStart)} {dayNum(report.weekStart)} — {monthName(weekEnd)} {dayNum(weekEnd)}
            </div>
          </div>
          <StatusPill status={report.status} size="md" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {/* Total card */}
          <div className="p-4 rounded-2xl mb-4" style={{ backgroundColor: C.ink, color: C.cream }}>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <div className="text-[9px] uppercase tracking-wider" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>Total</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg" style={{ color: C.cream, fontFamily: 'Instrument Serif, serif' }}>$</span>
                  <span className="text-3xl tabular-nums" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 300 }}>{total.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ borderLeft: `1px solid #3D3730`, paddingLeft: 12 }}>
                <div className="text-[9px] uppercase tracking-wider" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>Miles</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl tabular-nums" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 300 }}>{mileageMiles.toFixed(0)}</span>
                  <span className="text-[10px]" style={{ color: C.mutedSoft }}>mi</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t flex items-center justify-between text-[10px]" style={{ borderColor: '#3D3730', color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
              <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
              <span>Mileage @ ${MILEAGE_RATE.toFixed(2)}/mi</span>
            </div>
          </div>

          {/* Submitted read-only notice + opt-in edit affordance */}
          {isSubmitted && !editMode && (
            <div className="mb-4 p-3.5 rounded-2xl flex items-start gap-2.5" style={{ backgroundColor: C.cream, border: `1px solid ${C.borderSoft}` }}>
              <FileText size={14} style={{ color: C.inkSoft, flexShrink: 0, marginTop: 2 }} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  Read only — submitted for review
                </div>
                <div className="text-[10px] mt-0.5 leading-relaxed" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  Need to make changes? Editing will rescind this report from your supervisor.
                </div>
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold active:scale-95 transition-transform"
                  style={{ backgroundColor: C.ink, color: C.cream, fontFamily: 'Geist, system-ui, sans-serif' }}
                >
                  <Edit3 size={11} strokeWidth={2.5} />
                  <span className="uppercase tracking-wider">Edit & Rescind</span>
                </button>
              </div>
            </div>
          )}

          {/* Active edit-mode banner — confirms what saving will do */}
          {isSubmitted && editMode && (
            <div className="mb-4 p-3 rounded-2xl flex items-start gap-2.5" style={{ backgroundColor: '#F5E5C5', border: '1px solid #E8D29A' }}>
              <AlertCircle size={14} style={{ color: '#8A6420', flexShrink: 0, marginTop: 2 }} />
              <div className="flex-1 text-[11px] leading-relaxed" style={{ color: '#6B4F18', fontFamily: 'Geist, system-ui, sans-serif' }}>
                Editing mode. Any change will rescind this report and return it to draft for resubmission.
              </div>
              <button
                onClick={() => setEditMode(false)}
                className="text-[10px] underline underline-offset-2 flex-shrink-0"
                style={{ color: '#6B4F18', fontFamily: 'Geist, system-ui, sans-serif' }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Items list */}
          <div className="space-y-2">
            {items.map(e => {
              const job = jobs.find(j => j.id === e.jobId);
              const isMileage = e.kind === 'mileage';
              const Wrapper = itemsTappable ? 'button' : 'div';
              return (
                <Wrapper
                  key={e.id}
                  onClick={itemsTappable ? () => onEditItem(e) : undefined}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-2xl ${itemsTappable ? 'active:scale-[0.99] transition-transform' : ''}`}
                  style={{ backgroundColor: C.cream, border: `1px solid ${C.borderSoft}` }}
                >
                  <div className="p-2 rounded-xl flex-shrink-0" style={{ backgroundColor: C.bone }}>
                    {isMileage ? <Car size={16} style={{ color: C.inkSoft }} /> : <Receipt size={16} style={{ color: C.inkSoft }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-medium truncate" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                        {isMileage ? `${e.tripFrom} → ${e.tripTo}` : e.vendor}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                      <span className="block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: job?.color }} />
                      <span>{isMileage ? `${e.miles} mi` : e.category}</span>
                      <span>·</span>
                      <span>{monthName(e.date).slice(0,3)} {dayNum(e.date)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[13px] tabular-nums font-medium" style={{ color: C.ink, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
                      ${e.amount.toFixed(2)}
                    </span>
                    {itemsTappable && <Edit3 size={11} style={{ color: C.mutedSoft }} />}
                  </div>
                </Wrapper>
              );
            })}

            {/* Add item — only in editable modes */}
            {itemsTappable && (
              <button
                onClick={onAddItem}
                className="w-full mt-1 py-3 rounded-2xl border-dashed flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
                style={{ border: `1.5px dashed ${C.border}`, color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}
              >
                <Plus size={13} />
                <span className="text-[12px]">Add another item</span>
              </button>
            )}
          </div>

          {/* Attestation — drafts only, with items */}
          {isDraft && items.length > 0 && (
            <div className="mt-5 p-3.5 rounded-2xl flex items-start gap-2.5" style={{ backgroundColor: C.bone, border: `1px solid ${C.borderSoft}` }}>
              <Check size={14} style={{ color: C.moss, flexShrink: 0, marginTop: 2 }} />
              <div className="text-[11px] leading-relaxed" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
                By submitting, you certify these expenses are legitimate business costs incurred at <strong>{report.client}</strong>. All receipts are attached.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-5 pt-3 flex-shrink-0" style={{ borderTop: `1px solid ${C.borderSoft}`, backgroundColor: C.paper }}>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl"
            style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif', fontSize: 13, fontWeight: 500 }}
          >
            Close
          </button>
          {isDraft && (
            <button
              onClick={() => onSubmit(report.id)}
              disabled={items.length === 0}
              className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-[0.99] transition-transform"
              style={{
                backgroundColor: items.length > 0 ? C.ink : C.borderSoft,
                color: items.length > 0 ? C.cream : C.muted,
                fontFamily: 'Geist, system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: items.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              {items.length > 0 && <Check size={14} />}
              <span className="uppercase tracking-wider">
                {items.length === 0 ? 'Add Items First' : `Submit ${report.client.split(' ')[0]} Report`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// — — — EXPENSES VIEW — — —
// Pay-period & client-scoped expense tracking. The page surfaces:
//   1. A primary "Add expense" card up top (mirrors the Timesheet's Fill-in-the-week pattern)
//   2. Open reports (drafts) — what needs Jerry's attention
//   3. Recently submitted/paid reports — for reference
const ExpensesView = ({ expenses, reports, onAdd, onOpenReport }) => {
  // Section collapse state — Open and Submitted default open (active work),
  // Paid defaults closed since it's historical reference.
  const [openExpanded, setOpenExpanded] = useState(true);
  const [submittedExpanded, setSubmittedExpanded] = useState(true);
  const [paidExpanded, setPaidExpanded] = useState(false);

  // Derive totals/aggregations
  const itemsByReport = (rid) => expenses.filter(e => e.reportId === rid);

  // Group reports by their state buckets
  const draftReports = reports.filter(r => r.status === 'draft');
  const submittedReports = reports.filter(r => r.status === 'pending' || r.status === 'approved');
  const paidReports = reports.filter(r => r.status === 'paid');

  // Period-based grouping for the past sections — most recent first
  const ordered = (rs) => rs.slice().sort((a, b) => b.weekStart - a.weekStart);

  // YTD reimbursement total (paid reports only)
  const ytdTotal = paidReports.reduce(
    (s, r) => s + itemsByReport(r.id).reduce((acc, e) => acc + e.amount, 0), 0
  );

  // Per-section totals for collapsed-state info
  const sumReports = (rs) => rs.reduce(
    (s, r) => s + itemsByReport(r.id).reduce((acc, e) => acc + e.amount, 0), 0
  );
  const draftTotal = sumReports(draftReports);
  const submittedTotal = sumReports(submittedReports);
  const paidTotal = sumReports(paidReports);

  // Reusable collapsible section header. Caller provides label, count, total, expand/setter.
  const SectionHeader = ({ label, count, total, expanded, onToggle, accentColor }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between mb-3 active:opacity-70 transition-opacity"
    >
      <div className="flex items-center gap-2">
        <ChevronDown
          size={12}
          style={{
            color: C.muted,
            transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s',
          }}
        />
        <h3 className="text-[11px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
          {label}
        </h3>
        <span
          className="text-[10px] tabular-nums px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: accentColor || C.bone,
            color: C.inkSoft,
            fontFamily: 'Geist, system-ui, sans-serif',
            fontWeight: 600,
            minWidth: 18,
            textAlign: 'center',
          }}
        >
          {count}
        </span>
      </div>
      <span className="text-[11px] tabular-nums" style={{ color: C.inkSoft, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
        ${total.toFixed(2)}
      </span>
    </button>
  );

  // This pay period total in flight
  const inFlightTotal = [...draftReports, ...submittedReports].reduce(
    (s, r) => s + itemsByReport(r.id).reduce((acc, e) => acc + e.amount, 0), 0
  );

  const ReportRow = ({ report }) => {
    const items = itemsByReport(report.id);
    const total = items.reduce((s, e) => s + e.amount, 0);
    const mileageMiles = items.filter(e => e.kind === 'mileage').reduce((s, e) => s + e.miles, 0);
    const job = JOBS.find(j => j.client === report.client);
    const weekEnd = new Date(report.weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return (
      <button
        onClick={() => onOpenReport(report.id)}
        className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.99]"
        style={{ backgroundColor: C.cream, border: `1px solid ${C.borderSoft}` }}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: job?.color || C.muted }} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium truncate" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
              {report.client}
            </span>
          </div>
          <StatusPill status={report.status} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif' }}>$</span>
              <span className="text-2xl tabular-nums tracking-tight" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 300, color: C.ink }}>
                {total.toFixed(2)}
              </span>
            </div>
            <div className="text-[10px] mt-1.5" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
              {mileageMiles > 0 ? ` · ${mileageMiles.toFixed(0)} mi` : ''} · Week of {monthName(report.weekStart).slice(0,3)} {dayNum(report.weekStart)}
            </div>
          </div>
          <ChevronRight size={16} style={{ color: C.inkSoft }} />
        </div>
      </button>
    );
  };

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
          Expenses
        </div>
        <h1 className="text-3xl tracking-tight mt-1" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
          <span style={{ fontStyle: 'italic' }}>The </span>damages
        </h1>
      </div>

      {/* Snapshot card */}
      <div className="px-5 mt-5">
        <div className="p-5 rounded-2xl" style={{ backgroundColor: C.paper, border: `1px solid ${C.border}` }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                In flight · awaiting reimbursement
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif' }}>$</span>
                <span className="text-5xl tabular-nums tracking-tight" style={{ color: C.ink, fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 300 }}>
                  {inFlightTotal.toFixed(2)}
                </span>
              </div>
              <div className="text-[11px] mt-1.5" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                Across {draftReports.length + submittedReports.length} {draftReports.length + submittedReports.length === 1 ? 'report' : 'reports'}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-[10px]" style={{ color: C.moss, fontFamily: 'Geist, system-ui, sans-serif' }}>
                <TrendingUp size={11} />
                <span className="uppercase tracking-wider">YTD</span>
              </div>
              <div className="text-[13px] tabular-nums font-medium mt-1" style={{ color: C.ink, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
                ${ytdTotal.toFixed(2)}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                paid out
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add expense action */}
      <div className="px-5 mt-4">
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-between p-4 rounded-2xl active:scale-[0.99] transition-transform"
          style={{ backgroundColor: C.lime, border: `1px solid ${C.limeDeep}`, color: C.ink }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: C.ink }}>
              <Plus size={14} style={{ color: C.lime }} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                Add expense
              </div>
              <div className="text-[11px] opacity-70" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                Mileage or regular expense · Receipt required
              </div>
            </div>
          </div>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Open drafts */}
      {draftReports.length > 0 && (
        <div className="px-5 mt-6">
          <SectionHeader
            label="Open · awaiting submission"
            count={draftReports.length}
            total={draftTotal}
            expanded={openExpanded}
            onToggle={() => setOpenExpanded(o => !o)}
            accentColor={C.lime}
          />
          {openExpanded && (
            <div className="space-y-2">
              {ordered(draftReports).map(r => <ReportRow key={r.id} report={r} />)}
            </div>
          )}
        </div>
      )}

      {/* Submitted */}
      {submittedReports.length > 0 && (
        <div className="px-5 mt-6">
          <SectionHeader
            label="Submitted · in supervisor queue"
            count={submittedReports.length}
            total={submittedTotal}
            expanded={submittedExpanded}
            onToggle={() => setSubmittedExpanded(o => !o)}
          />
          {submittedExpanded && (
            <div className="space-y-2">
              {ordered(submittedReports).map(r => <ReportRow key={r.id} report={r} />)}
            </div>
          )}
        </div>
      )}

      {/* Paid */}
      {paidReports.length > 0 && (
        <div className="px-5 mt-6">
          <SectionHeader
            label="Paid · history"
            count={paidReports.length}
            total={paidTotal}
            expanded={paidExpanded}
            onToggle={() => setPaidExpanded(o => !o)}
          />
          {paidExpanded && (
            <div className="space-y-2">
              {ordered(paidReports).map(r => <ReportRow key={r.id} report={r} />)}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {reports.length === 0 && (
        <div className="px-5 mt-6">
          <div
            className="text-center py-10 rounded-2xl border-dashed"
            style={{ border: `1.5px dashed ${C.border}`, backgroundColor: C.cream }}
          >
            <Receipt size={20} style={{ color: C.mutedSoft }} className="mx-auto mb-2" />
            <p className="text-xs" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
              No expenses yet — tap "Add expense" to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// — — — PROFILE VIEW — — —
const ProfileView = () => {
  const stats = [
    { label: 'This week', value: '33.0', unit: 'hrs', sub: '4 shifts' },
    { label: 'This month', value: '142.5', unit: 'hrs', sub: '$3,491 gross' },
    { label: 'YTD', value: '$18,420', unit: '', sub: 'Pre-tax earnings' },
  ];

  const menu = [
    { icon: Briefcase, label: 'Active assignments', value: '4 jobs' },
    { icon: FileText, label: 'Pay stubs & W-2', value: null },
    { icon: Bell, label: 'Notifications', value: null },
    { icon: Settings, label: 'Preferences', value: null },
    { icon: AlertCircle, label: 'Help & support', value: null },
  ];

  return (
    <div className="pb-32">
      <div className="px-5 pt-6 pb-2">
        <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
          Profile
        </div>
      </div>

      {/* Avatar + name */}
      <div className="px-5 mt-3 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: C.ink, color: C.lime, fontFamily: 'Instrument Serif, serif', fontSize: 28, fontStyle: 'italic' }}
        >
          J
        </div>
        <div className="flex-1">
          <h1 className="text-2xl tracking-tight" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
            Jerry Kovac
          </h1>
          <div className="text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
            Employee · ID 70814 · Pacific NW
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-5 mt-6 grid grid-cols-3 gap-2">
        {stats.map((s, i) => (
          <div
            key={i}
            className="p-3 rounded-2xl"
            style={{ backgroundColor: i === 1 ? C.ink : C.cream, color: i === 1 ? C.cream : C.ink, border: i === 1 ? 'none' : `1px solid ${C.borderSoft}` }}
          >
            <div className="text-[9px] uppercase tracking-[0.18em]" style={{ color: i === 1 ? C.mutedSoft : C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
              {s.label}
            </div>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-xl tabular-nums tracking-tight" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontWeight: 400 }}>
                {s.value}
              </span>
              {s.unit && (
                <span className="text-[10px]" style={{ color: i === 1 ? C.mutedSoft : C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  {s.unit}
                </span>
              )}
            </div>
            <div className="text-[10px] mt-1.5" style={{ color: i === 1 ? C.mutedSoft : C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Pay snapshot */}
      <div className="px-5 mt-5">
        <div
          className="p-4 rounded-2xl flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${C.lime} 0%, ${C.limeDeep} 100%)`,
            color: C.ink,
          }}
        >
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] opacity-70" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
              Next payday
            </div>
            <div className="text-lg tracking-tight mt-0.5" style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>
              Friday, in 2 days
            </div>
            <div className="text-[11px] mt-0.5 opacity-70" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
              Direct deposit · est. $812.40 net
            </div>
          </div>
          <div className="p-2.5 rounded-full" style={{ backgroundColor: C.ink }}>
            <Zap size={16} style={{ color: C.lime }} />
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.cream, border: `1px solid ${C.borderSoft}` }}>
          {menu.map((m, i) => {
            const Icon = m.icon;
            return (
              <button
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3.5 ${i > 0 ? 'border-t' : ''}`}
                style={{ borderColor: C.borderSoft }}
              >
                <Icon size={16} style={{ color: C.inkSoft }} />
                <span className="flex-1 text-left text-[13px]" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif' }}>
                  {m.label}
                </span>
                {m.value && (
                  <span className="text-[11px]" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
                    {m.value}
                  </span>
                )}
                <ChevronRight size={14} style={{ color: C.mutedSoft }} />
              </button>
            );
          })}
        </div>

        <button
          className="w-full mt-3 flex items-center justify-center gap-2 py-3.5 rounded-2xl"
          style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}
        >
          <LogOut size={14} />
          <span className="text-[12px]">Sign out</span>
        </button>
      </div>
    </div>
  );
};

// — — — SHIFT REVIEW MODAL — — —
const ShiftReviewModal = ({ shift, onConfirm, onClose }) => {
  const [note, setNote] = useState('');
  if (!shift) return null;
  const job = JOBS.find(j => j.id === shift.jobId);
  const earned = (shift.hours) * job.rate;

  return (
    <div className="absolute inset-0 z-50 flex items-end" style={{ backgroundColor: '#1A161280' }} onClick={onClose}>
      <div
        className="w-full rounded-t-[32px] p-6 pb-8 animate-slide-up"
        style={{ backgroundColor: C.paper }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: C.border }} />

        <div className="text-center mb-5">
          <div className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
            Shift complete
          </div>
          <h2 className="text-3xl tracking-tight" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif' }}>
            <span style={{ fontStyle: 'italic' }}>Nice </span>work.
          </h2>
        </div>

        {/* Summary card */}
        <div
          className="p-5 rounded-2xl mb-4"
          style={{ backgroundColor: C.ink, color: C.cream }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: job.color }} />
            <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
              {job.code} · {job.type}
            </span>
          </div>
          <div className="text-lg mb-4" style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>
            {job.name}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>Start</div>
              <div className="text-base tabular-nums mt-1" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>{shift.start}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>End</div>
              <div className="text-base tabular-nums mt-1" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>{shift.end}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>Hours</div>
              <div className="text-base tabular-nums mt-1" style={{ color: C.lime, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>{shift.hours.toFixed(2)}</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: '#3D3730' }}>
            <span className="text-[11px]" style={{ color: C.mutedSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>You earned</span>
            <span className="text-lg tabular-nums" style={{ color: C.lime, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>${earned.toFixed(2)}</span>
          </div>
        </div>

        {/* Note */}
        <div className="mb-5">
          <label className="text-[10px] uppercase tracking-[0.2em] block mb-2" style={{ color: C.muted, fontFamily: 'Geist, system-ui, sans-serif' }}>
            Add a note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. covered for absent crew, took 30 min lunch..."
            rows={2}
            className="w-full p-3 rounded-xl text-[13px] resize-none focus:outline-none"
            style={{
              backgroundColor: C.cream,
              border: `1px solid ${C.border}`,
              color: C.ink,
              fontFamily: 'Geist, system-ui, sans-serif',
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl"
            style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif', fontSize: 13, fontWeight: 500 }}
          >
            Edit times
          </button>
          <button
            onClick={() => onConfirm(note)}
            className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-[0.99] transition-transform"
            style={{
              backgroundColor: C.ink,
              color: C.cream,
              fontFamily: 'Geist, system-ui, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            <Check size={14} />
            <span className="uppercase tracking-wider">Submit Shift</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// — — — TOAST — — —
const Toast = ({ message }) => (
  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] animate-toast-in">
    <div
      className="px-4 py-2.5 rounded-full flex items-center gap-2"
      style={{ backgroundColor: C.ink, color: C.lime, boxShadow: `0 8px 24px -4px ${C.ink}60` }}
    >
      <Check size={14} />
      <span className="text-[12px] font-medium" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
        {message}
      </span>
    </div>
  </div>
);

// — — — BOTTOM NAV — — —
const BottomNav = ({ tab, setTab, clockedIn }) => {
  const items = [
    { id: 'today', label: 'Today', icon: Clock },
    { id: 'timesheet', label: 'Timesheet', icon: Calendar },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-2" style={{ background: `linear-gradient(to top, ${C.bone} 60%, ${C.bone}00)` }}>
      <div
        className="flex items-center justify-around p-1.5 rounded-full"
        style={{
          backgroundColor: C.ink,
          boxShadow: `0 8px 32px -8px ${C.ink}80`,
        }}
      >
        {items.map(item => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="relative flex items-center gap-2 transition-all duration-200"
              style={{
                backgroundColor: active ? C.lime : 'transparent',
                color: active ? C.ink : C.mutedSoft,
                borderRadius: '999px',
                padding: active ? '10px 16px' : '10px 12px',
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              {active && (
                <span className="text-[12px] font-semibold" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                  {item.label}
                </span>
              )}
              {item.id === 'today' && clockedIn && !active && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: C.lime }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// — — — MAIN APP — — —
export default function App() {
  const [tab, setTab] = useState('today');
  const [selectedJob, setSelectedJob] = useState(JOBS[0]);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockStart, setClockStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [reviewShift, setReviewShift] = useState(null);
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [openReportId, setOpenReportId] = useState(null);
  const [toast, setToast] = useState(null);

  // Live timer
  useEffect(() => {
    if (!clockedIn || !clockStart) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - clockStart) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [clockedIn, clockStart]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleClockIn = () => {
    setClockStart(Date.now());
    setElapsed(0);
    setClockedIn(true);
  };

  const handleClockOut = () => {
    const startDate = new Date(clockStart);
    const endDate = new Date();
    const hours = (endDate - startDate) / 3600000;
    const fmt = (d) => `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    setReviewShift({
      jobId: selectedJob.id,
      start: fmt(startDate),
      end: fmt(endDate),
      hours: Math.max(hours, 0.01),
      date: new Date(),
    });
    setClockedIn(false);
  };

  const confirmShift = (note) => {
    const newEntry = {
      id: Date.now(),
      jobId: reviewShift.jobId,
      date: reviewShift.date,
      start: reviewShift.start,
      end: reviewShift.end,
      hours: parseFloat(reviewShift.hours.toFixed(2)),
      regularH: parseFloat(reviewShift.hours.toFixed(2)),
      otH: 0,
      dtH: 0,
      status: 'draft',
      note,
    };
    setEntries([newEntry, ...entries]);
    setReviewShift(null);
    showToast('Shift saved · submit timecard to send for approval');
  };

  const cancelReview = () => {
    setReviewShift(null);
  };

  const handleSubmitClient = (clientName) => {
    setEntries(entries.map(e => {
      const job = JOBS.find(j => j.id === e.jobId);
      if (job?.client === clientName && e.status === 'draft') {
        return { ...e, status: 'pending' };
      }
      return e;
    }));
    showToast(`${clientName} timecard submitted for approval`);
  };

  const handlePunchSubmit = (payload) => {
    const targetDate = payload.date || new Date();
    const targetJobId = payload.jobId || selectedJob.id;
    const editingId = payload.editingId || null;
    const isEditing = !!editingId;

    // Normalize: if payload.punches exists, use it; otherwise wrap the legacy single-punch fields
    const punchList = payload.punches || [{
      start: payload.start,
      end: payload.end,
      hours: payload.hours,
      paycode: payload.paycode,
      costCenter: payload.costCenter,
    }];
    const sharedComment = payload.comment || '';

    const parseMin = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    // Defense in depth: validate every punch against existing entries AND against each other.
    // When editing, exclude the entry being edited from the overlap check (an entry shouldn't conflict with itself).
    const dayList = entries.filter(e => sameDay(e.date, targetDate) && (!isEditing || e.id !== editingId));
    for (let i = 0; i < punchList.length; i++) {
      const p = punchList[i];
      const ps = parseMin(p.start);
      const pe = parseMin(p.end);
      if (pe <= ps) {
        showToast('Invalid punch times · nothing logged');
        return;
      }
      const externalOverlap = dayList.find(e => {
        const eS = parseMin(e.start);
        const eE = parseMin(e.end);
        return ps < eE && pe > eS;
      });
      if (externalOverlap) {
        showToast('Overlap detected · nothing logged');
        return;
      }
      const internalOverlap = punchList.find((other, j) => {
        if (j === i) return false;
        const os = parseMin(other.start);
        const oe = parseMin(other.end);
        return ps < oe && pe > os;
      });
      if (internalOverlap) {
        showToast('Punches overlap each other · nothing logged');
        return;
      }
    }

    if (isEditing) {
      // Edit replaces the existing entry with a single updated punch (edit mode is single-punch only).
      const original = entries.find(e => e.id === editingId);
      if (!original) return;

      // Block edits on paid entries — payroll already processed them.
      if (original.status === 'paid') {
        showToast("Can't edit · already paid");
        return;
      }

      const p = punchList[0];
      // If a previously live-captured entry has its times changed, the integrity of the live
      // capture is broken — flip it to manually-entered so the audit trail stays honest.
      const timesChanged = p.start !== original.start || p.end !== original.end;
      const becomesManual = timesChanged && original.manuallyEntered !== true;
      // Submitted entries get rescinded to draft on edit. Worker re-submits when ready.
      const wasSubmitted = original.status === 'pending' || original.status === 'approved';
      const newStatus = wasSubmitted ? 'draft' : original.status;

      setEntries(prev => prev.map(e => e.id === editingId
        ? {
            ...e,
            jobId: targetJobId,
            date: targetDate,
            start: p.start,
            end: p.end,
            hours: parseFloat(p.hours.toFixed(2)),
            regularH: parseFloat(p.hours.toFixed(2)),
            otH: 0,
            dtH: 0,
            note: sharedComment,
            paycode: p.paycode,
            costCenter: p.costCenter,
            status: newStatus,
            manuallyEntered: original.manuallyEntered || becomesManual,
          }
        : e));

      if (wasSubmitted) {
        showToast('Updated · rescinded to draft for resubmit');
      } else {
        showToast('Punch updated');
      }
      return;
    }

    // Build all new entries; share a date but each gets its own id and times.
    // manuallyEntered: true marks these as backfilled rather than captured live — the badge
    // surfaces this on every entry view so supervisors know what they're approving.
    const baseId = Date.now();
    const newEntries = punchList.map((p, i) => ({
      id: baseId + i,
      jobId: targetJobId,
      date: targetDate,
      start: p.start,
      end: p.end,
      hours: parseFloat(p.hours.toFixed(2)),
      regularH: parseFloat(p.hours.toFixed(2)),
      otH: 0,
      dtH: 0,
      status: 'draft',
      manuallyEntered: true,
      note: sharedComment,
      paycode: p.paycode,
      costCenter: p.costCenter,
    }));

    setEntries([...newEntries, ...entries]);

    const totalH = newEntries.reduce((s, e) => s + e.hours, 0);
    const isToday = sameDay(targetDate, new Date());
    const dateLabel = isToday ? '' : ' · ' + targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (newEntries.length === 1) {
      showToast(`${totalH.toFixed(2)}h punch saved as draft${dateLabel}`);
    } else {
      showToast(`${newEntries.length} punches saved · ${totalH.toFixed(2)}h total${dateLabel}`);
    }
  };

  const handleDeletePunch = (id) => {
    const target = entries.find(e => e.id === id);
    if (!target) return;
    if (target.status === 'paid') {
      showToast("Can't delete · already paid");
      return;
    }
    const wasSubmitted = target.status === 'pending' || target.status === 'approved';
    setEntries(prev => prev.filter(e => e.id !== id));
    if (wasSubmitted) {
      showToast('Deleted · rescinded from supervisor');
    } else {
      showToast('Punch deleted');
    }
  };

  // — — — EXPENSE HANDLERS — — —

  // Resolve which report an expense belongs to based on its (client, week). Creates the report
  // on the fly if one doesn't exist yet — workers don't think about reports until they submit.
  const resolveReportFor = (date, jobId, currentReports) => {
    const job = JOBS.find(j => j.id === jobId);
    if (!job) return { reportId: null, reports: currentReports };
    // Compute Sunday of that week
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    const existing = currentReports.find(r =>
      r.client === job.client && sameDay(r.weekStart, start) && r.status === 'draft'
    );
    if (existing) return { reportId: existing.id, reports: currentReports };
    const newReport = {
      id: `rpt-${start.getTime()}-${job.client.replace(/\s+/g, '').toLowerCase()}`,
      client: job.client,
      weekStart: start,
      status: 'draft',
    };
    return { reportId: newReport.id, reports: [...currentReports, newReport] };
  };

  const handleExpenseSubmit = (payload) => {
    const isEditing = !!payload.editingId;

    if (isEditing) {
      const original = expenses.find(e => e.id === payload.editingId);
      if (!original) return;
      const report = reports.find(r => r.id === original.reportId);
      if (report?.status === 'paid') {
        showToast("Can't edit · already paid");
        return;
      }

      // Rescind if the report was submitted — same pattern as timecards
      const wasSubmitted = report?.status === 'pending' || report?.status === 'approved';
      if (wasSubmitted) {
        setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'draft' } : r));
      }

      // If the (client, week) changed, the expense needs to move to a different report
      let nextReports = wasSubmitted
        ? reports.map(r => r.id === report.id ? { ...r, status: 'draft' } : r)
        : reports;
      const { reportId, reports: maybeNew } = resolveReportFor(payload.date, payload.jobId, nextReports);
      nextReports = maybeNew;

      setReports(nextReports);
      setExpenses(prev => prev.map(e => e.id === payload.editingId
        ? {
            ...e,
            kind: payload.kind,
            jobId: payload.jobId,
            date: payload.date,
            note: payload.note,
            receipt: payload.receipt,
            reportId,
            ...(payload.kind === 'regular'
              ? { amount: payload.amount, category: payload.category, vendor: payload.vendor, miles: undefined, tripFrom: undefined, tripTo: undefined }
              : { amount: payload.amount, miles: payload.miles, tripFrom: payload.tripFrom, tripTo: payload.tripTo, category: undefined, vendor: undefined }),
          }
        : e));

      if (wasSubmitted) {
        showToast('Updated · report rescinded to draft');
      } else {
        showToast('Expense updated');
      }
      setEditingExpense(null);
      setExpenseModalOpen(false);
      return;
    }

    // New expense
    const { reportId, reports: nextReports } = resolveReportFor(payload.date, payload.jobId, reports);
    setReports(nextReports);
    const newExpense = {
      id: Date.now(),
      kind: payload.kind,
      jobId: payload.jobId,
      reportId,
      date: payload.date,
      note: payload.note,
      receipt: payload.receipt,
      ...(payload.kind === 'regular'
        ? { amount: payload.amount, category: payload.category, vendor: payload.vendor }
        : { amount: payload.amount, miles: payload.miles, tripFrom: payload.tripFrom, tripTo: payload.tripTo }),
    };
    setExpenses(prev => [newExpense, ...prev]);
    setExpenseModalOpen(false);

    if (payload.kind === 'mileage') {
      showToast(`${payload.miles} mi logged · $${payload.amount.toFixed(2)}`);
    } else {
      showToast(`Expense saved · $${payload.amount.toFixed(2)}`);
    }
  };

  const handleExpenseDelete = (id) => {
    const target = expenses.find(e => e.id === id);
    if (!target) return;
    const report = reports.find(r => r.id === target.reportId);
    if (report?.status === 'paid') {
      showToast("Can't delete · already paid");
      return;
    }
    const wasSubmitted = report?.status === 'pending' || report?.status === 'approved';
    if (wasSubmitted) {
      setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'draft' } : r));
    }
    setExpenses(prev => prev.filter(e => e.id !== id));
    setEditingExpense(null);
    setExpenseModalOpen(false);
    if (wasSubmitted) {
      showToast('Deleted · report rescinded from supervisor');
    } else {
      showToast('Expense deleted');
    }
  };

  const handleSubmitReport = (reportId) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'pending' } : r));
    setOpenReportId(null);
    const report = reports.find(r => r.id === reportId);
    showToast(`${report?.client.split(' ')[0]} expense report submitted`);
  };

  const handleOpenReport = (reportId) => {
    setOpenReportId(reportId);
  };

  const handleAddExpenseFromReport = () => {
    setOpenReportId(null);
    setEditingExpense(null);
    setExpenseModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    const report = reports.find(r => r.id === expense.reportId);
    setOpenReportId(null);
    setEditingExpense({ ...expense, reportStatus: report?.status });
    setExpenseModalOpen(true);
  };

  const todayEntries = entries.filter(e => sameDay(e.date, new Date()));

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#E8E2D5' }}>
      {/* Fonts + animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.32s cubic-bezier(0.32, 0.72, 0.2, 1); }

        @keyframes toast-in {
          0% { transform: translateY(-20px) translateX(-50%); opacity: 0; }
          100% { transform: translateY(0) translateX(-50%); opacity: 1; }
        }
        .animate-toast-in { animation: toast-in 0.28s cubic-bezier(0.32, 0.72, 0.2, 1); }

        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Phone frame */}
      <div className="relative" style={{ width: 400, maxWidth: '100%' }}>
        {/* Soft shadow underneath */}
        <div
          className="absolute -inset-6 rounded-[60px] -z-10"
          style={{ background: `radial-gradient(ellipse at center, ${C.ink}15, transparent 70%)` }}
        />
        <div
          className="relative overflow-hidden"
          style={{
            backgroundColor: C.bone,
            borderRadius: '44px',
            border: `8px solid ${C.ink}`,
            height: 820,
            boxShadow: `0 20px 60px -20px ${C.ink}60, inset 0 0 0 1px ${C.ink}20`,
          }}
        >
          {/* iOS-style status bar */}
          <div className="flex items-center justify-between px-7 pt-3 pb-1" style={{ color: C.ink, fontFamily: 'Geist, system-ui, sans-serif', fontSize: 12, fontWeight: 600 }}>
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">●●●●</span>
              <span className="text-[10px]">5G</span>
              <div className="w-6 h-2.5 rounded-sm border flex items-center justify-end pr-0.5" style={{ borderColor: C.ink }}>
                <div className="w-4 h-1.5 rounded-sm" style={{ backgroundColor: C.ink }} />
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 28px)' }}>
            {tab === 'today' && (
              <TodayView
                selectedJob={selectedJob}
                setSelectedJob={setSelectedJob}
                clockedIn={clockedIn}
                clockStart={clockStart}
                elapsed={elapsed}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
                onSubmitPunch={handlePunchSubmit}
                onEditEntry={handlePunchSubmit}
                onDeleteEntry={handleDeletePunch}
                allEntries={entries}
                todayEntries={todayEntries}
              />
            )}
            {tab === 'timesheet' && <TimesheetView entries={entries} onSubmitClient={handleSubmitClient} onAddPunch={handlePunchSubmit} onDeletePunch={handleDeletePunch} />}
            {tab === 'expenses' && (
              <ExpensesView
                expenses={expenses}
                reports={reports}
                onAdd={() => { setEditingExpense(null); setExpenseModalOpen(true); }}
                onOpenReport={handleOpenReport}
              />
            )}
            {tab === 'profile' && <ProfileView />}
          </div>

          {/* Modals + toasts inside phone frame */}
          {reviewShift && <ShiftReviewModal shift={reviewShift} onConfirm={confirmShift} onClose={cancelReview} />}
          {expenseModalOpen && (
            <AddExpenseModal
              reports={reports}
              jobs={JOBS}
              editingExpense={editingExpense}
              onSubmit={handleExpenseSubmit}
              onDelete={handleExpenseDelete}
              onClose={() => { setExpenseModalOpen(false); setEditingExpense(null); }}
            />
          )}
          {openReportId && (
            <ReportDetailModal
              report={reports.find(r => r.id === openReportId)}
              items={expenses.filter(e => e.reportId === openReportId)}
              jobs={JOBS}
              onAddItem={handleAddExpenseFromReport}
              onEditItem={handleEditExpense}
              onDeleteItem={handleExpenseDelete}
              onSubmit={handleSubmitReport}
              onClose={() => setOpenReportId(null)}
            />
          )}
          {toast && <Toast message={toast} />}

          {/* Bottom nav */}
          <BottomNav tab={tab} setTab={setTab} clockedIn={clockedIn} />
        </div>

        {/* Caption under phone */}
        <div className="text-center mt-6">
          <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: C.inkSoft, fontFamily: 'Geist, system-ui, sans-serif' }}>
            Concept · Internal Time & Expense
          </div>
          <div className="text-base mt-0.5" style={{ color: C.ink, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>
            Tap "Clock In" to feel the state change
          </div>
        </div>
      </div>
    </div>
  );
}
