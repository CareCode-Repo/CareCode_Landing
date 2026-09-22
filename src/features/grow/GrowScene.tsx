'use client'

/*
 * 스크롤 = 아이의 개월 수.
 *
 * 이 컴포넌트가 하는 일은 셋뿐이다.
 *   1) 스크롤 위치를 개월 수로 바꿔 동네 장면에 넘긴다
 *   2) 개월 레일의 눈금·현재 개월 수를 맞춘다
 *   3) 동네가 가려지는 구간에서는 렌더 루프를 세운다
 *
 * 개월 수는 문서 진행도를 그대로 쓰지 않는다. 각 구간([data-month])이 화면 가운데에 온 순간의
 * 스크롤 위치를 닻으로 삼아 그 사이를 잇는다 — 그래야 도장에 찍힌 "18개월"을 읽는 순간 장면도
 * 정확히 18개월이다. 구간 길이가 제각각이라 진행도를 선형으로 나누면 도장과 장면이 어긋난다.
 *
 * 전부 명령형으로 둔다. 스크롤은 초당 60회 도는 경로라 여기에 React 상태를 얹으면
 * 프레임마다 리렌더가 돈다. React 가 소유하는 것은 "레일이 어떤 DOM 인가"까지다.
 */

import { ReactNode, useEffect, useRef } from 'react'
import type { TownHandle } from '../town/types'
import { STAGES, monthLabel } from './stages'

type Anchor = { el: HTMLElement; tick?: HTMLElement; month: number; y: number }

export default function GrowScene(): ReactNode {
  const skyRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const nowRef = useRef<HTMLSpanElement>(null)
  const ticksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const html = document.documentElement
    const sky = skyRef.current
    const scrim = scrimRef.current
    const rail = railRef.current
    const railNow = nowRef.current
    const ticksHost = ticksRef.current
    if (!sky || !rail || !railNow || !ticksHost) return

    let town: TownHandle | null = null
    let disposed = false
    let ticking = false
    let skyVisible = true
    let shownLabel = ''

    const tickEls = Array.from(ticksHost.querySelectorAll<HTMLElement>('.yr-rail__tick'))
    const anchors: Anchor[] = Array.from(document.querySelectorAll<HTMLElement>('[data-month]')).map(
      (el, i) => ({ el, tick: tickEls[i], month: Number(el.dataset.month ?? 0), y: 0 }),
    )

    if (process.env.NODE_ENV !== 'production' && anchors.length !== tickEls.length) {
      console.warn(
        `[맘편한] 구간 ${anchors.length}개와 레일 눈금 ${tickEls.length}개가 다릅니다. ` +
          'src/features/grow/stages.ts 와 홈의 [data-month] 구간을 맞추세요.',
      )
    }

    /* ── 닻 — 구간 머리가 화면 가운데에 오는 스크롤 위치 ───────────── */
    const isNarrow = () => window.matchMedia('(max-width: 900px)').matches

    function measure() {
      const docH = Math.max(1, html.scrollHeight - window.innerHeight)
      const narrow = isNarrow()
      for (const a of anchors) {
        const top = a.el.getBoundingClientRect().top + window.scrollY
        a.y = Math.max(0, top - window.innerHeight * 0.5)
        if (!a.tick) continue
        const pct = `${(Math.min(1, a.y / docH) * 100).toFixed(2)}%`
        a.tick.style.left = narrow ? pct : ''
        a.tick.style.top = narrow ? '' : pct
      }
    }

    function monthAt(y: number): number {
      if (anchors.length === 0) return 0
      if (y <= anchors[0].y) return anchors[0].month
      for (let i = 0; i < anchors.length - 1; i++) {
        const a = anchors[i]
        const b = anchors[i + 1]
        if (y <= b.y) {
          const span = b.y - a.y
          return span > 0 ? a.month + ((y - a.y) / span) * (b.month - a.month) : b.month
        }
      }
      return anchors[anchors.length - 1].month
    }

    /* ── 매 프레임 ─────────────────────────────────────────── */
    function update() {
      ticking = false
      const docH = Math.max(1, html.scrollHeight - window.innerHeight)
      const y = window.scrollY
      const month = monthAt(y)

      rail!.style.setProperty('--rd', Math.min(1, y / docH).toFixed(4))
      town?.setMonth(month)

      const label = monthLabel(Math.round(month))
      if (label !== shownLabel) {
        railNow!.textContent = label
        shownLabel = label
      }
      for (const a of anchors) if (a.tick) a.tick.dataset.on = y >= a.y - 1 ? '1' : '0'
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    function onResize() {
      measure()
      onScroll()
    }

    /* ── 동네가 보이는 구간 ────────────────────────────────── */
    const seen = new Set<Element>()
    const openObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target)
          else seen.delete(e.target)
        }
        const visible = seen.size > 0
        if (visible === skyVisible) return
        skyVisible = visible
        const op = visible ? '1' : '0'
        sky!.style.setProperty('--sky-op', op)
        scrim?.style.setProperty('--sky-op', op)
        town?.setVisible(visible)
      },
      { rootMargin: '12% 0px' },
    )
    document.querySelectorAll('[data-open]').forEach((s) => openObserver.observe(s))

    /* ── 등장 — 한 가지 방식만 ─────────────────────────────── */
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-in')
          obs.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    document.querySelectorAll<HTMLElement>('[data-in]').forEach((el) => {
      /* 형제끼리만 조금씩 늦춘다 — 전역 순번으로 늦추면 아래쪽이 영영 안 뜬다 */
      const nth = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0
      el.style.setProperty('--d', `${Math.min(nth, 6) * 55}ms`)
      revealObserver.observe(el)
    })

    /* ── 동네 장면 — 동적 import ────────────────────────────
       쓰지 않을 것이 확실하면 아예 받지 않는다. three.js 청크를 받아 파싱한 뒤에
       확인하면, 동작 줄이기를 켠 사용자에게는 통째로 버리는 다운로드가 된다. */
    const wantsMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canWebGL2 = (() => {
      try {
        return !!(window.WebGL2RenderingContext && document.createElement('canvas').getContext('webgl2'))
      } catch {
        return false
      }
    })()

    const showFallback = (reason: string) => {
      const fb = sky.querySelector<HTMLElement>('[data-fallback]')
      if (fb) fb.hidden = false
      sky.setAttribute('data-fallback-reason', reason)
    }

    if (!wantsMotion || !canWebGL2) {
      showFallback(wantsMotion ? 'no-webgl2' : 'reduced-motion')
      if (process.env.NODE_ENV !== 'production') {
        console.info(
          '[맘편한] 3D 동네를 건너뛰고 정적 배경을 씁니다 — ' +
            (wantsMotion
              ? '이 브라우저에서 WebGL2 를 쓸 수 없습니다. chrome://gpu 를 확인하세요.'
              : '브라우저가 prefers-reduced-motion: reduce 를 보고합니다. ' +
                'Windows: 설정 > 접근성 > 시각 효과 > 애니메이션 효과 / macOS: 손쉬운 사용 > 디스플레이 > 동작 줄이기'),
        )
      }
    } else {
      ;(async () => {
        try {
          const mod = await import('../town/town-scene')
          if (disposed) return
          town = mod.mount(sky)
          town.setVisible(skyVisible)
          /* 프레이밍을 다시 잡을 때 콘솔에서 carecodeTown.probe() 로 건물의 화면 좌표를 잰다.
             값을 짐작으로 넣지 않기 위한 손잡이다. */
          ;(window as unknown as { carecodeTown?: TownHandle }).carecodeTown = town
          update()
        } catch (err) {
          showFallback('load-failed')
          console.warn('동네 장면을 불러오지 못했습니다 — 정적 배경으로 대체합니다.', err)
        }
      })()
    }

    measure()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', onResize)
    /* 폰트·이미지가 늦게 붙으면 구간 높이가 바뀐다. 닻을 다시 잰다 */
    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)

    return () => {
      disposed = true
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
      ro.disconnect()
      openObserver.disconnect()
      revealObserver.disconnect()
      town?.dispose()
      town = null
    }
  }, [])

  return (
    <>
      {/* 여섯 해가 지나가는 동네. 글자는 전부 DOM 이라 SEO·스크린리더 손실이 없다. */}
      <div className="yr-sky" aria-hidden="true" ref={skyRef}>
        <div className="yr-sky__fallback" data-fallback="" hidden />
      </div>
      <div className="yr-scrim" aria-hidden="true" ref={scrimRef} />

      {/* 개월 레일 — 시간 순서가 정보 자체라서 개월 표기가 장식이 아니다 */}
      <div className="yr-rail" aria-hidden="true" ref={railRef}>
        <span className="yr-rail__cap">출생</span>
        <span className="yr-rail__now" ref={nowRef}>
          {monthLabel(0)}
        </span>
        <div className="yr-rail__track">
          <div className="yr-rail__fill" />
          <div className="yr-rail__ticks" ref={ticksRef}>
            {STAGES.map((s) => (
              <i className="yr-rail__tick" data-on="0" key={s.id} />
            ))}
          </div>
        </div>
        <span className="yr-rail__cap">취학 전</span>
      </div>
    </>
  )
}
