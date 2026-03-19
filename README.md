# Missed Money Reminder

A narrowed, demo-ready SaaS workflow for spotting overdue invoices and abandoned quotes, prioritising reminders, and reusing ready-to-send outreach templates. Built with the Next.js App Router + TypeScript so finance and RevOps teams can run the entire rescue loop locally.

## Highlights

- **Recovery dashboard** – amount at risk, overdue invoices count, stale quotes count, and recovered value calculated from the unified dataset.
- **Unified records list** – invoices and quotes live in the same table with type, amount, due state, reminder status, and the next scheduled touch.
- **Add / edit form** – capture new records or update existing ones (type, status, reminder stage, notes, last reminder date) with a live schedule preview.
- **Reminder flow legend** – explains every reminder stage so teams adopt a consistent playbook.
- **Schedule engine** – generates invoice schedules from the due date and quote schedules from the sent date, then feeds the daily recovery list.
- **Daily money-recovery list** – auto-groups upcoming reminders for the next five days so collectors know exactly who to chase.
- **Template library** – invoice vs. quote templates with rendered previews (subject + body) using the selected record context.
- **Demo seed data** – mixes overdue invoices, stale quotes, and recovered items so every widget renders immediately.

## Tech Stack

- [Next.js 16 App Router](https://nextjs.org/docs) with React Server + Client Components
- TypeScript + modern React lint rules
- Tailwind CSS for utility-first styling
- In-memory data helpers for analytics, reminder schedules, and templates (no external DB required)

## Project Structure

```
src/
├── app/                # App Router entrypoint + global styles
├── components/         # Dashboard, records table, forms, reminders, templates
├── data/seed.ts        # Demo dataset
├── lib/                # Analytics, reminder engine, templates, constants, utils
└── types/records.ts    # Shared TypeScript contracts
```

## Running Locally

```bash
cd projects/missed-money-reminder
npm install   # already run during scaffolding, but safe to repeat
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) to explore the dashboard. All data stays in memory, so refreshing resets to the seeded demo records.

## Available Scripts

- `npm run dev` – start the local development server
- `npm run lint` – run ESLint with the React 19 ruleset
- `npm run build` – create a production build
- `npm run start` – serve the production build

## Next Ideas

- Persist records via a lightweight KV store or Supabase table.
- Plug a real email/SMS channel into the reminder schedule.
- Add filters (owner, account tier) and CSV import/export.
- Track reminder outcomes to improve recovered-value forecasting.

Keeping everything local and dependency-light makes it easy to demo or iterate without provisioning infrastructure.
