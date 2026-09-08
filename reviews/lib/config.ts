// Central config. Public values are inlined into the client bundle via
// NEXT_PUBLIC_* env vars, with hard-coded fallbacks so the page works even if
// an env var is missing in a given environment. Webhook URLs live ONLY on the
// server (see app/api/event/route.ts) and are never referenced here.

// Promoter threshold. 8 and above = promoter (routed to the review ask).
export const THRESHOLD = 8;

export const CLINIC_NAME =
  process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Shiland Animal Hospital';

export const CLINIC_PHONE =
  process.env.NEXT_PUBLIC_CLINIC_PHONE ?? '(803) 752-4950';

// tel: target for the clinic phone (E.164, no punctuation).
export const CLINIC_PHONE_TEL = '+18037524950';

export const CLINIC_ADDRESS =
  process.env.NEXT_PUBLIC_CLINIC_ADDRESS ??
  '2685 Celanese Rd, Suite 123, Rock Hill, SC';

export const GOOGLE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ??
  'https://g.page/r/CUS6xCaiNJfsEBM/review';

export const YELP_REVIEW_URL =
  process.env.NEXT_PUBLIC_YELP_REVIEW_URL ??
  'https://www.yelp.com/writeareview/biz/HgbmSUfm2jFgBkkU_ToULw?return_url=%2Fbiz%2FHgbmSUfm2jFgBkkU_ToULw&review_origin=biz-details-war-button';

export const LOGO_URL = 'https://www.shilandah.com/logo.webp';
