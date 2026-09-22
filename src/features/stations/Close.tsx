import Link from 'next/link'
import { ReactNode } from 'react'
import { monthLabel } from '@/features/grow/stages'

/*
 * 72개월 — 취학을 앞둔 봄. 동네가 마지막으로 열리고 카메라가 물러나 여섯 해 동안 드나든
 * 건물을 한 화면에 담는다. 태어난 봄에 심은 나무가 동네 나무만큼 자라 있다.
 *
 * 개월 수와 관계없는 이야기(모르는 것 · 부모의 기록 · 개인정보)는 구간으로 세우지 않고 여기
 * 원칙 카드로 모은다. 억지로 "48개월" 배지를 붙이면 스크롤 = 개월 수라는 약속이 흐려진다.
 */
const PRINCIPLES = [
  {
    href: '/data',
    title: '모르는 건 모른다고 씁니다',
    body: '확실하지 않은 금액은 미상으로 둡니다. 0원으로 채우지 않습니다.',
  },
  {
    href: '/facilities',
    title: '겪은 부모의 기록으로 채웁니다',
    body: '금액 제보와 입소 기록이 세 건 모이기 전에는 숫자를 만들지 않습니다.',
  },
  {
    href: '/benefits',
    title: '대상인지는 세 갈래로 나눕니다',
    body: '소득을 입력하지 않았다고 탈락시키지 않습니다. 보류로 두고 함께 보여 드립니다.',
  },
  {
    href: '/trust',
    title: '아이의 정보는 부모의 것입니다',
    body: '건강 기록은 별도 동의 전에는 저장도 조회도 되지 않습니다. 언제든 내려받고 지울 수 있습니다.',
  },
] as const

export function Close(): ReactNode {
  return (
    <section id="m72" data-month={72} data-open="" className="yr-close" aria-labelledby="m72-title">
      <div className="yr-shell">
        <div className="yr-panel yr-close__panel" data-in="">
          <p className="badge yr-month">{monthLabel(72)} · 취학 전</p>
          <h2 id="m72-title" className="display yr-close__title">
            여섯 해 동안
            <br />
            놓친 것 없이 지나왔습니다
          </h2>
          <p className="yr-lede">
            태어난 봄에 심은 나무가 동네 나무만큼 자랐습니다. 그동안 열렸다 닫힌 지원과 드나든 건물이 한
            화면에 들어옵니다. 맘편한이 지켜 온 원칙은 넷입니다.
          </p>
        </div>

        <ul className="yr-principles">
          {PRINCIPLES.map((p) => (
            <li key={p.href} data-in="">
              <Link href={p.href} className="yr-principle">
                <h3 className="yr-principle__t">{p.title}</h3>
                <p className="yr-principle__b">{p.body}</p>
                <span className="yr-principle__more" aria-hidden="true">
                  자세히 보기 →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="yr-fine yr-close__repo" data-in="">
          판단의 근거는 전부 문서로 남겨 두었습니다.{' '}
          <a href="https://github.com/CareCode-Repo" target="_blank" rel="noreferrer noopener">
            개발 저장소 보기
          </a>
        </p>
      </div>
    </section>
  )
}
