# QA Report — Missed Money Reminder

Date: 2026-03-19 UTC  
Reviewer: Quinn QA

## Verdict
**FAIL before push** — app is generally healthy, but there is one correctness issue in seeded demo data that should be fixed before publishing.

## What I checked
- Reviewed project structure and key app files
- Ran `npm run lint`
- Ran `npm run build`
- Performed a lightweight runtime smoke check via local HTTP fetch against the running dev server
- Looked for stale scaffold references / unused default assets

## Pass findings
- `npm run lint` ✅ passed
- `npm run build` ✅ passed
- Local app route `/` responded with HTTP 200 ✅
- Main dashboard/content rendered in returned HTML ✅
- No TODO / FIXME markers found in `src/` ✅
- Project structure is coherent and README matches the current app direction ✅

## Fail findings
1. **Invalid seeded date in demo data**
   - File: `src/data/seed.ts`
   - Record: `inv-1037`
   - Current value: `dueDate: "2026-02-29"`
   - Problem: 2026 is **not** a leap year, so this is not a valid calendar date.
   - Actual runtime behavior: JavaScript normalizes it to `2026-03-01`, which can silently skew displayed due state, schedule generation, and reminder dates.
   - Evidence: `new Date('2026-02-29').toISOString()` resolves to `2026-03-01T00:00:00.000Z`.

## Risks
- Demo users may see inconsistent or misleading reminder timing for the Helios Research invoice because the stored date is invalid but still coerced into a real date by JS.
- Date parsing is permissive (`new Date(value)`), so similar invalid inputs could slip through unnoticed elsewhere.

## Cleanup / stale file observations
These are **not blockers**, but worth tidying before or after push:
- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`

I found no references to those default scaffold assets in app source, so they appear unused leftover Next starter files.

## Blockers before GitHub push
- Fix the invalid seed date for `inv-1037` in `src/data/seed.ts`.

## Recommended next steps
1. Replace `2026-02-29` with a valid intended date (likely `2026-02-28` or `2026-03-01`).
2. Optional: add stricter date validation so invalid ISO-like strings are rejected instead of auto-normalized by `Date`.
3. Optional: remove the unused default SVG assets from `public/`.

## Commands run
```bash
npm run lint
npm run build
curl -I http://127.0.0.1:3001
curl http://127.0.0.1:3001
```

## Notes
- Browser-tool smoke testing was unavailable because the local OpenClaw browser gateway timed out, so runtime verification was done with local HTTP fetch instead.
- There was already a local Next dev server running for this project on port 3001 during QA.
