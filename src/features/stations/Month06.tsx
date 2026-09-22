import Link from 'next/link'
import { ReactNode } from 'react'
import VacancyNotice from '@/components/VacancyNotice'
import { SILENT_CASES } from '@/content/facts'
import { monthLabel } from '@/features/grow/stages'

/*
 * 6개월 — 어린이집 대기를 거는 무렵. 동네가 열리고 카메라가 어린이집 앞마당으로 간다.
 * 이 구간의 주인공은 풍경이라 글은 카드 하나에 모은다.
 */
export function Month06(): ReactNode {
  return (
    <section id="m06" data-month={6} data-open="" className="yr-station yr-station--open" aria-labelledby="m06-title">
      <div className="yr-shell">
        <div className="yr-panel" data-in="">
          <p className="badge yr-month">{monthLabel(6)}</p>
          <h2 id="m06-title" className="display yr-h2">
            자리가 났다는 걸
            <br />
            아무도 알려 주지 않습니다
          </h2>
          <p className="yr-panel__body">
            대기를 걸어 두면 그다음은 기다리는 일뿐입니다. 맘편한은 대기 걸어 둔 시설의 정원을 매주
            관측해 <strong>자리가 늘어난 순간에만</strong> 알립니다.
          </p>

          <div className="yr-panel__notice">
            <VacancyNotice />
          </div>

          <h3 className="yr-h3">알리지 않는 경우</h3>
          <dl className="yr-rows">
            {SILENT_CASES.map((c) => (
              <div key={c.when} className="yr-rows__row">
                <dt>{c.when}</dt>
                <dd>{c.why}</dd>
              </div>
            ))}
          </dl>
          <p className="yr-fine">
            알림은 앱을 다시 열 유일한 이유이자, 성가시면 앱을 지우게 되는 이유입니다.{' '}
            <Link href="/facilities">빈자리 알림 설계 보기</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
