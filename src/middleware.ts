import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ko', 'ja'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Leave supported locales and the static /about/ and /blog/ aliases untouched.
  // The matcher excludes dotted assets and deeper paths.
  if (pathname !== '/') {
    const slug = pathname.replace(/\/$/, '').slice(1);
    if (locales.includes(slug) || slug === 'about' || slug === 'blog') {
      return NextResponse.next();
    }

    return new NextResponse(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Page not found | WhereOnOTT</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 1.5rem; box-sizing: border-box; background: #020617; color: #f1f5f9; font: 1rem/1.6 system-ui, sans-serif; }
    main { width: min(100%, 36rem); box-sizing: border-box; padding: 2.5rem; border: 1px solid #475569; border-radius: 1rem; background: #0f172a; }
    h1 { font-size: clamp(1.75rem, 5vw, 2.25rem); line-height: 1.2; }
    p { color: #cbd5e1; }
    nav { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2rem; }
    a { display: inline-block; padding: .75rem 1rem; border: 1px solid #94a3b8; border-radius: .5rem; color: #fff; font-weight: 600; text-decoration: none; }
    a:hover { background: #334155; }
    a:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
  </style>
</head>
<body>
  <main>
    <h1>Page not found</h1>
    <p>We couldn't find that page. Return home or search for a movie or show.</p>
    <nav aria-label="Page recovery"><a href="/en/">Go to homepage</a><a href="/en/search/">Search movies &amp; shows</a></nav>
  </main>
</body>
</html>`, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex',
      },
    });
  }

  // Detect locale
  const acceptLang = request.headers.get('accept-language') || '';
  let locale = defaultLocale;
  if (acceptLang.toLowerCase().includes('ko')) locale = 'ko';
  else if (acceptLang.toLowerCase().includes('ja')) locale = 'ja';
  else if (acceptLang.toLowerCase().includes('en')) locale = 'en';

  return NextResponse.redirect(new URL('/' + locale, request.url));
}

export const config = {
  matcher: ['/', '/:slug([^/.]+)'],
};