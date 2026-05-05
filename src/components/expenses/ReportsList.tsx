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
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dayLabel, dayNum, fmtMoney, monthName, cn } from '@/lib/utils';
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
      <Card className="p-12 text-center mb-6 border-dashed">
        <Receipt className="size-5 text-muted-foreground/60 mx-auto mb-2" />
        <div className="text-base text-muted-foreground">No reports in this view</div>
        <div className="text-xs mt-1 text-muted-foreground/70">
          Switch tabs above or add a new expense to populate a draft report.
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden mb-6 p-0 gap-0">
      {/* Header row */}
      <div
        className="grid items-center px-5 py-2.5 bg-muted border-b text-[10px] uppercase tracking-widest text-muted-foreground font-medium"
        style={{ gridTemplateColumns: COL }}
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
    </Card>
  );
}

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
  const accent = job?.color ?? 'currentColor';
  const canSubmit = isOpenStatus(report.status);
  const submitted = !canSubmit;

  const weekEnd = new Date(report.weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const sortedItems = [...items].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div>
      {/* Band header */}
      <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-b">
        <button
          onClick={() => setExpanded((o) => !o)}
          className="flex items-center gap-3 text-left flex-1 min-w-0"
        >
          {expanded ? (
            <ChevronDown className="size-3.5 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="size-3.5 text-muted-foreground flex-shrink-0" />
          )}
          <span
            className="block w-1.5 h-7 rounded-full flex-shrink-0"
            style={{ backgroundColor: accent }}
          />
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm font-medium truncate">{report.client}</span>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                Week of {monthName(report.weekStart).slice(0, 3)} {dayNum(report.weekStart)} —{' '}
                {monthName(weekEnd).slice(0, 3)} {dayNum(weekEnd)}
              </span>
            </div>
            <div className="text-[10px] mt-0.5 tabular-nums uppercase tracking-wider text-muted-foreground/70">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
              {mileage > 0 && ` · ${mileage.toFixed(0)} mi`}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-base tabular-nums font-semibold font-mono">{fmtMoney(total)}</span>
          <StatusPill status={report.status} size="md" />
          <Button
            onClick={onSubmit}
            disabled={!canSubmit}
            size="sm"
            variant={canSubmit ? 'default' : 'outline'}
            className="gap-1.5 uppercase tracking-wide text-[11px]"
            title={
              submitted
                ? 'This report has already been submitted'
                : 'Submit this expense report'
            }
          >
            {submitted ? (
              <>
                <Check className="size-3" />
                Submitted
              </>
            ) : report.status === 'rejected' ? (
              <>
                Resubmit
                <ArrowUpRight className="size-3" />
              </>
            ) : (
              <>
                Submit
                <ArrowUpRight className="size-3" />
              </>
            )}
          </Button>
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
          {onAddItem && isOpenStatus(report.status) && (
            <button
              onClick={onAddItem}
              className="w-full grid items-center px-5 py-2.5 transition-colors hover:bg-accent/50 text-left text-muted-foreground border-b bg-card"
              style={{ gridTemplateColumns: COL }}
            >
              <span className="col-span-8 flex items-center gap-2 text-xs">
                <Plus className="size-3" />
                Add a line item to this report
              </span>
            </button>
          )}
          {/* Subtotal row */}
          <div
            className="grid items-center px-5 py-2.5 bg-muted/40 border-b"
            style={{ gridTemplateColumns: COL }}
          >
            <span></span>
            <span></span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              Subtotal · {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
            <span></span>
            <span className="text-right tabular-nums text-sm font-medium font-mono">
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

interface LineItemRowProps {
  item: ExpenseItem;
  locked: boolean;
  onMenu?: (item: ExpenseItem) => void;
  onReceiptClick?: (item: ExpenseItem) => void;
}

function LineItemRow({ item, locked, onMenu, onReceiptClick }: LineItemRowProps) {
  const isMileage = item.kind === 'mileage';

  const description = isMileage
    ? `${item.tripFrom ?? '—'} → ${item.tripTo ?? '—'}`
    : item.vendor ?? '—';
  const subDescription = isMileage
    ? `${(item.miles ?? 0).toFixed(0)} mi · ${item.note ?? ''}`.replace(/\s·\s$/, '')
    : item.note ?? '';

  return (
    <div
      className={cn(
        'grid items-center px-5 py-2.5 transition-colors group hover:bg-accent/50 border-b bg-card',
        locked && 'opacity-85',
      )}
      style={{ gridTemplateColumns: COL }}
    >
      {/* Date */}
      <span className="text-xs tabular-nums text-foreground/80">
        {dayLabel(item.date).slice(0, 3)} {monthName(item.date).slice(0, 3)} {dayNum(item.date)}
      </span>

      {/* Type */}
      <Badge
        variant="outline"
        className={cn(
          'uppercase tracking-wide text-[10px] gap-1 w-fit',
          isMileage
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60'
            : 'bg-muted text-muted-foreground border-transparent',
        )}
      >
        {isMileage ? <Car className="size-2.5" /> : <Receipt className="size-2.5" />}
        {isMileage ? 'Mileage' : 'Expense'}
      </Badge>

      {/* Vendor / Trip + note */}
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{description}</div>
        {subDescription && (
          <div className="text-[11px] italic truncate mt-0.5 text-muted-foreground">
            {isMileage ? subDescription : `“${subDescription}”`}
          </div>
        )}
      </div>

      {/* Category */}
      <span className="text-xs truncate text-foreground/80">
        {isMileage ? 'Mileage · IRS rate' : item.category ?? '—'}
      </span>

      {/* Amount */}
      <span className="text-right tabular-nums text-sm font-medium font-mono">
        {fmtMoney(item.amount)}
      </span>

      {/* Receipt */}
      <button
        onClick={() => onReceiptClick?.(item)}
        className={cn(
          'flex items-center gap-1.5 text-left transition-colors hover:underline text-[11px]',
          item.receipt ? 'text-foreground/80' : 'text-muted-foreground/60',
        )}
        disabled={!item.receipt}
        title={item.receipt ? `View ${item.receipt.label}` : 'No receipt attached'}
      >
        <Paperclip className="size-3" />
        <span className="truncate">{item.receipt?.label ?? 'Missing'}</span>
      </button>

      {/* Status (uses parent report's status; line items inherit) */}
      <span></span>

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          onClick={() => onMenu?.(item)}
          variant="ghost"
          size="icon"
          className="size-7 opacity-0 group-hover:opacity-100"
          aria-label="Row actions"
          disabled={locked}
        >
          {locked ? <Lock className="size-3" /> : <MoreHorizontal className="size-3.5" />}
        </Button>
      </div>
    </div>
  );
}
