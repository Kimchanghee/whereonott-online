import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-lg sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-rose-300">404 · Page not found</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">We couldn&apos;t find that page.</h1>
        <p className="mt-4 text-base leading-7 text-slate-300">
          The address may have changed, or the page may no longer be available. You can return home or search for a movie or show.
        </p>
        <nav aria-label="Page recovery" className="mt-8 flex flex-wrap gap-3">
          <Link href="/en/" className="rounded-lg bg-rose-600 px-5 py-3 font-semibold text-white hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Go to homepage
          </Link>
          <Link href="/en/search/" className="rounded-lg border border-slate-500 px-5 py-3 font-semibold text-slate-100 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Search movies &amp; shows
          </Link>
        </nav>
      </div>
    </main>
  );
}
