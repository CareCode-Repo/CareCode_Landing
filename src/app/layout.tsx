import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import Link from 'next/link'
import { ReactNode } from 'react'
import SiteNav from '@/components/SiteNav'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/content/site'
import { Shell } from '@/components/Page'
import '@/styles/globals.css'

/** 금액·개월·수치용. 자릿수가 흔들리지 않아야 표와 축이 읽힌다. */
const plexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-figure',
})

export const metadata: Metadata = {
  // sitemap·OG 가 절대 URL 을 요구한다. 페이지마다 다시 쓰지 않도록 여기서 기준을 잡는다.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <html lang="ko" className={plexMono.variable}>
      <body className="paper-grid min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2"
          style={{ backgroundColor: 'var(--paper)', border: '1px solid var(--rule)' }}
        >
          본문으로 건너뛰기
        </a>

        <SiteNav />
        <main id="main">{children}</main>

        <footer className="py-14 md:py-20">
          <Shell>
            <div className="grid gap-10 md:grid-cols-[1fr_auto]">
              <div className="max-w-md">
                <p className="display text-[1.35rem]">맘편한</p>
                <p className="mt-3 text-[0.9rem] leading-[1.8]" style={{ color: 'var(--ink-soft)' }}>
                  이 사이트에 적힌 금액과 예측은 참고 자료입니다. 실제 수령액과 입소 여부는
                  지자체·시설 안내를 따릅니다.
                </p>
              </div>

              <nav aria-label="문서">
                <p className="label">문서</p>
                <ul className="mt-4 space-y-2.5 text-[0.9rem]">
                  <li>
                    <Link href="/trust" style={{ color: 'var(--ink-soft)' }}>
                      개인정보 처리방침
                    </Link>
                  </li>
                  <li>
                    <Link href="/data" style={{ color: 'var(--ink-soft)' }}>
                      데이터 출처와 한계
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://github.com/CareCode-Repo"
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      개발 저장소
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <p className="label mt-12">© 2026 CARECODE</p>
          </Shell>
        </footer>
      </body>
    </html>
  )
}
