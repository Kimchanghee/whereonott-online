import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getTrending, getUpcoming } from '@/lib/tmdb';

interface Props {
  params: Promise<{ locale: string }>;
}

export const revalidate = 21600; // 6h ISR

function buildAmazonUrl(keyword: string) {
  const url = new URL('https://www.amazon.com/s');
  url.searchParams.set('k', keyword);
  url.searchParams.set('tag', 'amazonfi00681-20');
  url.searchParams.set('linkCode', 'll2');
  return url.toString();
}

function buildCoupangUrl(keyword: string) {
  const custom = process.env.NEXT_PUBLIC_COUPANG_PARTNER_URL;
  if (custom) return custom;
  const url = new URL('https://www.coupang.com/np/search');
  url.searchParams.set('component', '');
  url.searchParams.set('q', keyword);
  return url.toString();
}

function buildAliExpressUrl(keyword: string) {
  const custom = process.env.NEXT_PUBLIC_ALIEXPRESS_PARTNER_URL;
  if (custom) return custom;
  return `https://www.aliexpress.com/w/wholesale-${encodeURIComponent(keyword.replace(/\s+/g, '-'))}.html`;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [trendingMovies, trendingTV, upcoming] = await Promise.all([
    getTrending('movie', 'week', locale as 'ko' | 'en' | 'ja').catch(() => []),
    getTrending('tv', 'week', locale as 'ko' | 'en' | 'ja').catch(() => []),
    getUpcoming(locale as 'ko' | 'en' | 'ja').catch(() => []),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="container mx-auto flex max-w-7xl items-center justify-between p-4">
          <Link href={`/${locale}`} className="text-2xl font-bold tracking-tight">
            <span className="text-red-500">Where</span>
            <span className="text-slate-100">OnOTT</span>
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href={`/${locale}/movie`} className="hover:text-red-400">Movies</Link>
            <Link href={`/${locale}/tv`} className="hover:text-red-400">TV</Link>
            <Link href={`/${locale}/upcoming`} className="hover:text-red-400">Upcoming</Link>
          </nav>
        </div>
      </header>

      <Section title="🔥 Trending Movies" items={trendingMovies.slice(0, 12)} locale={locale} />
      <Section title="📺 Trending TV" items={trendingTV.slice(0, 12)} locale={locale} />
      <Section title="🗓️ Coming Soon" items={upcoming.slice(0, 12)} locale={locale} />

      <section className="container mx-auto max-w-7xl px-4 pb-10">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="mb-2 text-xl font-semibold">Partner Picks</h2>
          <p className="mb-4 text-sm text-slate-400">홈시어터/OTT 시청 관련 추천 링크입니다.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <a className="rounded-lg border border-amber-400/40 bg-slate-950 p-4 hover:border-amber-300" href={buildAmazonUrl('streaming media player 4k')} target="_blank" rel="sponsored noopener noreferrer">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">Amazon</p>
              <p className="mt-1 text-sm">4K Streaming Player</p>
            </a>
            <a className="rounded-lg border border-blue-400/40 bg-slate-950 p-4 hover:border-blue-300" href={buildCoupangUrl('ott 셋톱박스')} target="_blank" rel="sponsored noopener noreferrer">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Coupang</p>
              <p className="mt-1 text-sm">OTT 셋톱박스</p>
            </a>
            <a className="rounded-lg border border-rose-400/40 bg-slate-950 p-4 hover:border-rose-300" href={buildAliExpressUrl('projector screen')} target="_blank" rel="sponsored noopener noreferrer">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">AliExpress</p>
              <p className="mt-1 text-sm">Projector Screen</p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function Section({ title, items, locale }: { title: string; items: any[]; locale: string }) {
  if (items.length === 0) return null;
  return (
    <section className="container mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={`/${locale}/${item.type}/${item.id}`}
            className="group overflow-hidden rounded-lg bg-slate-900 transition hover:scale-105 hover:ring-2 hover:ring-red-500"
          >
            {item.posterUrl ? (
              <Image
                src={item.posterUrl}
                alt={item.title}
                width={342}
                height={513}
                className="aspect-[2/3] w-full object-cover"
              />
            ) : (
              <div className="aspect-[2/3] w-full bg-slate-800" />
            )}
            <div className="p-2">
              <div className="line-clamp-2 text-sm font-medium">{item.title}</div>
              <div className="mt-1 text-xs text-slate-400">★ {item.voteAverage?.toFixed(1)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
