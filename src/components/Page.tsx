import { ReactNode } from 'react'

/** 본문 폭. 표와 타임라인이 들어가야 해서 읽기 폭보다 넓게 잡는다. */
export function Shell({ children }: { children: ReactNode }): ReactNode {
  return <div className="mx-auto max-w-[1180px] px-5 md:px-8">{children}</div>
}

/**
 * 페이지 머리. eyebrow 는 장식이 아니라 이 페이지가 서비스의 어느 기능인지 알려 준다 —
 * 앱의 탭 이름과 같은 말을 배지로 단다.
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
    <header className="pt-14 pb-12 md:pt-20 md:pb-16" style={{ backgroundColor: 'var(--surface)' }}>
      <Shell>
        <p className="badge" style={{ color: 'var(--brand-deep)' }}>
          {eyebrow}
        </p>
        <h1 className="display mt-5 max-w-3xl text-[2rem] md:text-[2.75rem]">{title}</h1>
        <p className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.8]" style={{ color: 'var(--fg-soft)' }}>
          {lead}
        </p>
      </Shell>
    </header>
  )
}

/** 구획. 좌측에 라벨, 우측에 내용. */
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
    <section className="border-b py-14 md:py-20" style={{ borderColor: 'var(--line)' }}>
      <Shell>
        <div className="grid gap-6 md:grid-cols-[168px_1fr] md:gap-12">
          <div>
            <p className="label md:sticky md:top-24" style={{ color: 'var(--brand-deep)' }}>
              {label}
            </p>
          </div>
          {/* min-w-0 이 없으면 안쪽 표의 min-width 만큼 칸이 벌어져 페이지가 가로로 넘친다. */}
          <div className="min-w-0">
            {title && <h2 className="display mb-7 text-[1.5rem] md:text-[1.875rem]">{title}</h2>}
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
    <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--surface)' }}>
      <p className="figure text-[1.75rem] leading-none" style={{ color: muted ? 'var(--muted)' : 'var(--fg)' }}>
        {value}
        {unit && (
          <span className="ml-1 text-[0.9rem] font-medium" style={{ color: 'var(--fg-soft)' }}>
            {unit}
          </span>
        )}
      </p>
      <p className="mt-3 text-[0.9375rem] font-semibold" style={{ color: 'var(--fg)' }}>
        {label}
      </p>
      {note && (
        <p className="mt-1 text-[0.8125rem] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
          {note}
        </p>
      )}
    </div>
  )
}
