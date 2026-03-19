import { MoneyRecord } from "@/types/records";
import { getTemplatesByType, renderTemplatePreview } from "@/lib/templates";

interface Props {
  records: MoneyRecord[];
}

const fallbackInvoice: MoneyRecord = {
  id: "preview-invoice",
  type: "invoice",
  reference: "INV-0000",
  customer: "Sample Client",
  contactEmail: "finance@example.com",
  amount: 5000,
  currency: "USD",
  sentDate: new Date().toISOString().split("T")[0],
  dueDate: new Date().toISOString().split("T")[0],
  status: "awaiting",
  reminderStage: "gentle",
};

const fallbackQuote: MoneyRecord = {
  id: "preview-quote",
  type: "quote",
  reference: "QUO-0000",
  customer: "Sample Prospect",
  contactEmail: "hello@example.com",
  amount: 4200,
  currency: "USD",
  sentDate: new Date().toISOString().split("T")[0],
  validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString().split("T")[0],
  status: "awaiting",
  reminderStage: "not-started",
};

export function TemplatesPanel({ records }: Props) {
  const invoiceSample =
    records.find((record) => record.type === "invoice") ?? fallbackInvoice;
  const quoteSample =
    records.find((record) => record.type === "quote") ?? fallbackQuote;

  const sections = [
    { type: "invoice" as const, label: "Invoice templates", sample: invoiceSample },
    { type: "quote" as const, label: "Quote templates", sample: quoteSample },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <p className="text-sm uppercase tracking-wide text-slate-500">
        Message templates
      </p>
      <h3 className="text-xl font-semibold text-slate-900">
        Pre-approved outreach by record type
      </h3>

      <div className="mt-4 space-y-5">
        {sections.map((section) => (
          <div key={section.type}>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {section.label}
            </p>
            <div className="mt-2 space-y-3">
              {getTemplatesByType(section.type).map((template) => {
                const preview = renderTemplatePreview(template, section.sample);
                return (
                  <article
                    key={template.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-slate-900">
                          {template.label}
                        </h4>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {template.tone} tone · {template.usage}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
                        {template.stage}
                      </span>
                    </div>
                    <div className="mt-3 rounded-xl bg-white p-3">
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Subject
                      </p>
                      <p className="text-sm text-slate-900">{preview.subject}</p>
                      <p className="mt-2 text-xs font-semibold uppercase text-slate-500">
                        Body
                      </p>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {preview.body}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
