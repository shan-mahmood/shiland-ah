import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WINDOW_MS = 60_000;
// Default 20/min per IP; overridable so tests aren't throttled by shared-IP noise.
const MAX_REQ_PER_WINDOW = Number(process.env.RATE_LIMIT_MAX ?? '20');
const MAX_BODY_BYTES = 4096;

const VALID_EVENTS = new Set(['score', 'platform_click', 'feedback']);

// In-memory, per-instance sliding-ish window. Adequate as a light abuse guard
// for a low-traffic form; not a distributed limiter.
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

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

export async function POST(req: NextRequest) {
  const now = Date.now();

  if (!allow(clientIp(req), now)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  // Reject oversized bodies both by declared and actual length.
  const declared = Number(req.headers.get('content-length') ?? '0');
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }

  const raw = await req.text();
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const event = body?.event;
  const score = body?.score;

  if (typeof event !== 'string' || !VALID_EVENTS.has(event)) {
    return NextResponse.json({ error: 'invalid_event' }, { status: 400 });
  }
  if (
    typeof score !== 'number' ||
    !Number.isInteger(score) ||
    score < 0 ||
    score > 10
  ) {
    return NextResponse.json({ error: 'invalid_score' }, { status: 400 });
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

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 });
}
