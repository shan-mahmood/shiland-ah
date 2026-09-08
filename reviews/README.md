# Shiland Reviews — post-visit rating page

A single-page NPS-style review collector for **Shiland Animal Hospital**
(Rock Hill, SC). It plugs into GoHighLevel workflows: promoters are routed to
public review sites, detractors are routed to a private feedback form that
reaches the team only.

Deployed to **reviews.shilandah.com**. The whole project is hardened to be
**never indexed** by search engines.

---

## How it works

One page at **`/rate`**, three client-side states:

1. **Rate** — “How did we do, {fn}?” with a 0–10 NPS button row. Continue is
   disabled until a score is picked.
2. **Review ask** (score **≥ 8**, `THRESHOLD = 8`) — “Thank you — that means a
   lot.” Buttons for Google (primary) and Yelp (outline), both open a new tab.
3. **Feedback** (score **≤ 7**) — “We’d like to make this right.” Required
   textarea (min 5 chars) → thank-you state showing the clinic phone number.

`/` 302-redirects to `/rate` (query string preserved).

### URL contract (built by the GHL email)

```
/rate?cid={ghl_contact_id}&email=&fn={first_name}&pet={pet_name}&s={0-10}
```

- `fn` and `pet` personalize the copy (“…based on Bella’s visit?”).
- `s` is the one-tap score from the email. If present and a valid integer 0–10,
  the page preselects it and routes straight to state 2 or 3 — no click needed.
- If **neither `cid` nor `email`** is present, the feedback form shows an
  optional “best way to reach you” field (`contact_alt`).

### Data out

The client POSTs JSON (fire-and-forget, `keepalive: true`) to the server route
**`/api/event`**, which forwards to the correct GoHighLevel inbound webhook.
**The webhook URLs never reach the browser bundle** — they live only in
server-side env vars.

Every payload includes: `cid, email, fn, pet, src, ts, page`, plus:

| event            | extra fields                        | webhook            | when                       |
| ---------------- | ----------------------------------- | ------------------ | -------------------------- |
| `score`          | `score`, `bucket` (promoter/detractor) | `GHL_WEBHOOK_SCORE`    | once, when the score is chosen |
| `platform_click` | `score`, `platform` (google/yelp)   | `GHL_WEBHOOK_SCORE`    | on a review-button click   |
| `feedback`       | `score`, `feedback`, `contact_alt`  | `GHL_WEBHOOK_FEEDBACK` | on feedback submit         |

`/api/event` rate-limits to 20 req/min per IP, rejects bodies over 4 KB, and
validates that `event` is one of the three and `score` is an integer 0–10.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values. In production, set
these in **Vercel → Project → Settings → Environment Variables**.

**Server-only (secret — do NOT prefix with `NEXT_PUBLIC_`):**

| Var                    | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `GHL_WEBHOOK_SCORE`    | Inbound webhook for `score` + `platform_click` |
| `GHL_WEBHOOK_FEEDBACK` | Inbound webhook for `feedback`              |

**Public (inlined into the client):**

| Var                             | Default                                       |
| ------------------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_CLINIC_NAME`       | Shiland Animal Hospital                        |
| `NEXT_PUBLIC_CLINIC_PHONE`      | (803) 752-4950                                 |
| `NEXT_PUBLIC_CLINIC_ADDRESS`    | 2685 Celanese Rd, Suite 123, Rock Hill, SC     |
| `NEXT_PUBLIC_GOOGLE_REVIEW_URL` | https://g.page/r/CUS6xCaiNJfsEBM/review        |
| `NEXT_PUBLIC_YELP_REVIEW_URL`   | Yelp “Write a review” deep link (set)          |

Optional: `RATE_LIMIT_MAX` overrides the per-IP `/api/event` limit (default 20).

---

## Getting the two GHL inbound-webhook URLs

In GoHighLevel:

1. **Workflow 02 — “Review Score Router”**: open the workflow, set its trigger
   to **Inbound Webhook**, and **copy URL**. Paste into `GHL_WEBHOOK_SCORE`.
   This workflow receives `score` and `platform_click` events and branches on
   `bucket` (promoter/detractor).
2. **Workflow 03 — “Feedback Handler”**: same steps — **Inbound Webhook**
   trigger → **copy URL** → paste into `GHL_WEBHOOK_FEEDBACK`. This workflow
   receives `feedback` events and alerts the team.

Tip: fire one test event from the deployed page so GHL captures a sample
payload and you can map fields (`cid`, `fn`, `pet`, `score`, `feedback`, …).

---

## The email link

Build the button/link in the GHL email like this (map the merge fields to your
contact/custom fields):

```
https://reviews.shilandah.com/rate?cid={{contact.id}}&email={{contact.email}}&fn={{contact.first_name}}&pet={{contact.pet_name}}&s=
```

For a **one-tap** email (each NPS number is its own link), append the score:

```
…/rate?cid={{contact.id}}&fn={{contact.first_name}}&pet={{contact.pet_name}}&s=9
```

---

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000/rate
```

## Tests (Playwright)

```bash
npm run test:install   # one-time: install the Chromium browser
npm run test
```

The suite builds the app and runs against the production server, covering:
score 9 → review state with the correct Google href; `?s=8` boundary → review;
`?s=7` → feedback; empty feedback → error; feedback submit → thank-you;
`/api/event` rejects an invalid score; and the noindex `X-Robots-Tag` header +
`<meta name="robots">` tag are present.

---

## Deploy to Vercel (reviews.shilandah.com)

1. Create a Vercel project from this repo. If the app lives in a subfolder, set
   the **Root Directory** to `reviews/`.
2. Add all env vars (above) for **Production** (and Preview if you want).
3. Deploy.
4. **Domain:** Project → **Settings → Domains → Add** `reviews.shilandah.com`.
   Add the `CNAME` record Vercel shows (typically `cname.vercel-dns.com`) at
   your DNS provider for the `reviews` subdomain, then wait for it to verify.

---

## No-indexing guarantees

This is non-negotiable and enforced in several layers:

- `metadata.robots = { index: false, follow: false, noarchive: true }` on the
  app (and 404) → `<meta name="robots" content="noindex, nofollow, noarchive">`.
- `X-Robots-Tag: noindex, nofollow, noarchive` on **all** routes via
  `next.config.js` `headers()` **and** `vercel.json` (redundant on purpose).
- `/robots.txt` disallows everything (`User-agent: * / Disallow: /`).
- No sitemap, no Open Graph, no Twitter card tags.
- `/` → `/rate` 302 also carries the noindex header.
