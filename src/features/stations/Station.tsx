import { ReactNode } from 'react'
import { monthLabel } from '@/features/grow/stages'

/**
 * 구간 하나. 스크롤 엔진(GrowScene)은 data-month 로 개월 수의 닻을, data-open 으로
 * "이 구간에서는 뒤의 동네가 보인다"를 읽는다.
 *
 * open 구간은 지면을 비우고 글을 카드(yr-panel) 위에 올린다. 풍경 위에 글을 바로
 * 얹으면 계절마다 바탕색이 바뀌어 대비가 보장되지 않는다.
 */
export function Station({
  id,
  month,
  open = false,
  children,
}: {
  id: string
  month: number
  open?: boolean
  children: ReactNode
}): ReactNode {
  return (
    <section
      id={id}
      data-month={month}
      data-open={open ? '' : undefined}
      className={open ? 'yr-station yr-station--open' : 'yr-station'}
      aria-labelledby={`${id}-title`}
    >
      <div className="yr-shell">{children}</div>
    </section>
  )
}

/** 구간 머리. 개월 배지 · 제목 · 본문. 제목이 스스로 서도록 눈썹은 두지 않는다. */
export function StationHead({
  id,
  month,
  title,
  children,
}: {
  id: string
  month: number
  title: ReactNode
  children: ReactNode
}): ReactNode {
  return (
    <div className="yr-head">
      <div data-in="">
        <p className="badge yr-month">{monthLabel(month)}</p>
        <h2 id={`${id}-title`} className="display yr-h2">
          {title}
        </h2>
      </div>
      <div className="yr-body" data-in="">
        {children}
      </div>
    </div>
  )
}
