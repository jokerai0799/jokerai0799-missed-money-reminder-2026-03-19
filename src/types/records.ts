export type RecordType = "invoice" | "quote";

export type RecordStatus =
  | "awaiting"
  | "overdue"
  | "stale"
  | "recovered"
  | "written-off";

export type ReminderStage =
  | "not-started"
  | "gentle"
  | "firm"
  | "final"
  | "escalated"
  | "recovered";

export interface MoneyRecord {
  id: string;
  type: RecordType;
  reference: string;
  customer: string;
  contactEmail: string;
  amount: number;
  currency: string;
  sentDate: string;
  dueDate?: string; // invoices
  validUntil?: string; // quotes
  status: RecordStatus;
  reminderStage: ReminderStage;
  recoveredAmount?: number;
  lastReminderAt?: string;
  notes?: string;
}

export interface ReminderScheduleEntry {
  id: string;
  step: string;
  targetDate: string;
  tone: "gentle" | "firm" | "final";
  status: "done" | "due" | "upcoming";
  description: string;
}

export interface DashboardMetrics {
  amountAtRisk: number;
  overdueInvoices: number;
  staleQuotes: number;
  recoveredValue: number;
}

export interface DailyRecoveryEntry {
  date: string;
  formattedDate: string;
  entries: Array<{
    recordId: string;
    reference: string;
    customer: string;
    amount: number;
    type: RecordType;
    tone: "gentle" | "firm" | "final";
    step: string;
    status: "due" | "upcoming";
  }>;
}

export interface TemplateMessage {
  id: string;
  type: RecordType;
  stage: ReminderStage | "nurture";
  label: string;
  subject: string;
  body: string;
  tone: "gentle" | "firm" | "final";
  usage: string;
}
