import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { searchMulti } from '@/lib/tmdb';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { q = '' } = await searchParams;
  return {
    title: q ? `Search: ${q}` : 'Search movies & TV',
    description: `Find streaming availability for "${q}"`,
    alternates: { canonical: `/${locale}/search?q=${encodeURIComponent(q)}` },
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q = '' } = await searchParams;
  setRequestLocale(locale);

  const results = q.trim() ? await searchMulti(q, locale as any).catch(() => []) : [];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl p-4">
          <Link href={`/${locale}`} className="text-2xl font-bold mb-4 inline-block">
            <span className="text-red-500">Where</span>OnOTT
          </Link>
          <form action={`/${locale}/search`} method="get" className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="영화·드라마·배우 검색..."
              className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
              autoFocus
            />
            <button type="submit" className="rounded-lg bg-red-600 px-6 py-2 hover:bg-red-700 font-medium">
              Search
            </button>
          </form>
        </div>
      </header>

      <section className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">Search streaming availability</h1>
          <p className="mt-3 text-slate-400">
            Type a movie, drama, anime, actor, or original title to find likely streaming pages and compare where to watch next.
            Results open inside WhereOnOTT first, so the click path does not jump straight to an ad or unrelated landing page.
          </p>
        </div>
        {q.trim() === '' ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300">
            <p className="text-2xl font-semibold text-slate-100">키워드를 입력해 주세요</p>
            <p className="mt-2 text-sm">예: 오징어 게임, 기생충, 더 글로리, Shogun, Fallout, One Piece</p>
            <ul className="mt-5 grid gap-3 text-sm leading-6 md:grid-cols-3">
              <li className="rounded-lg bg-slate-950 p-4">작품명을 먼저 검색한 뒤 영화/TV 구분을 확인하세요.</li>
              <li className="rounded-lg bg-slate-950 p-4">결과 카드의 평점과 포스터를 보고 같은 제목의 다른 작품을 피하세요.</li>
              <li className="rounded-lg bg-slate-950 p-4">상세 페이지에서 제공사와 공개일 정보를 함께 확인하세요.</li>
            </ul>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300">
            <p className="text-2xl font-semibold text-slate-100">"{q}"에 대한 결과 없음</p>
            <p className="mt-3 text-sm leading-6">
              한국어 제목이 없으면 원제, 배우 이름, 시즌명, 또는 짧은 핵심 단어로 다시 검색해 보세요.
              오래된 작품은 국가별 제공권이 자주 바뀌므로 검색어를 바꿔 확인하는 편이 정확합니다.
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-4 text-xl">
              <span className="text-slate-400">"{q}"</span> 검색 결과 — {results.length}개
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {results.map((r) => (
                <Link
                  key={`${r.type}-${r.id}`}
                  href={`/${locale}/${r.type}/${r.id}`}
                  className="group overflow-hidden rounded-lg bg-slate-900 transition hover:scale-105 hover:ring-2 hover:ring-red-500"
                >
                  {r.posterUrl ? (
                    <Image src={r.posterUrl} alt={r.title} width={342} height={513} className="aspect-[2/3] w-full object-cover" />
                  ) : (
                    <div className="aspect-[2/3] w-full bg-slate-800 flex items-center justify-center text-slate-600 text-xs">No image</div>
                  )}
                  <div className="p-2">
                    <div className="line-clamp-2 text-sm font-medium">{r.title}</div>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                      <span className="uppercase">{r.type}</span>
                      <span>★ {r.voteAverage?.toFixed(1)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
