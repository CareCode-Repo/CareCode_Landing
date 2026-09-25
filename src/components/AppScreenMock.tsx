import { ReactNode } from 'react'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * 앱의 첫 화면.
 *
 * 소개 사이트가 제품 화면을 한 번도 보여주지 않으면, 읽는 사람은 "그래서 앱을 열면 뭐가
 * 보이는데?" 를 끝까지 알 수 없다. 스크린샷 대신 같은 구조를 여기서 다시 그린다 — 화면이
 * 바뀔 때마다 이미지를 다시 찍어 올릴 필요가 없고, 글자가 DOM 이라 읽히고 번역된다.
 *
 * 항목은 앱의 "지금 할 일"이 실제로 올리는 종류와 같다(소급 가능한 지원금 · 접종 예정일 ·
 * 대기 순번). 값은 예시라 화면에도 예시라고 적는다.
 */
type Row = { tag: string; title: string; detail: string; urgent?: boolean }

const ROWS: Row[] = [
  {
    tag: '지원금',
    title: '소급 신청할 수 있는 지원금 2건',
    detail: '120만원 · 기간이 지나면 사라져요',
    urgent: true,
  },
  { tag: '접종', title: '서아 · 일본뇌염 2차', detail: '2026.10.02 · 7일 남음' },
  { tag: '어린이집', title: '대기 중인 어린이집 3곳', detail: '가장 앞선 순번 4번' },
]

export default function AppScreenMock(): ReactNode {
  return (
    <figure className="yr-phone">
      <div className="yr-phone__frame">
        <div className="yr-phone__bar">
          {/* eslint-disable-next-line @next/next/no-img-element -- 정적 출력이라 next/image 최적화를 쓸 수 없다 */}
          <img src={`${BASE_PATH}/icon.svg`} alt="" width={20} height={20} className="rounded-[6px]" />
          <span className="yr-phone__title">홈</span>
        </div>

        {/* 앱 상단의 기준 — 어느 아이, 어디 사는가 */}
        <div className="yr-phone__chips">
          <span className="yr-phone__chip yr-phone__chip--child">서아 · 2세 3개월</span>
          <span className="yr-phone__chip">성남시 분당구</span>
        </div>

        <p className="yr-phone__section">지금 할 일</p>
        <ul className="yr-phone__list">
          {ROWS.map((row) => (
            <li key={row.title}>
              <span className={row.urgent ? 'yr-phone__tag yr-phone__tag--urgent' : 'yr-phone__tag'}>
                {row.tag}
              </span>
              <span>
                <b>{row.title}</b>
                <small>{row.detail}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="yr-fine">
        앱을 열면 보이는 첫 화면입니다. 기한이 걸린 것만 위에 오고, 찾아보는 기능은 그 아래에
        있습니다. 위 값은 예시입니다.
      </figcaption>
    </figure>
  )
}
