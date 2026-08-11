'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useState } from 'react'

/** 수첩의 탭. 순서가 아니라 분류라서 번호를 붙이지 않는다. */
const TABS = [
  { href: '/', label: '개요' },
  { href: '/benefits', label: '지원금' },
  { href: '/facilities', label: '어린이집' },
  { href: '/data', label: '데이터' },
  { href: '/trust', label: '개인정보' },
] as const

export default function IntroNav(): ReactNode {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        borderColor: 'var(--rule)',
        backgroundColor: 'rgba(246,248,243,0.92)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-3.5 md:px-8">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="display text-[1.35rem]" style={{ color: 'var(--ink)' }}>
            맘편한
          </span>
          <span className="label hidden sm:inline">CARECODE</span>
        </Link>

        <nav aria-label="사이트 메뉴" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {TABS.map((tab) => (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={isActive(tab.href) ? 'page' : undefined}
                  className="relative block px-3.5 py-2 text-[0.9rem] transition-colors"
                  style={{ color: isActive(tab.href) ? 'var(--ink)' : 'var(--ink-soft)' }}
                >
                  {tab.label}
                  {isActive(tab.href) && (
                    <span
                      className="absolute inset-x-3 -bottom-[1px] h-[2px]"
                      style={{ backgroundColor: 'var(--seal)' }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="md:hidden"
          style={{ color: 'var(--ink-soft)' }}
        >
          <span className="label">{open ? '닫기' : '메뉴'}</span>
        </button>
      </div>

      {open && (
        <nav
          id="site-menu"
          aria-label="사이트 메뉴"
          className="border-t md:hidden"
          style={{ borderColor: 'var(--rule)' }}
        >
          <ul className="mx-auto max-w-[1180px] px-5 py-2">
            {TABS.map((tab) => (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(tab.href) ? 'page' : undefined}
                  className="block border-b py-3 text-[0.95rem] last:border-b-0"
                  style={{
                    borderColor: 'var(--rule)',
                    color: isActive(tab.href) ? 'var(--seal-deep)' : 'var(--ink-soft)',
                  }}
                >
                  {tab.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
