import { REMINDER_STAGE_DETAILS } from "@/lib/constants";

export function ReminderStatusLegend() {
  return (
    <section className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-5">
      <p className="text-sm uppercase tracking-wide text-slate-500">
        Reminder flow statuses
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {Object.entries(REMINDER_STAGE_DETAILS).map(([stage, meta]) => (
          <div key={stage} className="flex items-start gap-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${meta.badgeClass}`}>
              {meta.label}
            </span>
            <p className="text-sm text-slate-600">{meta.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
