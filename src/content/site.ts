/**
 * 사이트 주소. sitemap·robots·OG 태그가 절대 URL 을 요구한다.
 *
 * 배포 워크플로가 NEXT_PUBLIC_SITE_URL 을 넣는다. 커스텀 도메인을 붙이면 그 값만 바꾸면 된다.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://carecode-repo.github.io/CareCode_Landing'
).replace(/\/$/, '')

export const SITE_NAME = '맘편한'
export const SITE_TAGLINE = '놓치는 육아 지원을 줄입니다'
export const SITE_DESCRIPTION =
  '받을 수 있는 지원금, 자리가 난 어린이집, 마감이 다가온 신청. 정부 공공데이터를 모아 부모에게 필요한 형태로 알려 드립니다.'
