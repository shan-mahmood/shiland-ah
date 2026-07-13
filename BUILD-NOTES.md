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

1. **Service page copy reconciled from the live site.** All 14 pages now carry the
   **exact live Yoast `<title>` and meta description** and the **live H1** for
   ranking continuity, plus body copy rebuilt from the real live content
   (de-Vetcelerated, medical specifics + geo keywords preserved, no fabrication).
   One intentional fix: the live end-of-life meta title typo "Euthansia" →
   "Euthanasia" (title text only; the URL slug is untouched).

2. **Analytics is gated OFF by default** (`PUBLIC_ANALYTICS`). The provided IDs
   (GA4 `GT-WF3LGK35`, GTM `GTM-N8SQGHBR`) are wired but won't load until you set
   the env to `on` — so staging doesn't pollute production data. Ownership of
   those IDs still needs confirming (spec flagged this).

3. **Contact form → Formspree**, but needs a real form id in `PUBLIC_FORMSPREE_ID`.
   Until set it posts to a placeholder and won't deliver. Honeypot + SMS-consent
   ("Reply STOP…") + `form_submit` event are all in place.

4. **Booking portal wired up.** "Book appointment" CTAs point to the clinic's
   Great Pet Care client portal (`account.greatpetcare.com/?cvetId=V00300128`),
   opening in a new tab. It's the default in `src/data/site.ts` and is what the
   two-track closed-state promotion targets. Override with `BOOK_URL` if it changes.

5. **Assets**: color logo, white footer logo, hero photo, and Dr. Kadhim photo are
   self-contained in `public/` (logo/hero extracted from the reference HTML's
   embedded data-URIs; white logo + doctor photo downloaded from the live site).
   Hero + doctor photos were optimized to `.webp` (roughly half the bytes). A full
   favicon/app-icon set (`favicon.svg`, 16/32 PNG, apple-touch 180, android
   192/512, `site.webmanifest`) was generated from the brand mark.
   *Optional:* swap the placeholder paw favicon for a client-provided mark.

6. **Dr. Kadhim bio**: no degrees/schools/years published, per the guardrail.
   The About page uses only the approved framing.

## Lighthouse (local headless preview — Vercel's CDN/Brotli will score higher)

- **SEO 100 · Best-practices 96 · Accessibility 96 · Performance ~86–87**
- Accessibility is capped at 96 by one audit: **color-contrast** on the brand
  white-on-orange (`#F36621`) buttons. White text on the brand orange is ~2.9:1
  (WCAG AA wants 4.5:1). Fixing it means darkening the CTA color away from the
  brand token — a client design call, so I left it. Everything else passes
  (heading order, aspect ratios, labels, etc.).
- Perf work done: images → optimized webp, LCP image preload + `fetchpriority`,
  below-fold images lazy-loaded, Google Fonts made non-render-blocking.

## Repo

This folder is now its own git repo (`main`) with an initial commit. It is **not
pushed** — create a GitHub remote and `git push`, then connect it in Vercel.

## Before cutover (from the spec's §12)

- [ ] Push to a GitHub remote and connect it in Vercel for a preview deploy.
- [ ] Verify the live Yoast/WP sitemap against our 14 slugs; 301 any orphan URL
      in `vercel.json` → `redirects`.
- [x] ~~Generate favicon/app-icon set~~ (done; swap the paw mark if desired).
- [ ] Set `PUBLIC_FORMSPREE_ID`, `BOOK_URL`, `PUBLIC_ANALYTICS` env vars in
      Vercel; confirm GA4/GTM ownership.
- [ ] Pick + embed the scheduler (`BOOK_URL`).
- [ ] GSC DNS TXT verification ahead of time; submit sitemap at cutover.
- [ ] Point apex + www to Vercel (NS currently at Cloudflare / registrar GoDaddy).
- [ ] Post-cutover: spot-check 20 legacy URLs return 200, re-run Lighthouse.

## Note on repo location

The git repository root is your home directory (`C:/Users/stmah`), not this
folder. All work here is scoped to `veterinary/shilandah/`. Consider making this
its own git repo before pushing to a Vercel-connected remote.
