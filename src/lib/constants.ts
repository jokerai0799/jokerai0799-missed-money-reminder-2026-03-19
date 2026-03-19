import { ReminderStage, RecordStatus } from "@/types/records";

export const REMINDER_STAGE_DETAILS: Record<
  ReminderStage,
  { label: string; description: string; badgeClass: string }
> = {
  "not-started": {
    label: "Not started",
    description: "Record queued but no reminders sent yet",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200",
  },
  gentle: {
    label: "Gentle",
    description: "Friendly nudge sent, awaiting reply",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  firm: {
    label: "Firm",
    description: "Payment is overdue and requires a firm reminder",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  final: {
    label: "Final",
    description: "Last reminder before escalation",
    badgeClass: "bg-orange-50 text-orange-700 border border-orange-200",
  },
  escalated: {
    label: "Escalated",
    description: "Handed to finance or collections",
    badgeClass: "bg-rose-50 text-rose-700 border border-rose-200",
  },
  recovered: {
    label: "Recovered",
    description: "Money collected, archive record",
    badgeClass: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  },
};

export const RECORD_STATUS_DETAILS: Record<
  RecordStatus,
  { label: string; badgeClass: string }
> = {
  awaiting: {
    label: "Awaiting",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200",
  },
  overdue: {
    label: "Overdue",
    badgeClass: "bg-red-50 text-red-700 border border-red-200",
  },
  stale: {
    label: "Stale",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  recovered: {
    label: "Recovered",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  "written-off": {
    label: "Written off",
    badgeClass: "bg-zinc-100 text-zinc-700 border border-zinc-200",
  },
};
