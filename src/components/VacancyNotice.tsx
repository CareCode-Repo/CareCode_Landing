import { ReactNode } from 'react'

/**
 * 실제로 발송되는 빈자리 알림.
 *
 * 마케팅 문구로 바꿔 쓰지 않고 서비스가 보내는 문장을 그대로 둔다. 특히 마지막 한 줄 —
 * 공공데이터가 시설 전체 정원만 주므로 어느 반인지 알 수 없다는 고지 — 이 이 제품의 성격이다.
 */
export default function VacancyNotice(): ReactNode {
  return (
    <figure className="max-w-xl">
      <div
        className="border p-6"
        style={{
          borderColor: 'var(--rule)',
          backgroundColor: 'var(--paper)',
          boxShadow: '3px 3px 0 var(--paper-deep)',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="label">시설 알림</span>
          <span className="figure text-[0.6875rem]" style={{ color: 'var(--past)' }}>
            09:30
          </span>
        </div>

        <p className="display mt-4 text-[1.25rem]">행복어린이집에 자리가 났습니다</p>

        <p className="mt-3 text-[0.95rem] leading-[1.85]">
          대기 등록해 두신 행복어린이집의 빈자리가 <span className="figure">2자리</span> 늘어
          현재 <span className="figure">3자리</span>입니다.
          <span className="figure text-[0.85rem]" style={{ color: 'var(--ink-soft)' }}>
            {' '}
            (2026-08-06 관측 기준)
          </span>
        </p>

        <p
          className="mt-4 border-t pt-4 text-[0.875rem] leading-[1.8]"
          style={{ borderColor: 'var(--rule)', color: 'var(--stamp)' }}
        >
          시설 전체 기준이라 해당 반에 자리가 있는지는 시설에 확인해 보세요.
        </p>
      </div>

      <figcaption
        className="mt-4 text-[0.8125rem] leading-relaxed"
        style={{ color: 'var(--ink-soft)' }}
      >
        실제로 발송되는 문구입니다. 마지막 줄이 없으면 부모가 헛걸음합니다.
      </figcaption>
    </figure>
  )
}
