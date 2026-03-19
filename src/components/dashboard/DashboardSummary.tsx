import { DashboardMetrics } from "@/types/records";
import { formatCurrency } from "@/lib/format";

interface Props {
  metrics: DashboardMetrics;
}

export function DashboardSummary({ metrics }: Props) {
  const summary = [
    {
      label: "Amount at risk",
      value: formatCurrency(metrics.amountAtRisk),
      subLabel: "Invoices + quotes currently under reminder",
    },
    {
      label: "Overdue invoices",
      value: metrics.overdueInvoices.toString(),
      subLabel: "Invoices past the due date",
    },
    {
      label: "Stale quotes",
      value: metrics.staleQuotes.toString(),
      subLabel: "Quotes awaiting a decision",
    },
    {
      label: "Recovered value",
      value: formatCurrency(metrics.recoveredValue),
      subLabel: "Money won back this cycle",
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">
            Recovery pulse
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Missed money at a glance
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
            >
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {card.value}
              </p>
              <p className="text-xs text-slate-500">{card.subLabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
