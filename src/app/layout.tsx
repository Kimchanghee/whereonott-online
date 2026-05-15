import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'WhereOnOTT — 어디서 볼까? 영화·드라마 OTT 검색',
  description: '넷플릭스·디즈니플러스·웨이브·티빙·왓챠·쿠팡플레이 영화/드라마/애니 어디서 볼 수 있는지 한 번에 검색.',
  keywords: ['OTT', '넷플릭스', '디즈니플러스', '웨이브', '티빙', '왓챠', '쿠팡플레이', '어디서 볼까', 'where to watch', 'streaming'],
  metadataBase: new URL('https://whereonott.online'),
  alternates: {
    canonical: '/',
    languages: { ko: '/ko', en: '/en', 'x-default': '/' },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://whereonott.online',
    siteName: 'WhereOnOTT',
    title: 'WhereOnOTT — 어디서 볼까? OTT 통합 검색',
    description: '넷플릭스·디즈니플러스·웨이브·티빙 통합 검색',
  },
  twitter: { card: 'summary_large_image', title: 'WhereOnOTT', description: 'OTT 통합 검색' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-G0YE8ZCN66" />
        <script
          dangerouslySetInnerHTML={{
            __html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-G0YE8ZCN66',{page_path:window.location.pathname});",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                { '@type': 'Organization', '@id': 'https://whereonott.online#org', name: 'WhereOnOTT', url: 'https://whereonott.online' },
                { '@type': 'WebSite', '@id': 'https://whereonott.online#site', url: 'https://whereonott.online', name: 'WhereOnOTT', inLanguage: 'ko-KR', publisher: { '@id': 'https://whereonott.online#org' } },
                { '@type': 'WebApplication', name: 'WhereOnOTT', applicationCategory: 'EntertainmentApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
