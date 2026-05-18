import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getDetail, getWatchProviders } from '@/lib/tmdb';

interface Props {
  params: Promise<{ locale: string; type: string; id: string }>;
}

export const revalidate = 86400; // 24h ISR

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type, id } = await params;
  if (type !== 'movie' && type !== 'tv') return {};
  try {
    const detail = await getDetail(type, Number(id), locale as any);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://whereonott.online';
    return {
      title: `Where to watch ${detail.title}`,
      description: detail.overview || `Find where to stream ${detail.title}.`,
      alternates: {
        canonical: `/${locale}/${type}/${id}`,
        languages: {
          ko: `/ko/${type}/${id}`,
          en: `/en/${type}/${id}`,
          ja: `/ja/${type}/${id}`,
        },
      },
      openGraph: {
        title: detail.title,
        description: detail.overview,
        url: `${baseUrl}/${locale}/${type}/${id}`,
        images: detail.backdropUrl ? [detail.backdropUrl] : [],
      },
    };
  } catch {
    return {};
  }
}

const REGION_MAP: Record<string, 'KR' | 'US' | 'JP'> = { ko: 'KR', en: 'US', ja: 'JP' };

export default async function MediaDetail({ params }: Props) {
  const { locale, type, id } = await params;
  if (type !== 'movie' && type !== 'tv') notFound();

  const detail = await getDetail(type, Number(id), locale as any).catch(() => null);
  if (!detail) notFound();

  const [krProviders, usProviders, jpProviders] = await Promise.all([
    getWatchProviders(type, Number(id), 'KR').catch(() => null),
    getWatchProviders(type, Number(id), 'US').catch(() => null),
    getWatchProviders(type, Number(id), 'JP').catch(() => null),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="container mx-auto flex max-w-7xl items-center justify-between p-4">
          <Link href={`/${locale}`} className="text-2xl font-bold">
            <span className="text-red-500">Where</span>OnOTT
          </Link>
        </div>
      </header>

      {detail.backdropUrl && (
        <div className="relative h-64 md:h-96">
          <Image src={detail.backdropUrl} alt={detail.title} fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
        </div>
      )}

      <section className="container mx-auto -mt-32 max-w-7xl px-4 pb-12">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          {detail.posterUrl && (
            <Image
              src={detail.posterUrl}
              alt={detail.title}
              width={300}
              height={450}
              className="rounded-xl shadow-2xl"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{detail.title}</h1>
            <div className="mt-2 text-sm text-slate-400">
              {detail.originalTitle} · {detail.releaseDate?.slice(0, 4)} · ★ {detail.voteAverage?.toFixed(1)}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {detail.genres?.map((g) => (
                <span key={g.id} className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                  {g.name}
                </span>
              ))}
            </div>
            <p className="mt-4 max-w-3xl text-slate-300">{detail.overview}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <ProviderBlock
            title={locale === 'ko' ? '한국 OTT' : locale === 'ja' ? '日本のOTT' : 'KR providers'}
            data={krProviders}
          />
          <ProviderBlock title={locale === 'ja' ? 'アメリカのOTT' : 'US providers'} data={usProviders} />
          <ProviderBlock title={locale === 'ko' ? '일본 OTT' : 'JP providers'} data={jpProviders} />
        </div>
      </section>
    </main>
  );
}

function ProviderBlock({ title, data }: { title: string; data: any }) {
  if (!data) return null;
  const sections = [
    { label: 'Stream', list: data.flatrate },
    { label: 'Rent', list: data.rent },
    { label: 'Buy', list: data.buy },
  ].filter((s) => s.list?.length > 0);

  if (sections.length === 0) {
    return (
      <div className="rounded-xl bg-slate-900 p-5">
        <h3 className="mb-3 font-semibold">{title}</h3>
        <p className="text-sm text-slate-500">현재 시청 가능한 OTT가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-900 p-5">
      <h3 className="mb-3 font-semibold">{title}</h3>
      {sections.map((s) => (
        <div key={s.label} className="mb-4 last:mb-0">
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-500">{s.label}</div>
          <div className="flex flex-wrap gap-2">
            {s.list.map((p: any) => (
              <a
                key={p.providerId}
                href={data.link}
                target="_blank"
                rel="noopener noreferrer sponsored nofollow"
                title={p.providerName}
                className="block transition hover:scale-110"
               data-affiliate-link>
                {p.logoUrl && (
                  <Image
                    src={p.logoUrl}
                    alt={p.providerName}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
