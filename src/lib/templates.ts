import { MoneyRecord, TemplateMessage } from "@/types/records";
import { formatCurrency } from "./format";
import { formatShortDate } from "./date";

export const messageTemplates: TemplateMessage[] = [
  {
    id: "invoice-gentle",
    type: "invoice",
    stage: "gentle",
    tone: "gentle",
    label: "Invoice gentle reminder",
    subject: "Friendly reminder: {{reference}}",
    body:
      "Hi {{customer}}, just a quick reminder that invoice {{reference}} for {{amount}} is {{dueState}}. Let me know if you need the PDF or payment link again.",
    usage: "Use 48h before or on the due date to stay top-of-mind without pressure.",
  },
  {
    id: "invoice-firm",
    type: "invoice",
    stage: "firm",
    tone: "firm",
    label: "Invoice payment overdue",
    subject: "Invoice {{reference}} is overdue",
    body:
      "Hi {{customer}}, invoice {{reference}} for {{amount}} is now {{dueState}}. Please confirm payment timing today to avoid pausing services.",
    usage: "Send 5+ days after due with clear next steps and consequence.",
  },
  {
    id: "invoice-final",
    type: "invoice",
    stage: "final",
    tone: "final",
    label: "Final notice",
    subject: "Final notice before escalation",
    body:
      "Hi {{customer}}, we still have not received {{amount}} for invoice {{reference}}. This is the final reminder before we escalate to finance on {{finalDate}}.",
    usage: "Escalation template that sets a clear boundary and ownership.",
  },
  {
    id: "quote-checkin",
    type: "quote",
    stage: "gentle",
    tone: "gentle",
    label: "Quote check-in",
    subject: "Did the quote for {{reference}} land?",
    body:
      "Hi {{customer}}, just checking that the proposal for {{reference}} reached you. Happy to adjust scope or jump on a call.",
    usage: "Use 2-3 days after the quote was sent.",
  },
  {
    id: "quote-value",
    type: "quote",
    stage: "firm",
    tone: "gentle",
    label: "Value reminder",
    subject: "Reminder: {{reference}} decision",
    body:
      "Quick reminder about {{reference}} – we held pricing at {{amount}} until {{finalDate}}. Let me know if you want to lock it in.",
    usage: "Send close to the quote expiry date to drive action.",
  },
];

export function renderTemplatePreview(
  template: TemplateMessage,
  record: MoneyRecord,
): { subject: string; body: string } {
  const replacements: Record<string, string> = {
    customer: record.customer,
    amount: formatCurrency(record.amount, record.currency),
    reference: record.reference,
    dueState: record.dueDate ? `due ${formatShortDate(record.dueDate)}` : "awaiting response",
    finalDate:
      record.dueDate
        ? formatShortDate(record.dueDate)
        : record.validUntil
          ? formatShortDate(record.validUntil)
          : formatShortDate(record.sentDate),
  };

  const replaceTokens = (input: string) =>
    input.replace(/{{(\w+)}}/g, (_, token) => replacements[token] ?? "");

  return {
    subject: replaceTokens(template.subject),
    body: replaceTokens(template.body),
  };
}

export function getTemplatesByType(type: "invoice" | "quote"): TemplateMessage[] {
  return messageTemplates.filter((template) => template.type === type);
}
