import {
  DailyRecoveryEntry,
  MoneyRecord,
  ReminderScheduleEntry,
} from "@/types/records";
import {
  addDays,
  formatFullDate,
  formatShortDate,
  isPastDay,
  isSameDay,
  parseDate,
  toISODate,
} from "./date";

const invoiceSteps = [
  {
    id: "heads-up",
    label: "Heads-up before due date",
    daysFromDue: -2,
    tone: "gentle" as const,
    description: "Friendly reminder 48h before the invoice is due",
  },
  {
    id: "due-day",
    label: "Due today",
    daysFromDue: 0,
    tone: "gentle" as const,
    description: "Same-day reminder with quick pay link",
  },
  {
    id: "overdue",
    label: "Overdue follow-up",
    daysFromDue: 5,
    tone: "firm" as const,
    description: "Highlights late payment consequences",
  },
  {
    id: "final",
    label: "Final notice",
    daysFromDue: 14,
    tone: "final" as const,
    description: "Signals escalation to finance or collections",
  },
];

const quoteSteps = [
  {
    id: "check-in",
    label: "Check-in",
    daysFromSent: 3,
    tone: "gentle" as const,
    description: "Light nudge to see if the quote landed",
  },
  {
    id: "value-reminder",
    label: "Value reminder",
    daysFromSent: 7,
    tone: "gentle" as const,
    description: "Reinforce ROI + offer help with blockers",
  },
  {
    id: "last-call",
    label: "Last call",
    daysFromSent: 14,
    tone: "firm" as const,
    description: "Deadline reminder before quote expires",
  },
];

export function generateReminderSchedule(
  record: MoneyRecord,
  now = new Date(),
): ReminderScheduleEntry[] {
  const baseDateString =
    record.type === "invoice"
      ? record.dueDate ?? record.sentDate
      : record.sentDate;
  const baseDate = parseDate(baseDateString) ?? new Date();
  const definitions = record.type === "invoice" ? invoiceSteps : quoteSteps;

  return definitions.map((definition, index) => {
    const offset =
      "daysFromDue" in definition
        ? definition.daysFromDue
        : definition.daysFromSent;
    const targetDate = addDays(baseDate, offset);
    let status: ReminderScheduleEntry["status"] = "upcoming";
    if (isSameDay(targetDate, now)) status = "due";
    else if (isPastDay(targetDate, now)) status = "done";

    return {
      id: `${record.id}-${definition.id}-${index}`,
      step: definition.label,
      targetDate: toISODate(targetDate),
      tone: definition.tone,
      status,
      description: `${definition.description} (${formatFullDate(targetDate.toISOString())})`,
    } satisfies ReminderScheduleEntry;
  });
}

export function getNextReminder(
  schedule: ReminderScheduleEntry[],
): ReminderScheduleEntry | null {
  return schedule.find((entry) => entry.status !== "done") ?? schedule.at(-1) ?? null;
}

export function buildDailyRecoveryPlan(
  records: MoneyRecord[],
  horizonDays = 5,
): DailyRecoveryEntry[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const limitDate = addDays(today, horizonDays);

  const planMap = new Map<string, DailyRecoveryEntry>();

  records.forEach((record) => {
    const schedule = generateReminderSchedule(record, today);
    schedule
      .filter((step) => step.status !== "done")
      .forEach((step) => {
        const target = parseDate(step.targetDate);
        if (!target) return;
        if (target < today) return;
        if (target > limitDate) return;
        const dateKey = toISODate(target);
        if (!planMap.has(dateKey)) {
          planMap.set(dateKey, {
            date: dateKey,
            formattedDate: formatShortDate(target.toISOString()),
            entries: [],
          });
        }

        planMap.get(dateKey)?.entries.push({
          recordId: record.id,
          reference: record.reference,
          customer: record.customer,
          amount: record.amount,
          type: record.type,
          tone: step.tone,
          step: step.step,
          status: step.status === "due" ? "due" : "upcoming",
        });
      });
  });

  return Array.from(planMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}
