import type { APIRoute } from 'astro';

// On-demand (serverless) — the only non-prerendered route on the site. Keeps the
// GoHighLevel webhook URLs server-side so they never reach the client bundle.
export const prerender = false;

const WINDOW_MS = 60_000;
// Default 20/min per IP; overridable for tests.
const MAX_REQ_PER_WINDOW = Number(process.env.RATE_LIMIT_MAX ?? '20');
const MAX_BODY_BYTES = 4096;

const VALID_EVENTS = new Set(['score', 'platform_click', 'feedback']);

// In-memory, per-instance window. Adequate as a light abuse guard for a
// low-traffic form; not a distributed limiter.
const hits = new Map<string, { count: number; reset: number }>();

function allow(ip: string, now: number): boolean {
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQ_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const now = Date.now();

  let ip = 'unknown';
  try {
    ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      clientAddress ||
      'unknown';
  } catch {
    // clientAddress can throw if unavailable; fall back to header/unknown.
    ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  }

  if (!allow(ip, now)) return json(429, { error: 'rate_limited' });

  const declared = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return json(413, { error: 'payload_too_large' });
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return json(413, { error: 'payload_too_large' });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  const event = body?.event;
  const score = body?.score;

  if (typeof event !== 'string' || !VALID_EVENTS.has(event)) {
    return json(400, { error: 'invalid_event' });
  }
  if (
    typeof score !== 'number' ||
    !Number.isInteger(score) ||
    score < 0 ||
    score > 10
  ) {
    return json(400, { error: 'invalid_score' });
  }

  const webhook =
    event === 'feedback'
      ? process.env.GHL_WEBHOOK_FEEDBACK
      : process.env.GHL_WEBHOOK_SCORE;

  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {
      // Fire-and-forget: a webhook hiccup must not surface to the visitor.
    }
  }

  return json(200, { ok: true });
};

export const GET: APIRoute = () => json(405, { error: 'method_not_allowed' });
