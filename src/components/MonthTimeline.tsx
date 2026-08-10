'use client'

import { ReactNode, useMemo, useState } from 'react'

/**
 * 월령 타임라인.
 *
 * 이 서비스의 핵심 발견은 "받을 수 있었는데 몰라서 못 받은 돈" 이다. 그걸 설명하는 대신
 * 축 위에서 보여 준다. 표시를 끌면 지나간 지원금이 회색으로 남는다.
 *
 * 밴드 구성은 실제 정책 데이터 모델(targetAgeMin/Max, benefitAmount, retroactiveMonths)을
 * 그대로 따른다. 금액을 모르는 정책이 실재하므로 '미상' 도 한 줄 넣었다.
 */

const AXIS_MAX = 72

type Band = {
  name: string
  from: number
  to: number
  /** 월 지급액(원). 공공데이터가 숫자를 주지 않는 정책은 null. */
  monthly: number | null
  /** 대상 기간이 지난 뒤에도 소급 신청이 가능한 개월 수. */
  retroactive: number
}

const BANDS: Band[] = [
  { name: '부모급여', from: 0, to: 23, monthly: 700_000, retroactive: 6 },
  { name: '아동수당', from: 0, to: 95, monthly: 100_000, retroactive: 0 },
  { name: '양육수당', from: 24, to: 86, monthly: 100_000, retroactive: 6 },
  { name: '첫만남이용권', from: 0, to: 11, monthly: null, retroactive: 12 },
  { name: '보육료 지원', from: 0, to: 71, monthly: 280_000, retroactive: 0 },
]

const won = (n: number): string => n.toLocaleString('ko-KR')

export default function MonthTimeline(): ReactNode {
  const [months, setMonths] = useState(27)

  const rows = useMemo(
    () =>
      BANDS.map((band) => {
        const active = months >= band.from && months <= band.to
        const passed = months > band.to
        const claimable = passed && months - band.to <= band.retroactive
        return { ...band, active, passed, claimable }
      }),
    [months],
  )

  const activeCount = rows.filter((r) => r.active).length
  const claimableCount = rows.filter((r) => r.claimable).length
  const expiredCount = rows.filter((r) => r.passed && !r.claimable).length

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <label htmlFor="months" className="label">
            아이 개월 수
          </label>
          <p className="figure mt-2 text-[2.5rem] leading-none md:text-[3.25rem]">
            {months}
            <span className="ml-1.5 text-[1rem]" style={{ color: 'var(--ink-soft)' }}>
              개월
            </span>
          </p>
        </div>
        <p className="text-[0.8125rem]" style={{ color: 'var(--ink-soft)' }}>
          표시를 옮겨 보세요
        </p>
      </div>

      <input
        id="months"
        type="range"
        min={0}
        max={AXIS_MAX}
        value={months}
        onChange={(e) => setMonths(Number(e.target.value))}
        aria-valuetext={`${months}개월`}
        className="mt-5 w-full accent-[var(--seal)]"
      />

      {/* 축 눈금. 12개월 단위로 끊어 읽는다. */}
      <div className="mt-1 flex justify-between" aria-hidden="true">
        {[0, 12, 24, 36, 48, 60, 72].map((tick) => (
          <span
            key={tick}
            className="figure text-[0.6875rem]"
            style={{ color: 'var(--past)' }}
          >
            {tick}
          </span>
        ))}
      </div>

      <ul className="mt-8 space-y-px">
        {rows.map((row) => {
          const left = (Math.min(row.from, AXIS_MAX) / AXIS_MAX) * 100
          const width =
            ((Math.min(row.to, AXIS_MAX) - Math.min(row.from, AXIS_MAX) + 1) / AXIS_MAX) * 100

          const tone = row.active ? 'var(--seal)' : row.claimable ? 'var(--stamp)' : 'var(--past)'

          return (
            <li
              key={row.name}
              className="grid grid-cols-[104px_1fr] items-center gap-3 py-2.5 md:grid-cols-[132px_1fr_128px] md:gap-5"
            >
              <span
                className="truncate text-[0.875rem]"
                style={{ color: row.active ? 'var(--ink)' : 'var(--ink-soft)' }}
              >
                {row.name}
              </span>

              <div className="relative h-6" style={{ backgroundColor: 'var(--paper-deep)' }}>
                <div
                  className="absolute inset-y-0 transition-colors duration-300"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    backgroundColor: tone,
                    opacity: row.active ? 1 : 0.38,
                  }}
                />
                {/* 현재 위치 표시선 */}
                <div
                  className="absolute inset-y-[-4px] w-[2px] transition-[left] duration-150"
                  style={{
                    left: `calc(${(months / AXIS_MAX) * 100}% - 1px)`,
                    backgroundColor: 'var(--ink)',
                  }}
                />
              </div>

              <span
                className="col-span-2 text-[0.8125rem] md:col-span-1 md:text-right"
                style={{ color: tone }}
              >
                {row.active ? (
                  row.monthly === null ? (
                    <span className="unknown">금액 미상</span>
                  ) : (
                    <span className="figure">월 {won(row.monthly)}원</span>
                  )
                ) : row.claimable ? (
                  '아직 소급 신청 가능'
                ) : row.passed ? (
                  '기간이 지났습니다'
                ) : (
                  <span style={{ color: 'var(--past)' }}>아직 대상 아님</span>
                )}
              </span>
            </li>
          )
        })}
      </ul>

      <p
        className="mt-8 border-t pt-6 text-[1.0625rem] leading-[1.85]"
        style={{ borderColor: 'var(--rule)' }}
      >
        {months}개월 아이는 지금{' '}
        <strong style={{ color: 'var(--seal-deep)' }}>{activeCount}건</strong>을 받을 수 있습니다.
        {claimableCount > 0 && (
          <>
            {' '}
            <strong style={{ color: 'var(--stamp)' }}>{claimableCount}건</strong>은 기간이 지났지만
            아직 소급 신청할 수 있고,
          </>
        )}
        {expiredCount > 0 && (
          <>
            {' '}
            <span style={{ color: 'var(--past)' }}>{expiredCount}건</span>은 이미 신청 기회가
            지났습니다.
          </>
        )}
      </p>

      <p className="mt-3 text-[0.8125rem] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        전국 공통 정책 다섯 가지로만 그린 예시입니다. 실제로는 사는 지역의 지자체 정책이 더해지고,
        소득과 자녀 수에 따라 대상이 갈립니다.
      </p>
    </div>
  )
}
