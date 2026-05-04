'use client';

import { Fragment, useState } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { dayLabel, dayNum, fmtMoney, monthName } from '@/lib/utils';
import { cn } from '@/lib/cn';
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
      <Card className="p-12 text-center mb-6 border-dashed shadow-none">
        <Receipt size={22} className="text-muted-foreground mx-auto mb-2.5" />
        <div className="text-[15px] font-medium text-muted-foreground">
          No reports in this view
        </div>
        <div className="text-[11px] mt-1 text-muted-foreground/70">
          Switch tabs above or add a new expense to populate a draft report.
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden mb-6 py-0 shadow-none">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[120px] px-5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Date
            </TableHead>
            <TableHead className="w-[100px] text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Type
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Vendor · Trip · Note
            </TableHead>
            <TableHead className="w-[160px] text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Category
            </TableHead>
            <TableHead className="w-[110px] text-right text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Amount
            </TableHead>
            <TableHead className="w-[140px] text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Receipt
            </TableHead>
            <TableHead className="w-[120px] text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="w-[44px] px-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground" />
          </TableRow>
        </TableHeader>

        <TableBody>
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
        </TableBody>
      </Table>
    </Card>
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
  const { report, items, total, mileage, itemCount } = summary;
  const canSubmit = isOpenStatus(report.status);
  const submitted = !canSubmit;

  const weekEnd = new Date(report.weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  // Sort items by date ascending so the oldest expense in the period appears first
  const sortedItems = [...items].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Fragment>
      {/* Band header */}
      <tr className="border-b bg-muted/20">
        <td colSpan={8} className="px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setExpanded((o) => !o)}
              className="flex items-center gap-3 text-left flex-1 min-w-0"
            >
              {expanded ? (
                <ChevronDown size={14} className="text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
              )}
              <span className="block w-1.5 h-7 rounded-full flex-shrink-0 bg-foreground/60" />
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[14px] font-medium truncate text-foreground">
                    {report.client}
                  </span>
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    Week of {monthName(report.weekStart).slice(0, 3)} {dayNum(report.weekStart)} — {monthName(weekEnd).slice(0, 3)} {dayNum(weekEnd)}
                  </span>
                </div>
                <div className="text-[10px] mt-0.5 tabular-nums uppercase tracking-wider text-muted-foreground">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  {mileage > 0 && ` · ${mileage.toFixed(0)} mi`}
                </div>
              </div>
            </button>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-[16px] font-mono tabular-nums font-medium text-foreground">
                {fmtMoney(total)}
              </span>
              <StatusPill status={report.status} size="md" />
              <Button
                onClick={onSubmit}
                disabled={!canSubmit}
                size="sm"
                variant={canSubmit ? 'default' : 'outline'}
                className={cn('rounded-full uppercase tracking-[0.05em]', !canSubmit && 'text-muted-foreground')}
                title={
                  submitted
                    ? 'This report has already been submitted'
                    : 'Submit this expense report'
                }
              >
                {submitted ? (
                  <>
                    <Check size={11} strokeWidth={2.5} />
                    Submitted
                  </>
                ) : report.status === 'rejected' ? (
                  <>
                    Resubmit
                    <ArrowUpRight size={11} strokeWidth={2.5} />
                  </>
                ) : (
                  <>
                    Submit
                    <ArrowUpRight size={11} strokeWidth={2.5} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </td>
      </tr>

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
            <TableRow className="hover:bg-muted/40">
              <TableCell colSpan={8} className="px-5 py-2.5">
                <button
                  onClick={onAddItem}
                  className="flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus size={12} strokeWidth={2.4} />
                  Add a line item to this report
                </button>
              </TableCell>
            </TableRow>
          )}
          {/* Subtotal row */}
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableCell />
            <TableCell />
            <TableCell className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Subtotal · {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </TableCell>
            <TableCell />
            <TableCell className="text-right font-mono tabular-nums text-[14px] font-medium text-foreground">
              {fmtMoney(total)}
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </>
      )}
    </Fragment>
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
    <TableRow className={cn('group', locked && 'opacity-80')}>
      {/* Date */}
      <TableCell className="px-5 text-[12px] font-mono tabular-nums text-muted-foreground">
        {dayLabel(item.date).slice(0, 3)} {monthName(item.date).slice(0, 3)} {dayNum(item.date)}
      </TableCell>

      {/* Type */}
      <TableCell>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wider rounded gap-1">
          {isMileage ? <Car size={10} strokeWidth={2.4} /> : <Receipt size={10} strokeWidth={2.4} />}
          {isMileage ? 'Mileage' : 'Expense'}
        </Badge>
      </TableCell>

      {/* Vendor / Trip + note */}
      <TableCell>
        <div className="min-w-0">
          <div className="text-[13px] font-medium truncate text-foreground">
            {description}
          </div>
          {subDescription && (
            <div className="text-[11px] italic truncate mt-0.5 text-muted-foreground">
              {isMileage ? subDescription : `“${subDescription}”`}
            </div>
          )}
        </div>
      </TableCell>

      {/* Category */}
      <TableCell className="text-[12px] truncate text-foreground/80">
        {isMileage ? 'Mileage · IRS rate' : item.category ?? '—'}
      </TableCell>

      {/* Amount */}
      <TableCell className="text-right font-mono tabular-nums text-[14px] font-medium text-foreground">
        {fmtMoney(item.amount)}
      </TableCell>

      {/* Receipt */}
      <TableCell>
        <button
          onClick={() => onReceiptClick?.(item)}
          className={cn(
            'flex items-center gap-1.5 text-left text-[11px] transition-colors hover:underline',
            item.receipt ? 'text-foreground/80' : 'text-muted-foreground/70',
          )}
          disabled={!item.receipt}
          title={item.receipt ? `View ${item.receipt.label}` : 'No receipt attached'}
        >
          <Paperclip size={11} strokeWidth={2.2} />
          <span className="truncate">{item.receipt?.label ?? 'Missing'}</span>
        </button>
      </TableCell>

      {/* Status (uses parent report's status; line items inherit) */}
      <TableCell />

      {/* Actions */}
      <TableCell className="px-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onMenu?.(item)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Row actions"
          disabled={locked}
        >
          {locked ? <Lock size={12} /> : <MoreHorizontal size={14} />}
        </Button>
      </TableCell>
    </TableRow>
  );
}
