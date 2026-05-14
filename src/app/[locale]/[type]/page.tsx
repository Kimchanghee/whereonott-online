import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTrending, getUpcoming } from '@/lib/tmdb';

interface Props {
  params: Promise<{ locale: string; type: string }>;
}

export const revalidate = 21600;

const SUPPORTED_LOCALES = ['ko', 'en', 'ja'] as const;
const TYPE_LABEL: Record<string, string> = {
  movie: 'Movies',
  tv: 'TV shows',
  upcoming: 'Coming soon',
};

export default async function MediaListPage({ params }: Props) {
  const { locale, type } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as any) || !TYPE_LABEL[type]) notFound();
  setRequestLocale(locale);

  const items = type === 'upcoming'
    ? await getUpcoming(locale as any).catch(() => [])
    : await getTrending(type as 'movie' | 'tv', 'week', locale as any).catch(() => []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 p-4">
        <div className="container mx-auto flex max-w-7xl items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-bold"><span className="text-red-500">Where</span>OnOTT</Link>
          <Link href={`/${locale}/search`} className="text-sm text-slate-400 hover:text-red-400">Search</Link>
        </div>
      </header>

      <section className="container mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-4xl font-bold tracking-tight">{TYPE_LABEL[type]}</h1>
        <p className="mt-3 text-slate-400">Browse current streaming availability and trending titles.</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {items.map((item: any) => {
            const mediaType = type === 'upcoming' ? 'movie' : type;
            return (
              <Link key={`${mediaType}-${item.id}`} href={`/${locale}/${mediaType}/${item.id}`} className="group overflow-hidden rounded-lg bg-slate-900 transition hover:ring-2 hover:ring-red-500">
                {item.posterUrl ? (
                  <Image src={item.posterUrl} alt={item.title} width={342} height={513} className="aspect-[2/3] w-full object-cover" />
                ) : (
                  <div className="aspect-[2/3] w-full bg-slate-800" />
                )}
                <div className="p-2">
                  <div className="line-clamp-2 text-sm font-medium">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-400">★ {item.voteAverage?.toFixed?.(1) ?? '-'}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
