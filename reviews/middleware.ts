import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Root (/) 302-redirects to /rate, carrying the same query string, and the
// redirect response itself carries the noindex header. Matcher is scoped to
// exactly "/" so no other route pays the middleware cost.
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/rate';
  const res = NextResponse.redirect(url, 302);
  res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return res;
}

export const config = {
  matcher: '/',
};
