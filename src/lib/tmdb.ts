/**
 * TMDB API 래퍼.
 * 무료 공식 API: https://developer.themoviedb.org/reference/intro/getting-started
 *
 * 환경변수: TMDB_BEARER (Read Access Token)
 *
 * 호출 패턴:
 *  - 빌드 타임 ISR: 일 1회 인기작 + 신규작 fetch → SSG 페이지 생성
 *  - 런타임 Edge: 사용자 검색 시 직접 호출
 */

const BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

interface TmdbConfig {
  bearer: string;
  region: 'KR' | 'US' | 'JP';
  language: 'ko-KR' | 'en-US' | 'ja-JP';
}

function getConfig(language: 'ko' | 'en' | 'ja' = 'ko'): TmdbConfig {
  const langMap = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' } as const;
  const regionMap = { ko: 'KR', en: 'US', ja: 'JP' } as const;
  return {
    bearer: process.env.TMDB_BEARER || '',
    region: regionMap[language],
    language: langMap[language],
  };
}

async function tmdbFetch<T>(path: string, lang: 'ko' | 'en' | 'ja' = 'ko'): Promise<T> {
  const cfg = getConfig(lang);
  const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}language=${cfg.language}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${cfg.bearer}`, accept: 'application/json' },
    next: { revalidate: 60 * 60 * 24 }, // 24h ISR
  });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  return res.json();
}

export interface MediaItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  overview: string;
  voteAverage: number;
  genreIds: number[];
}

export interface WatchProvider {
  providerId: number;
  providerName: string;
  logoUrl: string;
}

export interface WatchAvailability {
  flatrate: WatchProvider[];   // 구독형 (Netflix, Tving, Wavve)
  rent: WatchProvider[];        // 대여
  buy: WatchProvider[];         // 구매
  link: string;                 // JustWatch deep link
}

function poster(path?: string | null, size: 'w185' | 'w342' | 'w500' = 'w342'): string | null {
  return path ? `${IMG_BASE}/${size}${path}` : null;
}

function backdrop(path?: string | null, size: 'w780' | 'w1280' = 'w1280'): string | null {
  return path ? `${IMG_BASE}/${size}${path}` : null;
}

/* -------- Public API -------- */

export async function getTrending(
  type: 'movie' | 'tv',
  window: 'day' | 'week' = 'week',
  lang: 'ko' | 'en' | 'ja' = 'ko'
): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: any[] }>(`/trending/${type}/${window}`, lang);
  return data.results.map((r) => ({
    id: r.id,
    type,
    title: r.title || r.name,
    originalTitle: r.original_title || r.original_name,
    releaseDate: r.release_date || r.first_air_date || '',
    posterUrl: poster(r.poster_path),
    backdropUrl: backdrop(r.backdrop_path),
    overview: r.overview,
    voteAverage: r.vote_average,
    genreIds: r.genre_ids || [],
  }));
}

export async function getDetail(
  type: 'movie' | 'tv',
  id: number,
  lang: 'ko' | 'en' | 'ja' = 'ko'
): Promise<MediaItem & { runtime?: number; genres: { id: number; name: string }[] }> {
  const r = await tmdbFetch<any>(`/${type}/${id}`, lang);
  return {
    id: r.id,
    type,
    title: r.title || r.name,
    originalTitle: r.original_title || r.original_name,
    releaseDate: r.release_date || r.first_air_date || '',
    posterUrl: poster(r.poster_path, 'w500'),
    backdropUrl: backdrop(r.backdrop_path),
    overview: r.overview,
    voteAverage: r.vote_average,
    genreIds: r.genres?.map((g: any) => g.id) || [],
    genres: r.genres || [],
    runtime: r.runtime || (r.episode_run_time?.[0] ?? undefined),
  };
}

export async function getWatchProviders(
  type: 'movie' | 'tv',
  id: number,
  region: 'KR' | 'US' | 'JP' = 'KR'
): Promise<WatchAvailability | null> {
  const data = await tmdbFetch<any>(`/${type}/${id}/watch/providers`);
  const r = data.results?.[region];
  if (!r) return null;
  const map = (arr: any[] = []): WatchProvider[] =>
    arr.map((p) => ({
      providerId: p.provider_id,
      providerName: p.provider_name,
      logoUrl: poster(p.logo_path, 'w185') || '',
    }));
  return {
    flatrate: map(r.flatrate),
    rent: map(r.rent),
    buy: map(r.buy),
    link: r.link || '',
  };
}

export async function searchMulti(query: string, lang: 'ko' | 'en' | 'ja' = 'ko'): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: any[] }>(`/search/multi?query=${encodeURIComponent(query)}`, lang);
  return data.results
    .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
    .map((r) => ({
      id: r.id,
      type: r.media_type as 'movie' | 'tv',
      title: r.title || r.name,
      originalTitle: r.original_title || r.original_name,
      releaseDate: r.release_date || r.first_air_date || '',
      posterUrl: poster(r.poster_path),
      backdropUrl: backdrop(r.backdrop_path),
      overview: r.overview,
      voteAverage: r.vote_average,
      genreIds: r.genre_ids || [],
    }));
}

export async function getUpcoming(lang: 'ko' | 'en' | 'ja' = 'ko'): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: any[] }>(`/movie/upcoming?region=${getConfig(lang).region}`, lang);
  return data.results.map((r) => ({
    id: r.id,
    type: 'movie' as const,
    title: r.title,
    originalTitle: r.original_title,
    releaseDate: r.release_date,
    posterUrl: poster(r.poster_path),
    backdropUrl: backdrop(r.backdrop_path),
    overview: r.overview,
    voteAverage: r.vote_average,
    genreIds: r.genre_ids || [],
  }));
}
