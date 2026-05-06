import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getTrending, getUpcoming } from '@/lib/tmdb';

interface Props {
  params: Promise<{ locale: string }>;
}

export const revalidate = 21600; // 6h ISR

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
