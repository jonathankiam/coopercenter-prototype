'use client';

import { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Lock,
  MoreHorizontal,
  Paperclip,
  Plus,
  Receipt,
  Car,
} from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { dayLabel, dayNum, fmtMoney, monthName } from '@/lib/utils';
import StatusPill from '@/components/StatusPill';
import type { ExpenseItem } from '@/lib/types';
import type { ReportSummary } from '@/lib/expenses';
import { isOpenStatus } from '@/lib/expenses';

interface ReportsListProps {
  summaries: ReportSummary[];
  defaultExpandStatuses?: Set<string>;
  onSubmitReport: (reportId: string) => void;
  onAddItemToReport?: (reportId: string) => void;
  onItemMenu?: (item: ExpenseItem) => void;
  onReceiptClick?: (item: ExpenseItem) => void;
}

// Spreadsheet column template — Date / Type / Vendor or Trip / Category / Amount / Receipt / Status / actions
const COL = '110px 90px minmax(220px, 1.4fr) 150px 110px 130px 110px 36px';

export default function ReportsList({
  summaries,
  defaultExpandStatuses,
  onSubmitReport,
  onAddItemToReport,
  onItemMenu,
  onReceiptClick,
}: ReportsListProps) {
  if (summaries.length === 0) {
    return (
      <div
        className="rounded-2xl p-12 text-center mb-6"
        style={{ backgroundColor: C.cream, border: `1px dashed ${C.border}` }}
      >
        <Receipt size={22} style={{ color: C.mutedSoft, margin: '0 auto 10px' }} />
        <div
          className="text-[16px]"
          style={{ color: C.muted, fontFamily: FONTS.serif, fontStyle: 'italic' }}
        >
          No reports in this view
        </div>
        <div
          className="text-[11px] mt-1"
          style={{ color: C.mutedSoft, fontFamily: FONTS.sans }}
        >
          Switch tabs above or add a new expense to populate a draft report.
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden mb-6"
      style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
    >
      {/* Header row */}
      <div
        className="grid items-center px-5 py-2.5"
        style={{
          gridTemplateColumns: COL,
          backgroundColor: C.bone,
          borderBottom: `1px solid ${C.border}`,
          color: C.muted,
          fontFamily: FONTS.sans,
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        <span>Date</span>
        <span>Type</span>
        <span>Vendor · Trip · Note</span>
        <span>Category</span>
        <span className="text-right">Amount</span>
        <span>Receipt</span>
        <span>Status</span>
        <span></span>
      </div>

      {summaries.map((s) => (
        <ReportBand
          key={s.report.id}
          summary={s}
          defaultExpanded={defaultExpandStatuses?.has(s.report.status) ?? true}
          onSubmit={() => onSubmitReport(s.report.id)}
          onAddItem={onAddItemToReport ? () => onAddItemToReport(s.report.id) : undefined}
          onItemMenu={onItemMenu}
          onReceiptClick={onReceiptClick}
        />
      ))}
    </div>
  );
}

// ─── Report band ─── //

interface ReportBandProps {
  summary: ReportSummary;
  defaultExpanded: boolean;
  onSubmit: () => void;
  onAddItem?: () => void;
  onItemMenu?: (item: ExpenseItem) => void;
  onReceiptClick?: (item: ExpenseItem) => void;
}

function ReportBand({
  summary,
  defaultExpanded,
  onSubmit,
  onAddItem,
  onItemMenu,
  onReceiptClick,
}: ReportBandProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { report, job, items, total, mileage, itemCount } = summary;
  const accent = job?.color ?? C.muted;
  const canSubmit = isOpenStatus(report.status);
  const submitted = !canSubmit;

  const weekEnd = new Date(report.weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  // Sort items by date ascending so the oldest expense in the period appears first
  const sortedItems = [...items].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div>
      {/* Band header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          backgroundColor: C.paper,
          borderBottom: expanded ? `1px solid ${C.borderSoft}` : `1px solid ${C.border}`,
        }}
      >
        <button
          onClick={() => setExpanded((o) => !o)}
          className="flex items-center gap-3 text-left flex-1 min-w-0"
        >
          {expanded ? (
            <ChevronDown size={14} style={{ color: C.muted, flexShrink: 0 }} />
          ) : (
            <ChevronRight size={14} style={{ color: C.muted, flexShrink: 0 }} />
          )}
          <span
            className="block w-1.5 h-7 rounded-full flex-shrink-0"
            style={{ backgroundColor: accent }}
          />
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className="text-[14px] font-medium truncate"
                style={{ color: C.ink, fontFamily: FONTS.sans }}
              >
                {report.client}
              </span>
              <span
                className="text-[11px] tabular-nums"
                style={{ color: C.muted, fontFamily: FONTS.sans }}
              >
                Week of {monthName(report.weekStart).slice(0, 3)} {dayNum(report.weekStart)} — {monthName(weekEnd).slice(0, 3)} {dayNum(weekEnd)}
              </span>
            </div>
            <div
              className="text-[10px] mt-0.5 tabular-nums uppercase tracking-wider"
              style={{ color: C.mutedSoft, fontFamily: FONTS.sans }}
            >
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
              {mileage > 0 && ` · ${mileage.toFixed(0)} mi`}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            className="text-[16px] tabular-nums font-medium"
            style={{ color: C.ink, fontFamily: FONTS.mono }}
          >
            {fmtMoney(total)}
          </span>
          <StatusPill status={report.status} size="md" />
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="flex items-center gap-1.5 h-8 px-3 rounded-full transition-all"
            style={{
              backgroundColor: canSubmit ? C.lime : C.bone,
              color: canSubmit ? C.ink : C.muted,
              border: `1px solid ${canSubmit ? C.limeDeep : C.borderSoft}`,
              fontFamily: FONTS.sans,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.05em',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
            title={
              submitted
                ? 'This report has already been submitted'
                : 'Submit this expense report'
            }
          >
            {submitted ? (
              <>
                <Check size={11} strokeWidth={2.5} />
                <span className="uppercase">Submitted</span>
              </>
            ) : report.status === 'rejected' ? (
              <>
                <span className="uppercase">Resubmit</span>
                <ArrowUpRight size={11} strokeWidth={2.5} />
              </>
            ) : (
              <>
                <span className="uppercase">Submit</span>
                <ArrowUpRight size={11} strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded item rows */}
      {expanded && (
        <>
          {sortedItems.map((item) => (
            <LineItemRow
              key={item.id}
              item={item}
              locked={!isOpenStatus(report.status)}
              onMenu={onItemMenu}
              onReceiptClick={onReceiptClick}
            />
          ))}
          {/* Add-item row appears only on draft/rejected reports */}
          {onAddItem && isOpenStatus(report.status) && (
            <button
              onClick={onAddItem}
              className="w-full grid items-center px-5 py-2.5 transition-colors hover:bg-white/40 text-left"
              style={{
                gridTemplateColumns: COL,
                borderBottom: `1px solid ${C.borderSoft}`,
                backgroundColor: C.cream,
                color: C.muted,
                fontFamily: FONTS.sans,
              }}
            >
              <span className="col-span-8 flex items-center gap-2 text-[12px]">
                <Plus size={12} strokeWidth={2.4} />
                Add a line item to this report
              </span>
            </button>
          )}
          {/* Subtotal row */}
          <div
            className="grid items-center px-5 py-2.5"
            style={{
              gridTemplateColumns: COL,
              backgroundColor: C.bone,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <span></span>
            <span></span>
            <span
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: C.muted, fontFamily: FONTS.sans }}
            >
              Subtotal · {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
            <span></span>
            <span
              className="text-right tabular-nums text-[14px] font-medium"
              style={{ color: C.ink, fontFamily: FONTS.mono }}
            >
              {fmtMoney(total)}
            </span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Line item row ─── //

interface LineItemRowProps {
  item: ExpenseItem;
  locked: boolean;
  onMenu?: (item: ExpenseItem) => void;
  onReceiptClick?: (item: ExpenseItem) => void;
}

function LineItemRow({ item, locked, onMenu, onReceiptClick }: LineItemRowProps) {
  const isMileage = item.kind === 'mileage';

  // For regular expenses we show vendor + note; for mileage we show "From → To · X mi"
  const description = isMileage
    ? `${item.tripFrom ?? '—'} → ${item.tripTo ?? '—'}`
    : item.vendor ?? '—';
  const subDescription = isMileage
    ? `${(item.miles ?? 0).toFixed(0)} mi · ${item.note ?? ''}`.replace(/\s·\s$/, '')
    : item.note ?? '';

  return (
    <div
      className="grid items-center px-5 py-2.5 transition-colors group hover:bg-white/40"
      style={{
        gridTemplateColumns: COL,
        borderBottom: `1px solid ${C.borderSoft}`,
        backgroundColor: C.cream,
        opacity: locked ? 0.85 : 1,
      }}
    >
      {/* Date */}
      <span
        className="text-[12px] tabular-nums"
        style={{ color: C.inkSoft, fontFamily: FONTS.sans }}
      >
        {dayLabel(item.date).slice(0, 3)} {monthName(item.date).slice(0, 3)} {dayNum(item.date)}
      </span>

      {/* Type */}
      <div
        className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-2 py-0.5 rounded w-fit"
        style={{
          backgroundColor: isMileage ? '#E5EFE5' : C.bone,
          color: isMileage ? '#3F5320' : C.inkSoft,
          fontFamily: FONTS.sans,
        }}
      >
        {isMileage ? <Car size={10} strokeWidth={2.4} /> : <Receipt size={10} strokeWidth={2.4} />}
        {isMileage ? 'Mileage' : 'Expense'}
      </div>

      {/* Vendor / Trip + note */}
      <div className="min-w-0">
        <div
          className="text-[13px] font-medium truncate"
          style={{ color: C.ink, fontFamily: FONTS.sans }}
        >
          {description}
        </div>
        {subDescription && (
          <div
            className="text-[11px] italic truncate mt-0.5"
            style={{ color: C.muted, fontFamily: FONTS.sans }}
          >
            {isMileage ? subDescription : `“${subDescription}”`}
          </div>
        )}
      </div>

      {/* Category */}
      <span
        className="text-[12px] truncate"
        style={{ color: C.inkSoft, fontFamily: FONTS.sans }}
      >
        {isMileage ? 'Mileage · IRS rate' : item.category ?? '—'}
      </span>

      {/* Amount */}
      <span
        className="text-right tabular-nums text-[14px] font-medium"
        style={{ color: C.ink, fontFamily: FONTS.mono }}
      >
        {fmtMoney(item.amount)}
      </span>

      {/* Receipt */}
      <button
        onClick={() => onReceiptClick?.(item)}
        className="flex items-center gap-1.5 text-left transition-colors hover:underline"
        style={{
          color: item.receipt ? C.inkSoft : C.mutedSoft,
          fontFamily: FONTS.sans,
          fontSize: 11,
        }}
        disabled={!item.receipt}
        title={item.receipt ? `View ${item.receipt.label}` : 'No receipt attached'}
      >
        <Paperclip size={11} strokeWidth={2.2} />
        <span className="truncate">{item.receipt?.label ?? 'Missing'}</span>
      </button>

      {/* Status (uses parent report's status; line items inherit) */}
      <span></span>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={() => onMenu?.(item)}
          className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/60"
          style={{ color: C.muted }}
          aria-label="Row actions"
          disabled={locked}
        >
          {locked ? <Lock size={12} /> : <MoreHorizontal size={14} />}
        </button>
      </div>
    </div>
  );
}
