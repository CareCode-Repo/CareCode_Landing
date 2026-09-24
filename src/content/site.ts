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

/**
 * 서비스로 들어가는 문.
 *
 * 이 사이트는 "무엇을 왜 만드는가" 를 설명하지만, 설명만 읽고 나갈 수는 없어야 한다.
 * 실제 서비스 주소와 스토어 주소를 여기 모아 두고, **없으면 없다고 말한다** — 죽은 링크를
 * 눌러 아무 일도 일어나지 않는 것보다 "출시 준비 중" 이 낫다.
 *
 * 배포 워크플로가 환경변수로 넣는다. 스토어 심사가 끝나면 그 값만 채우면 된다.
 */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '')

export const STORE_URLS = {
  android: process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '',
  ios: process.env.NEXT_PUBLIC_APP_STORE_URL ?? '',
} as const

/**
 * 문의처. 스토어 등록과 개인정보 처리방침이 모두 연락 수단을 요구한다.
 *
 * 기본값을 두지 않는다. 개인 메일 주소를 공개 사이트에 박아 두면 되돌릴 수 없다.
 * 값이 없으면 문의 안내를 아예 그리지 않는다.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ''
