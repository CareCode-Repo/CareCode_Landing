import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/content/site'

/**
 * 정적 출력에서도 빌드 시점에 sitemap.xml 로 떨어진다.
 * 페이지를 추가하면 여기에도 넣어야 검색엔진이 찾아간다.
 */
export const dynamic = 'force-static'

const PATHS = ['', '/benefits', '/facilities', '/data', '/trust']

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.7,
  }))
}
