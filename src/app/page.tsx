import { getSeedRecords } from "@/data/seed";
import { RecordsWorkspace } from "@/components/RecordsWorkspace";

export default async function HomePage() {
  const records = await getSeedRecords();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-indigo-600">
            Missed money reminder
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Recover overdue invoices and revive forgotten quotes
          </h1>
          <p className="text-base text-slate-600 sm:text-lg">
            A narrowed SaaS demo that combines dashboards, reminder schedules, and
            outreach templates so finance teams can act daily.
          </p>
        </header>
        <RecordsWorkspace initialRecords={records} />
      </div>
    </main>
  );
}
