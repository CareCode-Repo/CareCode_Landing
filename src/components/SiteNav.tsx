'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useState } from 'react'
import Logo from '@/components/Logo'

/** 순서가 아니라 분류라서 번호를 붙이지 않는다. */
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
        borderColor: 'var(--line)',
        backgroundColor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-3.5 md:px-8">
        <Link href="/" aria-label="맘편한 홈">
          <Logo />
        </Link>

        <nav aria-label="사이트 메뉴" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {TABS.map((tab) => (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={isActive(tab.href) ? 'page' : undefined}
                  className="block rounded-full px-4 py-2 text-[0.9375rem] transition-colors hover:bg-[var(--surface)]"
                  style={
                    isActive(tab.href)
                      ? { color: 'var(--brand-deep)', backgroundColor: 'var(--brand-tint)', fontWeight: 600 }
                      : { color: 'var(--fg-soft)' }
                  }
                >
                  {tab.label}
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
          style={{ color: 'var(--fg-soft)' }}
        >
          <span className="label">{open ? '닫기' : '메뉴'}</span>
        </button>
      </div>

      {open && (
        <nav
          id="site-menu"
          aria-label="사이트 메뉴"
          className="border-t md:hidden"
          style={{ borderColor: 'var(--line)' }}
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
                    borderColor: 'var(--line)',
                    color: isActive(tab.href) ? 'var(--brand-deep)' : 'var(--fg-soft)',
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
