import { ReactNode } from 'react'

/** 본문 폭. 표와 타임라인이 들어가야 해서 읽기 폭보다 넓게 잡는다. */
export function Shell({ children }: { children: ReactNode }): ReactNode {
  return <div className="mx-auto max-w-[1180px] px-5 md:px-8">{children}</div>
}

/**
 * 페이지 머리. 수첩의 속표지에 해당한다.
 *
 * eyebrow 는 장식이 아니라 이 페이지가 수첩의 어느 항목인지 알려 준다.
 */
export function PageHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string
  title: ReactNode
  lead: ReactNode
}): ReactNode {
  return (
    <header
      className="border-b pt-14 pb-12 md:pt-20 md:pb-16"
      style={{ borderColor: 'var(--rule)' }}
    >
      <Shell>
        <p className="label">{eyebrow}</p>
        <h1 className="display mt-5 max-w-3xl text-[2.25rem] md:text-[3.25rem]">{title}</h1>
        <p
          className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.8]"
          style={{ color: 'var(--ink-soft)' }}
        >
          {lead}
        </p>
      </Shell>
    </header>
  )
}

/** 구획. 좌측에 라벨, 우측에 내용 — 기록부의 항목 배치. */
export function Section({
  label,
  title,
  children,
}: {
  label: string
  title?: ReactNode
  children: ReactNode
}): ReactNode {
  return (
    <section className="border-b py-14 md:py-20" style={{ borderColor: 'var(--rule)' }}>
      <Shell>
        <div className="grid gap-8 md:grid-cols-[168px_1fr] md:gap-12">
          <div>
            <p className="label md:sticky md:top-24">{label}</p>
          </div>
          {/* min-w-0 이 없으면 안쪽 표의 min-width 만큼 칸이 벌어져 페이지가 가로로 넘친다. */}
          <div className="min-w-0">
            {title && <h2 className="display mb-7 text-[1.5rem] md:text-[2rem]">{title}</h2>}
            {children}
          </div>
        </div>
      </Shell>
    </section>
  )
}

/** 수치 한 칸. 라벨은 작게, 값은 크게, 단위는 값에 붙여 읽는다. */
export function Figure({
  value,
  unit,
  label,
  note,
  muted = false,
}: {
  value: string
  unit?: string
  label: string
  note?: string
  muted?: boolean
}): ReactNode {
  return (
    <div className="border-t pt-4" style={{ borderColor: 'var(--rule)' }}>
      <p
        className="figure text-[1.75rem] leading-none"
        style={{ color: muted ? 'var(--past)' : 'var(--ink)' }}
      >
        {value}
        {unit && (
          <span className="ml-1 text-[0.9rem]" style={{ color: 'var(--ink-soft)' }}>
            {unit}
          </span>
        )}
      </p>
      <p className="mt-2.5 text-[0.9rem]" style={{ color: 'var(--ink)' }}>
        {label}
      </p>
      {note && (
        <p className="mt-1 text-[0.8125rem] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {note}
        </p>
      )}
    </div>
  )
}
