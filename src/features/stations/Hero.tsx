import Link from 'next/link'
import { ReactNode } from 'react'

/* 출생. 동네가 처음 보이는 자리라 지면을 비운다. */
export function Hero(): ReactNode {
  return (
    <section id="top" data-month={0} data-open="" className="yr-hero" aria-labelledby="top-title">
      <div className="yr-shell">
        <div className="yr-panel yr-hero__copy">
          <p className="badge" style={{ color: 'var(--brand-deep)' }}>
            육아 지원 알림 서비스
          </p>
          <h1 id="top-title" className="display yr-display">
            받을 수 있었는데
            <br />
            <span className="yr-hl">몰라서 못 받은 돈</span>
          </h1>
          <p className="yr-lede">
            육아 지원금은 중앙정부와 지자체가 따로 운영합니다. 대상인지 알기 어렵고, 신청 기한을 넘기면
            조용히 사라집니다. 맘편한은 아이의 개월 수를 따라가며 그때 열리는 것과 닫히는 것을 알려
            드립니다.
          </p>
          <p className="yr-hero__cta">
            <a className="yr-btn yr-btn--primary" href="#m01">
              여섯 해 따라가기
            </a>
            <Link className="yr-btn yr-btn--ghost" href="/data">
              데이터 출처 보기
            </Link>
          </p>
          <p className="yr-hint">스크롤하면 아이가 자랍니다 — 출생에서 72개월까지</p>
        </div>
      </div>
    </section>
  )
}
