# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into UNAPEC Pensum Tracker. The integration uses `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) for client-side initialization, with direct host connection since the app is a static export and cannot use Next.js rewrites as a proxy. Ten events were instrumented across five components covering the full user journey: career discovery, pensum engagement, subject tracking, and data portability.

## Changes made

| File | Change |
|------|--------|
| `instrumentation-client.ts` | **Created** — PostHog client-side initialization |
| `.env.local` | **Updated** — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` |
| `package.json` | **Updated** — Added `posthog-js` dependency |

> **Action required:** Run `bun install` to install `posthog-js` (the sandbox prevented automatic installation).

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `career_selected` | User selects a career from the search dropdown | `components/career-search.tsx` |
| `pensum_viewed` | User views a pensum page — top of engagement funnel | `components/pensum-content.tsx` |
| `diagram_opened` | User opens the prerequisite dependency diagram | `components/pensum-content.tsx` |
| `subject_toggled` | User selects or deselects an individual subject | `components/period-table/index.tsx` |
| `period_bulk_selected` | User bulk selects/deselects all subjects in a period | `components/period-table/index.tsx` |
| `prerequisite_alert_shown` | User is blocked from selecting a subject (missing prereqs) | `components/period-table/index.tsx` |
| `data_exported` | User exports their selected subjects to a JSON file | `components/import-export-buttons.tsx` |
| `data_imported` | User successfully imports subjects from a JSON file | `components/import-export-buttons.tsx` |
| `data_import_failed` | User's import failed (invalid format or JSON) | `components/import-export-buttons.tsx` |
| `original_pensum_link_clicked` | User clicks the external link to the original UNAPEC pensum | `components/info-card.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/387819/dashboard/1483857
- **Career selections over time:** https://us.posthog.com/project/387819/insights/pQS9b2Yu
- **Engagement funnel: Pensum view → Subject selection:** https://us.posthog.com/project/387819/insights/De2H9NFO
- **Most popular careers:** https://us.posthog.com/project/387819/insights/P0nWK7t0
- **Prerequisite blocks rate:** https://us.posthog.com/project/387819/insights/TyC6PLJj
- **Data import/export usage:** https://us.posthog.com/project/387819/insights/AuBVcntC

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
