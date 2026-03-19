"use client";

import {
  MoneyRecord,
  ReminderScheduleEntry,
} from "@/types/records";
import { formatCurrency } from "@/lib/format";
import { describeDueState, formatShortDate } from "@/lib/date";
import { RECORD_STATUS_DETAILS, REMINDER_STAGE_DETAILS } from "@/lib/constants";
import { getNextReminder } from "@/lib/reminders";

interface Props {
  records: MoneyRecord[];
  schedules: Map<string, ReminderScheduleEntry[]>;
  selectedId: string | null;
  onSelect: (recordId: string) => void;
}

export function RecordsTable({ records, schedules, selectedId, onSelect }: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">
            Unified list
          </p>
          <h3 className="text-xl font-semibold text-slate-900">
            Overdue invoices & abandoned quotes
          </h3>
        </div>
        <span className="text-sm text-slate-500">
          {records.length} records tracked
        </span>
      </div>
      {records.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-sm text-slate-500">
          No records tracked yet. Capture your first invoice or quote to populate the workflow.
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Due / Valid</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Reminder stage</th>
                <th className="px-4 py-3 font-medium">Next reminder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {records.map((record) => {
              const schedule = schedules.get(record.id) ?? [];
              const upcoming = getNextReminder(schedule);
              const statusMeta = RECORD_STATUS_DETAILS[record.status];
              const stageMeta = REMINDER_STAGE_DETAILS[record.reminderStage];
              const isSelected = selectedId === record.id;
              return (
                <tr
                  key={record.id}
                  className={`cursor-pointer bg-white transition hover:bg-slate-50 ${
                    isSelected ? "ring-2 ring-indigo-200" : ""
                  }`}
                  onClick={() => onSelect(record.id)}
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        record.type === "invoice"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          : "bg-teal-50 text-teal-700 border border-teal-100"
                      }`}
                    >
                      {record.type === "invoice" ? "Invoice" : "Quote"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {record.customer}
                    </div>
                    <p className="text-xs text-slate-500">{record.reference}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {formatCurrency(record.amount, record.currency)}
                  </td>
                  <td className="px-4 py-3">
                    {record.type === "invoice"
                      ? formatShortDate(record.dueDate)
                      : formatShortDate(record.validUntil)}
                    <p className="text-xs text-slate-500">
                      {record.type === "invoice"
                        ? describeDueState(record.dueDate)
                        : `valid until ${formatShortDate(record.validUntil)}`}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusMeta.badgeClass}`}
                    >
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${stageMeta.badgeClass}`}
                    >
                      {stageMeta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {upcoming ? (
                      <div>
                        <p className="font-medium text-slate-900">
                          {upcoming.step}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatShortDate(upcoming.targetDate)} · {upcoming.tone}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        Schedule complete
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </section>
  );
}
