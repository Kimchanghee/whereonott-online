import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
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

const TYPE_GUIDE: Record<string, { intro: string; checks: string[] }> = {
  movie: {
    intro: 'Use this movie board to scan theatrical releases, streaming originals, and library titles before opening a detail page. The cards stay internal first so users can compare titles instead of being pushed into an external ad click.',
    checks: ['Confirm the release year when titles are reused.', 'Open the detail page before choosing a provider.', 'Use search for local-language titles that do not appear in the weekly trend list.']
  },
  tv: {
    intro: 'Use this TV board for current drama, reality, anime, and documentary series. Series pages need a little more context than a poster, so the list keeps rating and title signals visible before the next click.',
    checks: ['Check whether the title is a series or a special episode.', 'Compare the original title with the local title.', 'Use search when a new season has not entered trending data yet.']
  },
  upcoming: {
    intro: 'Use the coming-soon board to plan watchlists before release. Upcoming availability can change quickly, so this page is designed as an internal discovery step rather than a thin outbound link list.',
    checks: ['Treat dates as early signals until the provider confirms them.', 'Recheck the detail page near release week.', 'Search by original title if the local title has not been announced.']
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as any) || !TYPE_LABEL[type]) return {};
  const title = `${TYPE_LABEL[type]} streaming guide | WhereOnOTT`;
  const description = `Browse ${TYPE_LABEL[type].toLowerCase()} with internal streaming context, release checks, ratings, and next-step guidance before opening a detail page.`;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/${type}/` },
    openGraph: { title, description, url: `https://whereonott.online/${locale}/${type}/` },
  };
}

export default async function MediaListPage({ params }: Props) {
  const { locale, type } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as any) || !TYPE_LABEL[type]) notFound();
  setRequestLocale(locale);

  const items = type === 'upcoming'
    ? await getUpcoming(locale as any).catch(() => [])
    : await getTrending(type as 'movie' | 'tv', 'week', locale as any).catch(() => []);
  const guide = TYPE_GUIDE[type];

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

        <section className="mt-6 grid gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-5 md:grid-cols-[1.3fr_1fr]">
          <div className="space-y-3 text-sm leading-6 text-slate-300">
            <p>{guide.intro}</p>
            <p>
              A useful streaming page should answer why a title deserves the next click. Compare the poster, title,
              vote signal, release timing, and media type here first, then open the internal detail page only for the
              titles that still look relevant. This keeps the experience focused on discovery instead of forcing an
              immediate external jump.
            </p>
          </div>
          <ul className="space-y-2 text-sm leading-6 text-slate-400">
            {guide.checks.map((check) => (
              <li key={check}>- {check}</li>
            ))}
            <li>- If a list is temporarily sparse, use search and the home board before assuming the title is unavailable.</li>
          </ul>
        </section>

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
