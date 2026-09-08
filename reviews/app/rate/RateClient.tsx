'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  THRESHOLD,
  CLINIC_NAME,
  CLINIC_PHONE,
  CLINIC_PHONE_TEL,
  CLINIC_ADDRESS,
  GOOGLE_REVIEW_URL,
  YELP_REVIEW_URL,
  LOGO_URL,
} from '@/lib/config';

type View = 'rate' | 'review' | 'feedback' | 'feedbackDone';

const SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function isPromoter(score: number) {
  return score >= THRESHOLD;
}

export default function RateClient() {
  const params = useSearchParams();

  const cid = params.get('cid') ?? '';
  const email = params.get('email') ?? '';
  const fn = params.get('fn') ?? '';
  const pet = params.get('pet') ?? '';
  const src = params.get('src') ?? 'rate_page';

  const [view, setView] = useState<View>('rate');
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [contactAlt, setContactAlt] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [logoOk, setLogoOk] = useState(true);

  // Guards single-fire of the "score" event regardless of path (one-tap vs Continue).
  const scoreSentRef = useRef(false);

  const needsContact = !cid && !email;

  function basePayload() {
    return {
      cid,
      email,
      fn,
      pet,
      src,
      ts: new Date().toISOString(),
      page: '/rate',
    };
  }

  // Fire-and-forget POST to our server route (which holds the webhook URLs).
  function sendEvent(payload: Record<string, unknown>) {
    try {
      fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* never let telemetry break the UX */
    }
  }

  // Records the chosen score exactly once, then advances to the right view.
  function commitScore(picked: number) {
    setScore(picked);
    if (!scoreSentRef.current) {
      scoreSentRef.current = true;
      sendEvent({
        ...basePayload(),
        event: 'score',
        score: picked,
        bucket: isPromoter(picked) ? 'promoter' : 'detractor',
      });
    }
    setView(isPromoter(picked) ? 'review' : 'feedback');
  }

  // One-tap from the email: if ?s= is a valid 0–10 integer, preselect and route
  // immediately without requiring a click.
  useEffect(() => {
    const raw = params.get('s');
    if (raw === null) return;
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 0 && n <= 10) {
      commitScore(n);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPlatformClick(platform: 'google' | 'yelp') {
    if (score === null) return;
    sendEvent({
      ...basePayload(),
      event: 'platform_click',
      score,
      platform,
    });
  }

  function onSubmitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (feedback.trim().length < 5) {
      setFeedbackError('Please add a few words so we know how to help.');
      return;
    }
    setFeedbackError('');
    sendEvent({
      ...basePayload(),
      event: 'feedback',
      score,
      feedback: feedback.trim(),
      contact_alt: contactAlt.trim(),
    });
    setView('feedbackDone');
  }

  const heading =
    view === 'rate' && fn ? `How did we do, ${fn}?` : 'How did we do?';

  const petClause = pet ? `${pet}'s visit` : 'your visit';

  return (
    <div className="page">
      <main className="card">
        {logoOk && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="logo"
            src={LOGO_URL}
            alt={CLINIC_NAME}
            onError={() => setLogoOk(false)}
          />
        )}

        {view === 'rate' && (
          <>
            <h1>{heading}</h1>
            <p className="sub">
              On a scale of 0–10, how likely are you to recommend us based on{' '}
              {petClause}?
            </p>

            <div className="scale" role="group" aria-label="Score from 0 to 10">
              {SCORES.map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={score === n}
                  aria-label={`Score ${n}`}
                  onClick={() => setScore(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="scale-labels">
              <span>Not likely</span>
              <span>Extremely likely</span>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              disabled={score === null}
              onClick={() => score !== null && commitScore(score)}
            >
              Continue
            </button>
          </>
        )}

        {view === 'review' && (
          <>
            <div className="hero-glyph" aria-hidden="true">
              💚
            </div>
            <h1 className="center">Thank you — that means a lot.</h1>
            <p className="sub center">
              A quick public review helps other pet families in our community
              find us. It only takes a minute.
            </p>

            <a
              className="btn btn-primary"
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onPlatformClick('google')}
            >
              Leave a Google review
            </a>
            <a
              className="btn btn-outline"
              href={YELP_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onPlatformClick('yelp')}
            >
              Leave a Yelp review
            </a>
          </>
        )}

        {view === 'feedback' && (
          <form onSubmit={onSubmitFeedback} noValidate>
            {score !== null && (
              <span className="pill">You rated us {score}/10</span>
            )}
            <h1>We&apos;d like to make this right.</h1>
            <p className="sub">
              Tell us what happened during {petClause} and we&apos;ll follow up.
            </p>

            <label htmlFor="fb">Your feedback</label>
            <textarea
              id="fb"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What could we have done better?"
              required
              minLength={5}
            />

            {needsContact && (
              <>
                <label htmlFor="contact">Best way to reach you (optional)</label>
                <input
                  id="contact"
                  type="text"
                  value={contactAlt}
                  onChange={(e) => setContactAlt(e.target.value)}
                  placeholder="Phone or email"
                />
              </>
            )}

            {feedbackError && <p className="error">{feedbackError}</p>}

            <p className="private-note">
              This goes to our team only — it is not posted publicly.
            </p>

            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        )}

        {view === 'feedbackDone' && (
          <>
            <div className="hero-glyph" aria-hidden="true">
              🐾
            </div>
            <h1 className="center">Thank you — we hear you.</h1>
            <p className="sub center">
              Your feedback is with our team. If you&apos;d like to speak with us
              directly, we&apos;re here.
            </p>
            <p className="phone-line center">
              <a href={`tel:${CLINIC_PHONE_TEL}`}>{CLINIC_PHONE}</a>
            </p>
          </>
        )}

        <div className="footer">
          <strong>{CLINIC_NAME}</strong>
          <br />
          {CLINIC_ADDRESS}
        </div>
      </main>
    </div>
  );
}
