# Shiland Animal Hospital — website

Fast, static, phone-first rebuild of shilandah.com. Astro (static) → Vercel.
Preserves every legacy SEO URL and adds off-hours self-scheduling hooks.

## Stack

- **Astro 5** static output, `trailingSlash: 'always'`, directory format
- `@astrojs/sitemap` → `/sitemap-index.xml`
- Zero client JS except the tiny inline live-status + analytics scripts
- Node 20+ (built on Node 24)

## Commands

```bash
npm install
npm run dev       # local dev  → http://localhost:4321
npm run build     # static build → dist/
npm run preview   # serve the built dist/
```

## Project shape

```
src/
  data/site.ts            ← SINGLE SOURCE OF TRUTH (NAP, hours, 14 services)
  styles/global.css       ← tokens + all component styles (lifted from homepage)
  lib/schema.ts           ← JSON-LD builders (LocalBusiness, Breadcrumb, Service)
  components/             ← TopBar, Header, Footer, MobileCallBar, LiveStatus,
                            Icon, FinalCTA
  layouts/BaseLayout.astro← head/meta/OG/canonical, fonts, analytics, schema, chrome
  pages/                  ← home, [service], about, contact, payment, promotions,
                            careers, blog + [slug], privacy, 404
  content/blog/           ← markdown posts (content collection)
public/                   ← logo.webp, logo-white.webp, hero-photo.jpg,
                            dr-kadhim.jpg, favicon.svg, robots.txt
```

To re-skin for another vet client: replace `src/data/site.ts` + `public/` assets.

## Environment variables

Copy `.env.example` → `.env`. All are optional; sensible fallbacks apply.

| Var | Purpose | Default |
|-----|---------|---------|
| `PUBLIC_ANALYTICS` | Set to `on` to load GA4/GTM. **Left off on staging** so preview traffic doesn't pollute production. Turn on at cutover. | off |
| `PUBLIC_FORMSPREE_ID` | Formspree form id for the contact form. | `your-form-id` (form won't deliver until set) |
| `BOOK_URL` | Standalone scheduler URL (Setmore / YouCanBook.me). When set, "Book appointment" CTAs point here instead of `/contact-us/`. | falls back to `/contact-us/` |

## Signature behaviors

- **Live open/closed status** computed in `America/New_York` from `src/data/site.ts`
  hours — drives the top bar, hero pill, hero card, and CTA status lines.
- **Two-track CTAs**: any `[data-live-actions]` group promotes "Book appointment"
  to primary when the clinic is **closed** (phone won't be answered), and keeps
  "Call" primary when open.
- **Conversion events** pushed to `dataLayer`: `click_to_call`,
  `book_appointment_click`, `directions_click`, `form_submit`.

## Deploy (Vercel)

1. Import the repo in Vercel — Astro is auto-detected. `vercel.json` enforces
   trailing slashes.
2. Set env vars in Vercel (leave `PUBLIC_ANALYTICS` unset for the preview).
3. Ship to a preview URL, run the QA checklist, then cut over DNS.

## Handoff notes / open items

See `BUILD-NOTES.md` for decisions, assumptions, and what still needs client input
(logo/favicon set, scheduler choice, analytics ownership, live-copy reconciliation).
