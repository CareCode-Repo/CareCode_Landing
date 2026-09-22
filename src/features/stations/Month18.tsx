import Link from 'next/link'
import { ReactNode } from 'react'
import { MEASURED_LABEL, SOURCES, formatCount } from '@/content/figures'
import { monthLabel } from '@/features/grow/stages'

/*
 * 18개월 — 접종과 검진이 이어지는 시기. 동네가 다시 열리고 카메라가 모퉁이 상가의 소아과로 간다.
 * 앱에 실제로 있는 기능만 적는다(예방접종 일정 자동 생성 · 임박 알림 · 민감정보 동의).
 */
export function Month18(): ReactNode {
  const clinics = SOURCES.find((s) => s.gets === '소아청소년과')

  return (
    <section id="m18" data-month={18} data-open="" className="yr-station yr-station--open" aria-labelledby="m18-title">
      <div className="yr-shell">
        <div className="yr-panel" data-in="">
          <p className="stamp yr-stamp">{monthLabel(18)}</p>
          <h2 id="m18-title" className="display yr-h2">
            접종 날짜는
            <br />
            생년월일이 이미 알고 있습니다
          </h2>
          <p className="yr-panel__body">
            아이를 등록하면 생년월일에 맞는 표준 예방접종 일정을 자동으로 만듭니다. 생년월일을 고치면
            예정일도 함께 다시 계산됩니다. 접종과 검진 날짜가 다가오면 알립니다.
          </p>

          <dl className="yr-rows">
            {clinics && (
              <div className="yr-rows__row">
                <dt>가까운 소아청소년과</dt>
                <dd>
                  <span className="figure">{formatCount(clinics.count)}곳</span> · {clinics.name} ·{' '}
                  {MEASURED_LABEL}
                </dd>
              </div>
            )}
            <div className="yr-rows__row">
              <dt>성장 기록</dt>
              <dd>키, 몸무게, 체온과 진료 기록을 날짜별로 남깁니다</dd>
            </div>
            <div className="yr-rows__row">
              <dt>
                <span className="stamp" style={{ color: 'var(--stamp)' }}>
                  민감정보
                </span>
              </dt>
              <dd>별도 동의 전에는 저장도 조회도 되지 않습니다. 막힐 때는 어떤 동의가 필요한지 함께 알려 드립니다</dd>
            </div>
          </dl>
          <p className="yr-fine">
            성장 정보는 의학적 진단이 아닙니다. <Link href="/trust">건강 정보를 다루는 방식 보기</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
