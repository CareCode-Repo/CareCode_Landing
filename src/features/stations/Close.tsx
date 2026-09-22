import Link from 'next/link'
import { ReactNode } from 'react'
import { monthLabel } from '@/features/grow/stages'

/*
 * 72개월 — 취학을 앞둔 봄. 동네가 마지막으로 열리고 카메라가 물러나 여섯 해 동안 드나든
 * 건물을 한 화면에 담는다. 태어난 봄에 심은 나무가 동네 나무만큼 자라 있다.
 */
const DOCS = [
  { href: '/benefits', label: '지원금 — 자격 판정과 계산' },
  { href: '/facilities', label: '어린이집 — 빈자리 알림 설계' },
  { href: '/data', label: '데이터 — 출처와 한계' },
  { href: '/trust', label: '개인정보 — 받는 것과 그 이유' },
] as const

export function Close(): ReactNode {
  return (
    <section id="m72" data-month={72} data-open="" className="yr-close" aria-labelledby="m72-title">
      <div className="yr-shell">
        <div className="yr-close__grid">
          <div className="yr-panel" data-in="">
            <p className="stamp yr-stamp">{monthLabel(72)}</p>
            <h2 id="m72-title" className="display yr-close__title">
              여섯 해가 지나고,
              <br />
              놓친 것 대신 기록이 남습니다.
            </h2>
            <p className="yr-lede">
              태어난 봄에 심은 나무가 동네 나무만큼 자랐습니다. 그동안 열렸다 닫힌 지원과 드나든
              건물이 한 화면에 들어옵니다. 판단의 근거는 전부 문서로 남겨 두었습니다.
            </p>
          </div>

          <nav className="yr-docs" aria-label="판단의 근거" data-in="">
            {DOCS.map((d) => (
              <Link key={d.href} href={d.href} className="yr-doc">
                <span>{d.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
            <a className="yr-doc" href="https://github.com/CareCode-Repo" target="_blank" rel="noreferrer noopener">
              <span>개발 저장소</span>
              <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </div>
    </section>
  )
}
