import { MoneyRecord, DashboardMetrics } from "@/types/records";

const AT_RISK_STATUSES: MoneyRecord["status"][] = [
  "awaiting",
  "overdue",
  "stale",
];

export function calculateDashboardMetrics(
  records: MoneyRecord[],
): DashboardMetrics {
  const amountAtRisk = records
    .filter((record) =>
      AT_RISK_STATUSES.includes(record.status) && record.reminderStage !== "recovered",
    )
    .reduce((sum, record) => sum + record.amount, 0);

  const overdueInvoices = records.filter(
    (record) => record.type === "invoice" && record.status === "overdue",
  ).length;

  const staleQuotes = records.filter(
    (record) => record.type === "quote" && record.status === "stale",
  ).length;

  const recoveredValue = records
    .filter((record) => record.reminderStage === "recovered")
    .reduce((sum, record) => sum + (record.recoveredAmount ?? record.amount), 0);

  return {
    amountAtRisk,
    overdueInvoices,
    staleQuotes,
    recoveredValue,
  };
}

export function sortRecords(records: MoneyRecord[]): MoneyRecord[] {
  return [...records].sort((a, b) => {
    const aDate = new Date(a.dueDate ?? a.validUntil ?? a.sentDate).getTime();
    const bDate = new Date(b.dueDate ?? b.validUntil ?? b.sentDate).getTime();
    return aDate - bDate;
  });
}
