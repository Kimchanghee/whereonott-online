import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getTrending, getUpcoming } from '@/lib/tmdb';

interface Props {
  params: Promise<{ locale: string }>;
}

export const revalidate = 21600; // 6h ISR

const FALLBACK_MOVIES = [
  { id: 'fallback-dune-part-two', type: 'movie', title: 'Dune: Part Two', posterUrl: '', voteAverage: 8.5 },
  { id: 'fallback-inside-out-2', type: 'movie', title: 'Inside Out 2', posterUrl: '', voteAverage: 8.0 },
  { id: 'fallback-oppenheimer', type: 'movie', title: 'Oppenheimer', posterUrl: '', voteAverage: 8.1 },
  { id: 'fallback-poor-things', type: 'movie', title: 'Poor Things', posterUrl: '', voteAverage: 7.7 },
  { id: 'fallback-godzilla-minus-one', type: 'movie', title: 'Godzilla Minus One', posterUrl: '', voteAverage: 7.8 },
  { id: 'fallback-the-batman', type: 'movie', title: 'The Batman', posterUrl: '', voteAverage: 7.7 },
];

const FALLBACK_TV = [
  { id: 'fallback-shogun', type: 'tv', title: 'Shogun', posterUrl: '', voteAverage: 8.6 },
  { id: 'fallback-the-bear', type: 'tv', title: 'The Bear', posterUrl: '', voteAverage: 8.2 },
  { id: 'fallback-fallout', type: 'tv', title: 'Fallout', posterUrl: '', voteAverage: 8.3 },
  { id: 'fallback-severance', type: 'tv', title: 'Severance', posterUrl: '', voteAverage: 8.5 },
  { id: 'fallback-queen-of-tears', type: 'tv', title: 'Queen of Tears', posterUrl: '', voteAverage: 8.2 },
  { id: 'fallback-moving', type: 'tv', title: 'Moving', posterUrl: '', voteAverage: 8.4 },
];

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

  const [trendingMoviesRaw, trendingTVRaw, upcomingRaw] = await Promise.all([
    getTrending('movie', 'week', locale as 'ko' | 'en' | 'ja').catch(() => []),
    getTrending('tv', 'week', locale as 'ko' | 'en' | 'ja').catch(() => []),
    getUpcoming(locale as 'ko' | 'en' | 'ja').catch(() => []),
  ]);
  const trendingMovies = trendingMoviesRaw.length ? trendingMoviesRaw : FALLBACK_MOVIES;
  const trendingTV = trendingTVRaw.length ? trendingTVRaw : FALLBACK_TV;
  const upcoming = upcomingRaw.length ? upcomingRaw : FALLBACK_MOVIES.slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="container mx-auto flex max-w-7xl items-center justify-between p-4">
          <Link href={`/${locale}`} className="text-2xl font-bold tracking-tight">
            <span className="text-red-500">Where</span>
            <span className="text-slate-100">OnOTT</span>
          </Link>
          <nav className="flex gap-4 text-sm">
            <a href="#movies" className="hover:text-red-400">Movies</a>
            <a href="#tv" className="hover:text-red-400">TV</a>
            <a href="#upcoming" className="hover:text-red-400">Upcoming</a>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-br from-red-950 to-slate-950 py-10">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight">영화와 드라마를 어디서 볼 수 있는지 빠르게 비교하세요</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            인기 영화, TV 시리즈, 공개 예정작을 한 화면에서 확인하고 세부 정보 페이지로 바로 이동할 수 있습니다.
          </p>
        </div>
      </section>

      <Section id="movies" title="🔥 Trending Movies" items={trendingMovies.slice(0, 12)} />
      <Section id="tv" title="📺 Trending TV" items={trendingTV.slice(0, 12)} />
      <Section id="upcoming" title="🗓️ Coming Soon" items={upcoming.slice(0, 12)} />

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

function detailsUrl(item: any) {
  if (String(item.id).startsWith('fallback-')) {
    return `https://www.google.com/search?q=${encodeURIComponent(`${item.title} where to watch`)}`;
  }
  const type = item.type === 'tv' ? 'tv' : 'movie';
  return `https://www.themoviedb.org/${type}/${item.id}`;
}

function Section({ id, title, items }: { id: string; title: string; items: any[] }) {
  if (items.length === 0) return null;
  return (
    <section id={id} className="container mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {items.map((item) => (
          <a
            key={`${item.type}-${item.id}`}
            href={detailsUrl(item)}
            target="_blank"
            rel="noopener noreferrer"
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
          </a>
        ))}
      </div>
    </section>
  );
}
