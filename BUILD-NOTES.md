# Build notes — decisions, assumptions & open items

Status: **staging build complete and passing** (24 routes generated). Not yet deployed.

## What's done

- Astro project scaffolded by hand (reliable on Windows; no interactive CLI).
- `src/data/site.ts` holds all canonical business data verbatim from the spec —
  NAP, geo, hours, rating, links, payment partners, service area, 14 services.
- `global.css` = the homepage's `:root` tokens + every component style, lifted
  verbatim, plus additions for interior pages (breadcrumb, service layout, forms,
  blog). No emoji/bubble icons; the inline SVG line-icon set is in `Icon.astro`.
- Home rebuilt from components — verified pixel-parity against the reference HTML
  in-browser (hero, live status card, trust strip, teal services grid, doctor,
  urgent, promo, reviews, payment, map, final CTA).
- All **14 service URLs preserved exactly**, including the legacy `dentisty` typo.
- About, Contact (+form), Payment, Promotions, Careers, Blog (+1 seed post),
  Privacy, 404 all built.
- Live-status script + two-track CTA behavior working (verified: open state shows
  Call primary; script paints top bar / hero / card / status lines).
- JSON-LD: site-wide VeterinaryCare + AggregateRating in every page; per-page
  BreadcrumbList; per-service Service schema referencing the business `@id`.
- Sitemap (privacy + 404 excluded), robots.txt, favicon.svg, `vercel.json`
  (trailing slash), `.env.example`.

## Decisions / assumptions — please confirm

1. **Service page copy is newly written, not scraped from the live site.**
   The spec asked to "pull each existing live page's copy, clean and
   de-Vetcelerator it." I wrote clean, on-brand copy per service that preserves
   the geo-modified H1s/titles/slugs and invents **no** claims, stats, pricing, or
   credentials. If you want the exact live wording reconciled in, I have network
   access and can fetch each live page and merge — say the word.

2. **Analytics is gated OFF by default** (`PUBLIC_ANALYTICS`). The provided IDs
   (GA4 `GT-WF3LGK35`, GTM `GTM-N8SQGHBR`) are wired but won't load until you set
   the env to `on` — so staging doesn't pollute production data. Ownership of
   those IDs still needs confirming (spec flagged this).

3. **Contact form → Formspree**, but needs a real form id in `PUBLIC_FORMSPREE_ID`.
   Until set it posts to a placeholder and won't deliver. Honeypot + SMS-consent
   ("Reply STOP…") + `form_submit` event are all in place.

4. **Scheduler not chosen yet.** "Book appointment" CTAs fall back to
   `/contact-us/`. Set `BOOK_URL` once Setmore/YouCanBook.me is picked; the
   two-track closed-state promotion already targets it.

5. **Assets**: color logo, white footer logo, hero photo, and Dr. Kadhim photo are
   self-contained in `public/` (logo/hero extracted from the reference HTML's
   embedded data-URIs; white logo + doctor photo downloaded from the live site).
   **Still needed:** a proper favicon/app-icon set (only a simple `favicon.svg`
   placeholder exists; `apple-touch-icon` is TODO).

6. **Dr. Kadhim bio**: no degrees/schools/years published, per the guardrail.
   The About page uses only the approved framing.

## Before cutover (from the spec's §12)

- [ ] Deploy to a Vercel preview (needs your Vercel account — I can't create it).
- [ ] Verify the live Yoast/WP sitemap against our 14 slugs; 301 any orphan URL
      in `vercel.json` → `redirects`.
- [ ] Generate favicon/app-icon set from the logo.
- [ ] Set env vars in Vercel; confirm GA4/GTM ownership.
- [ ] Pick + embed the scheduler (`BOOK_URL`).
- [ ] GSC DNS TXT verification ahead of time; submit sitemap at cutover.
- [ ] Point apex + www to Vercel (NS currently at Cloudflare / registrar GoDaddy).
- [ ] Post-cutover: spot-check 20 legacy URLs return 200, re-run Lighthouse.

## Note on repo location

The git repository root is your home directory (`C:/Users/stmah`), not this
folder. All work here is scoped to `veterinary/shilandah/`. Consider making this
its own git repo before pushing to a Vercel-connected remote.
