"use client";

import { useMemo, useState } from "react";
import type { MoneyRecord } from "@/types/records";
import { calculateDashboardMetrics, sortRecords } from "@/lib/analytics";
import { buildDailyRecoveryPlan, generateReminderSchedule } from "@/lib/reminders";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { RecordsTable } from "@/components/records/RecordsTable";
import { ReminderStatusLegend } from "@/components/records/ReminderStatusLegend";
import { RecordForm, RecordFormValues } from "@/components/records/RecordForm";
import { DailyRecoveryList } from "@/components/reminders/DailyRecoveryList";
import { TemplatesPanel } from "@/components/templates/TemplatesPanel";

interface Props {
  initialRecords: MoneyRecord[];
}

export function RecordsWorkspace({ initialRecords }: Props) {
  const [records, setRecords] = useState<MoneyRecord[]>(() =>
    sortRecords(initialRecords),
  );
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    sortRecords(initialRecords)[0]?.id ?? null,
  );

  const metrics = useMemo(() => calculateDashboardMetrics(records), [records]);
  const schedules = useMemo(() => {
    return new Map(
      records.map((record) => [record.id, generateReminderSchedule(record)]),
    );
  }, [records]);
  const plan = useMemo(() => buildDailyRecoveryPlan(records), [records]);
  const selectedRecord = records.find((record) => record.id === selectedId) ?? null;

  function upsertRecord(payload: RecordFormValues) {
    const generatedId =
      payload.id ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `record-${Date.now()}`);

    const fallbackReference =
      payload.reference && payload.reference.trim().length > 0
        ? payload.reference
        : payload.type === "invoice"
          ? `INV-${generatedId.slice(-4).toUpperCase()}`
          : `QUO-${generatedId.slice(-4).toUpperCase()}`;

    const normalized: MoneyRecord = {
      id: generatedId,
      type: payload.type,
      reference: fallbackReference,
      customer: payload.customer || "Unnamed customer",
      contactEmail: payload.contactEmail || "ops@example.com",
      amount: Number(payload.amount) || 0,
      currency: payload.currency,
      sentDate: payload.sentDate,
      dueDate:
        payload.type === "invoice"
          ? payload.dueDate ?? payload.sentDate
          : undefined,
      validUntil:
        payload.type === "quote"
          ? payload.validUntil ?? payload.sentDate
          : undefined,
      status: payload.status,
      reminderStage: payload.reminderStage,
      recoveredAmount: payload.recoveredAmount,
      lastReminderAt: payload.lastReminderAt,
      notes: payload.notes,
    };

    setRecords((prev) => {
      const next = [...prev];
      const existingIndex = next.findIndex((record) => record.id === normalized.id);
      if (existingIndex >= 0) {
        next[existingIndex] = normalized;
      } else {
        next.push(normalized);
      }
      return sortRecords(next);
    });

    setSelectedId(normalized.id);
  }

  return (
    <div className="space-y-8">
      <DashboardSummary metrics={metrics} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <RecordsTable
            records={records}
            schedules={schedules}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <ReminderStatusLegend />
        </div>
        <RecordForm
          key={selectedRecord?.id ?? "new-record"}
          selectedRecord={selectedRecord}
          onSave={upsertRecord}
          onResetSelection={() => setSelectedId(null)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DailyRecoveryList plan={plan} />
        <TemplatesPanel records={records} />
      </div>
    </div>
  );
}
