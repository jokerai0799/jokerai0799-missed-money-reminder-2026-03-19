"use client";

import { useMemo, useState } from "react";
import { MoneyRecord } from "@/types/records";
import { generateReminderSchedule } from "@/lib/reminders";
import { REMINDER_STAGE_DETAILS, RECORD_STATUS_DETAILS } from "@/lib/constants";
import { formatShortDate } from "@/lib/date";

export type RecordFormValues = Omit<MoneyRecord, "id"> & { id?: string };

interface Props {
  selectedRecord: MoneyRecord | null;
  onSave: (payload: RecordFormValues) => void;
  onResetSelection: () => void;
}

const emptyForm: RecordFormValues = {
  id: undefined,
  type: "invoice",
  reference: "",
  customer: "",
  contactEmail: "",
  amount: 0,
  currency: "USD",
  sentDate: new Date().toISOString().split("T")[0],
  dueDate: new Date().toISOString().split("T")[0],
  validUntil: undefined,
  status: "awaiting",
  reminderStage: "not-started",
  recoveredAmount: undefined,
  lastReminderAt: undefined,
  notes: "",
};

export function RecordForm({ selectedRecord, onSave, onResetSelection }: Props) {
  const [form, setForm] = useState<RecordFormValues>(() =>
    selectedRecord ? { ...selectedRecord } : { ...emptyForm },
  );

  const schedulePreview = useMemo(() => {
    const record: MoneyRecord = {
      id: form.id ?? "draft",
      reference: form.reference || "NEW-RECORD",
      customer: form.customer || "Client",
      contactEmail: form.contactEmail || "team@example.com",
      amount: form.amount || 0,
      currency: form.currency || "USD",
      sentDate: form.sentDate,
      dueDate: form.dueDate,
      validUntil: form.validUntil,
      status: form.status,
      reminderStage: form.reminderStage,
      recoveredAmount: form.recoveredAmount,
      lastReminderAt: form.lastReminderAt,
      notes: form.notes,
      type: form.type,
    };
    return generateReminderSchedule(record);
  }, [form]);

  function handleChange<T extends keyof RecordFormValues>(key: T, value: RecordFormValues[T]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">
            Add / edit record
          </p>
          <h3 className="text-xl font-semibold text-slate-900">
            {selectedRecord ? "Update existing" : "Capture new"}
          </h3>
        </div>
        {selectedRecord && (
          <button
            type="button"
            className="text-sm text-indigo-600 hover:text-indigo-800"
            onClick={onResetSelection}
          >
            New record
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-600">
            Type
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
              value={form.type}
              onChange={(event) => handleChange("type", event.target.value as MoneyRecord["type"])}
            >
              <option value="invoice">Invoice</option>
              <option value="quote">Quote</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-600">
            Reference
            <input
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
              value={form.reference}
              onChange={(event) => handleChange("reference", event.target.value)}
              placeholder={form.type === "invoice" ? "INV-1044" : "QUO-224"}
            />
          </label>
        </div>

        <label className="text-sm font-medium text-slate-600">
          Customer
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
            value={form.customer}
            onChange={(event) => handleChange("customer", event.target.value)}
            placeholder="Client name"
          />
        </label>

        <label className="text-sm font-medium text-slate-600">
          Contact email
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
            value={form.contactEmail}
            onChange={(event) => handleChange("contactEmail", event.target.value)}
            type="email"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-600">
            Amount (USD)
            <input
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
              type="number"
              value={form.amount}
              onChange={(event) => handleChange("amount", Number(event.target.value))}
              min={0}
            />
          </label>
          <label className="text-sm font-medium text-slate-600">
            Sent date
            <input
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
              type="date"
              value={form.sentDate}
              onChange={(event) => handleChange("sentDate", event.target.value)}
            />
          </label>
        </div>

        {form.type === "invoice" ? (
          <label className="text-sm font-medium text-slate-600">
            Due date
            <input
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
              type="date"
              value={form.dueDate ?? ""}
              onChange={(event) => handleChange("dueDate", event.target.value)}
            />
          </label>
        ) : (
          <label className="text-sm font-medium text-slate-600">
            Quote valid until
            <input
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
              type="date"
              value={form.validUntil ?? ""}
              onChange={(event) => handleChange("validUntil", event.target.value)}
            />
          </label>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-600">
            Record status
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
              value={form.status}
              onChange={(event) => handleChange("status", event.target.value as MoneyRecord["status"])}
            >
              {Object.entries(RECORD_STATUS_DETAILS).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-600">
            Reminder stage
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
              value={form.reminderStage}
              onChange={(event) =>
                handleChange("reminderStage", event.target.value as MoneyRecord["reminderStage"])
              }
            >
              {Object.entries(REMINDER_STAGE_DETAILS).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="text-sm font-medium text-slate-600">
          Last reminder sent
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
            type="date"
            value={form.lastReminderAt ?? ""}
            onChange={(event) => handleChange("lastReminderAt", event.target.value)}
          />
        </label>

        <label className="text-sm font-medium text-slate-600">
          Notes
          <textarea
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
            rows={3}
            value={form.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            placeholder="Context for next reminder"
          />
        </label>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            Last reminder:
            <span className="font-medium text-slate-700">
              {form.lastReminderAt ? formatShortDate(form.lastReminderAt) : "—"}
            </span>
          </p>
          <button
            type="submit"
            className="rounded-full bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700"
          >
            {selectedRecord ? "Save changes" : "Add to tracker"}
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <p className="text-sm font-semibold text-slate-600">Reminder schedule</p>
        <ol className="mt-3 space-y-3 text-sm text-slate-600">
          {schedulePreview.map((step) => (
            <li key={step.id} className="flex items-start gap-3">
              <span
                className={`mt-1 h-2 w-2 rounded-full ${
                  step.status === "done"
                    ? "bg-emerald-500"
                    : step.status === "due"
                      ? "bg-amber-500"
                      : "bg-slate-300"
                }`}
              />
              <div>
                <p className="font-medium text-slate-800">{step.step}</p>
                <p className="text-xs text-slate-500">
                  {formatShortDate(step.targetDate)} · {step.tone} · {step.status}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
