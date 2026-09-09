# Post-visit review page — `shilandah.com/reviews/`

An NPS-style review collector that plugs into GoHighLevel. It lives on the main
site (no subdomain) and is **never indexed**. Promoters are sent to public
review sites; detractors go to a private feedback form that reaches the team
only.

- **Page:** `src/pages/reviews/index.astro` — a standalone card (no site
  header/footer, no Open Graph, no analytics/cookies/third-party scripts). All
  state logic is a first-party inline script.
- **Webhook proxy:** `src/pages/api/event.ts` — the only on-demand
  (serverless) route on the site (`export const prerender = false`), enabled by
  the `@astrojs/vercel` adapter. It keeps the GHL webhook URLs server-side.

## How it works

Three client states, routed by score with `THRESHOLD = 8`:

1. **Rate** — “How did we do, {fn}?” + a 0–10 button row. Continue is disabled
   until a score is picked.
2. **Review ask** (score **≥ 8**) — Google (primary) + Yelp (outline), new tab.
3. **Feedback** (score **≤ 7**) — required textarea (min 5 chars) → thank-you
   with the clinic phone number.

### URL contract (built by the GHL email)

```
https://shilandah.com/reviews/?cid={{contact.id}}&email={{contact.email}}&fn={{contact.first_name}}&pet={{contact.pet_name}}&s=
```

- `fn` and `pet` personalize the copy (“…based on Bella’s visit?”).
- `s` is the one-tap score. If present and a valid integer 0–10, the page
  preselects it and routes straight to the review ask or feedback form — no
  click needed. One-tap link per number:
  ```
  https://shilandah.com/reviews/?cid={{contact.id}}&fn={{contact.first_name}}&pet={{contact.pet_name}}&s=9
  ```
- If **neither `cid` nor `email`** is present, the feedback form shows an
  optional “best way to reach you” field (`contact_alt`).

> Keep the trailing slash on `/reviews/` — the site uses `trailingSlash: always`.

### Data out

The page POSTs JSON (fire-and-forget, `keepalive`) to **`/api/event/`**, which
forwards to the right GoHighLevel inbound webhook. Payloads always include
`cid, email, fn, pet, src, ts, page`, plus:

| event            | extra fields                         | webhook                | when                            |
| ---------------- | ------------------------------------ | ---------------------- | ------------------------------- |
| `score`          | `score`, `bucket` (promoter/detractor) | `GHL_WEBHOOK_SCORE`    | once, when the score is chosen  |
| `platform_click` | `score`, `platform` (google/yelp)    | `GHL_WEBHOOK_SCORE`    | on a review-button click        |
| `feedback`       | `score`, `feedback`, `contact_alt`   | `GHL_WEBHOOK_FEEDBACK` | on feedback submit              |

`/api/event` rate-limits to 20 req/min per IP, rejects bodies over 4 KB, and
validates that `event` is one of the three and `score` is an integer 0–10.

## Environment variables (server-only)

Set in **Vercel → Settings → Environment Variables** (and `.env` locally).
These are NOT prefixed `PUBLIC_`, so they never reach the client bundle.

| Var                    | From                                                          |
| ---------------------- | ------------------------------------------------------------ |
| `GHL_WEBHOOK_SCORE`    | Workflow 02 “Review Score Router” → Inbound Webhook trigger → copy URL |
| `GHL_WEBHOOK_FEEDBACK` | Workflow 03 “Feedback Handler” → Inbound Webhook trigger → copy URL     |

Until they’re set the page still works, but events are dropped (the route
no-ops the forward). **Set `GHL_WEBHOOK_FEEDBACK` before launch so detractor
feedback isn’t lost.**

Optional: `RATE_LIMIT_MAX` overrides the per-IP limit (default 20).

Public review links (Google, Yelp) live in `src/data/site.ts` under
`links.googleReview` / `links.yelpReview`.

## No-indexing (scoped to just this page)

The marketing site stays fully indexable; only `/reviews` and `/api` are
suppressed:

- `<meta name="robots" content="noindex, nofollow, noarchive">` on the page.
- `X-Robots-Tag: noindex, nofollow, noarchive` on both `/reviews/` and
  `/api/event/` — set in code via the response headers. (The page is rendered
  on-demand for this reason; the Astro Vercel adapter's build config supersedes
  `vercel.json` `headers`, so a static header rule there would be ignored.)
- `/reviews` excluded from the sitemap (`astro.config.mjs` filter).
- `Disallow: /reviews` and `Disallow: /api/` in `public/robots.txt`.

## Tests

```bash
npm run test:install   # one-time: download the Playwright browser
npm test               # builds, then runs the Playwright review-page suite
```

Covers the state machine (score routing, promoter boundary at 8, personalized
copy, feedback validation, thank-you + phone, contact-field logic, disabled
Continue) and the noindex meta tag. The `/api/event` validation is covered by a
direct handler test (invalid score/event → 400, oversized → 413, valid → 200,
`X-Robots-Tag` present, GET → 405).
