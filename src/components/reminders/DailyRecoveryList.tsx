import { DailyRecoveryEntry } from "@/types/records";
import { formatCurrency } from "@/lib/format";

interface Props {
  plan: DailyRecoveryEntry[];
}

export function DailyRecoveryList({ plan }: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">
            Daily recovery list
          </p>
          <h3 className="text-xl font-semibold text-slate-900">
            Next 5 days of reminders
          </h3>
        </div>
        <span className="text-xs text-slate-500">Auto-generated from due dates</span>
      </div>

      {plan.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">
          No reminders scheduled for the next couple of days.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {plan.map((day) => (
            <li key={day.date} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-700">{day.formattedDate}</p>
              <div className="mt-3 space-y-3">
                {day.entries.map((entry) => (
                  <div key={entry.recordId + entry.step} className="flex items-center justify-between text-sm text-slate-600">
                    <div>
                      <p className="font-medium text-slate-900">
                        {entry.customer} · {entry.step}
                      </p>
                      <p className="text-xs text-slate-500">
                        {entry.reference} · {entry.type === "invoice" ? "Invoice" : "Quote"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(entry.amount)}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        {entry.status === "due" ? "Due today" : "Upcoming"} · {entry.tone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
