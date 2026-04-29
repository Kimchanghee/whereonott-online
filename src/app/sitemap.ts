import type { MetadataRoute } from 'next';

const SITE = 'https://whereonott.online';
const LOCALES = ['ko', 'en', 'ja'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE}/${locale}`,
      lastModified, changeFrequency: 'daily', priority: 1.0,
      alternates: { languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE}/${l}`])) },
    });
    entries.push({ url: `${SITE}/${locale}/movie`, lastModified, changeFrequency: 'daily', priority: 0.9 });
    entries.push({ url: `${SITE}/${locale}/tv`, lastModified, changeFrequency: 'daily', priority: 0.9 });
    entries.push({ url: `${SITE}/${locale}/upcoming`, lastModified, changeFrequency: 'daily', priority: 0.85 });
    entries.push({ url: `${SITE}/${locale}/search`, lastModified, changeFrequency: 'weekly', priority: 0.6 });
  }

  // TMDB 인기 작품들의 동적 URL은 빌드 시 fetch하여 추가 가능
  // (생략 — 빌드 시 sync-tmdb 스크립트가 실행되며 자동으로 채워짐)

  return entries;
}
