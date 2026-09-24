import Link from 'next/link'
import { ReactNode } from 'react'
import { APP_URL, STORE_URLS } from '@/content/site'

/**
 * 서비스로 들어가는 문.
 *
 * 이 사이트에서 가장 중요한 요소다. 아무리 잘 설명해도 시작할 방법이 없으면 방문자는
 * 읽고 나갈 뿐이다. 지금까지 이 사이트의 모든 링크는 다른 설명 페이지나 개발 저장소로만
 * 갔다.
 *
 * 주소가 아직 없을 수 있다(출시 전). 그때는 버튼처럼 보이되 눌리지 않는 상태로 두고 왜
 * 그런지 적는다 — 링크를 눌렀는데 아무 일도 일어나지 않는 것이 가장 나쁘다.
 */
export function StartCta({
  variant = 'primary',
  children = '맘편한 시작하기',
}: {
  variant?: 'primary' | 'ghost'
  children?: ReactNode
}): ReactNode {
  const className = `yr-btn yr-btn--${variant}`

  if (!APP_URL) {
    return (
      <span className={className} aria-disabled="true" style={{ opacity: 0.55, cursor: 'default' }}>
        출시 준비 중
      </span>
    )
  }

  return (
    <a className={className} href={APP_URL}>
      {children}
    </a>
  )
}

/**
 * 스토어로 보내는 줄.
 *
 * 공식 배지 이미지는 각 스토어의 상표 가이드라인을 따라야 하고, 아직 스토어 주소도 없다.
 * 주소가 생기기 전까지는 글자로 둔다 — 가짜 배지를 걸어 두면 눌러 본 사람에게 거짓말이 된다.
 */
export function StoreLinks(): ReactNode {
  const stores = [
    { key: 'android', label: 'Google Play', url: STORE_URLS.android },
    { key: 'ios', label: 'App Store', url: STORE_URLS.ios },
  ] as const

  const available = stores.filter((store) => store.url)

  if (available.length === 0) {
    return (
      <p className="text-[0.9rem]" style={{ color: 'var(--fg-soft)' }}>
        앱은 준비 중입니다. 그동안 웹에서 같은 기능을 쓰실 수 있습니다.
      </p>
    )
  }

  return (
    <ul className="flex flex-wrap gap-3">
      {available.map((store) => (
        <li key={store.key}>
          <a className="yr-btn yr-btn--ghost" href={store.url} target="_blank" rel="noreferrer noopener">
            {`${store.label} 에서 받기`}
          </a>
        </li>
      ))}
    </ul>
  )
}

/** 푸터와 마지막 구간에서 함께 쓰는 묶음. */
export function StartSection(): ReactNode {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <StartCta />
        <Link className="yr-btn yr-btn--ghost" href="/data">
          데이터 출처 보기
        </Link>
      </div>
      <StoreLinks />
    </div>
  )
}
