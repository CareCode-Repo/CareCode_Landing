import { ReactNode } from 'react'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * 실제로 발송되는 빈자리 알림. 휴대폰 잠금 화면에 뜨는 푸시 알림 모양으로 보여 준다.
 *
 * 마케팅 문구로 바꿔 쓰지 않고 서비스가 보내는 문장을 그대로 둔다. 특히 마지막 한 줄 —
 * 공공데이터가 시설 전체 정원만 주므로 어느 반인지 알 수 없다는 고지 — 이 이 제품의 성격이다.
 */
export default function VacancyNotice(): ReactNode {
  return (
    <figure className="max-w-xl">
      <div
        className="rounded-[20px] p-5"
        style={{ backgroundColor: 'var(--bg)', boxShadow: 'var(--shadow)', border: '1px solid var(--line)' }}
      >
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- 정적 출력이라 next/image 최적화를 쓸 수 없다 */}
          <img src={`${BASE_PATH}/icon.svg`} alt="" width={22} height={22} className="rounded-[6px]" />
          <span className="text-[0.8125rem] font-semibold" style={{ color: 'var(--fg-soft)' }}>
            맘편한 · 시설 알림
          </span>
          <span className="ml-auto text-[0.75rem]" style={{ color: 'var(--muted)' }}>
            09:30
          </span>
        </div>

        <p className="mt-3 text-[1.0625rem] font-bold">행복어린이집에 자리가 났습니다</p>

        <p className="mt-1.5 text-[0.9375rem] leading-[1.7]" style={{ color: 'var(--fg-soft)' }}>
          대기 등록해 두신 행복어린이집의 빈자리가 <span className="figure" style={{ color: 'var(--fg)' }}>2자리</span>{' '}
          늘어 현재 <span className="figure" style={{ color: 'var(--fg)' }}>3자리</span>입니다. (2026-08-06 관측 기준)
        </p>

        <p
          className="mt-3 rounded-xl px-3.5 py-2.5 text-[0.875rem] leading-[1.7]"
          style={{ backgroundColor: 'color-mix(in srgb, var(--alert) 9%, transparent)', color: 'var(--alert-deep)' }}
        >
          시설 전체 기준이라 해당 반에 자리가 있는지는 시설에 확인해 보세요.
        </p>
      </div>

      <figcaption className="mt-3 text-[0.8125rem] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
        실제로 발송되는 문구입니다. 마지막 줄이 없으면 부모가 헛걸음합니다.
      </figcaption>
    </figure>
  )
}
