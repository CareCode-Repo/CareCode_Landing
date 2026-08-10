/**
 * 빌드된 사이트를 실제 브라우저로 열어 검사한다.
 *
 * 여기서 보는 것은 전부 "손으로 확인하다 실제로 걸렸던 것" 이다.
 *
 *  - 가로 오버플로 — /data 의 표가 그리드 칸을 밀어 페이지가 옆으로 넘쳤다.
 *    (그리드 자식의 min-width: auto 때문. min-w-0 이 없으면 재발한다.)
 *  - 제목 구조·라벨 — 스크린리더로 읽히지 않는 표와 링크가 생기기 쉽다.
 *
 * 사용법:
 *   node scripts/verify-pages.mjs http://localhost:3000
 *
 * CHROME_PATH 로 브라우저를 지정할 수 있다. 없으면 puppeteer 가 받아 둔 것을 쓴다.
 */
import puppeteer from 'puppeteer'

const BASE = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')
const PATHS = ['/', '/benefits/', '/facilities/', '/data/', '/trust/']
/** 휴대폰 · 태블릿 · 데스크톱. 레이아웃이 갈리는 지점마다 본다. */
const WIDTHS = [390, 768, 1440]

const failures = []

const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

for (const width of WIDTHS) {
  for (const path of PATHS) {
    const page = await browser.newPage()
    await page.setViewport({ width, height: 900 })

    const url = BASE + path
    const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 })

    // 같은 페이지를 폭만 바꿔 여러 번 열기 때문에 두 번째부터는 304 로 온다.
    // ok() 는 304 를 실패로 보므로 상태 코드를 직접 본다.
    const status = response?.status() ?? 0
    if (status !== 200 && status !== 304) {
      failures.push(`${path} @${width} — 응답 ${status || '없음'}`)
      await page.close()
      continue
    }

    const result = await page.evaluate(() => {
      const root = document.documentElement
      const problems = []

      // 가로 스크롤이 생기면 모바일에서 본문이 잘린다.
      if (root.scrollWidth > root.clientWidth + 1) {
        const culprits = []
        for (const el of document.querySelectorAll('body *')) {
          const box = el.getBoundingClientRect()
          if (box.width > 0 && box.right > root.clientWidth + 1) {
            culprits.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)}`)
          }
        }
        problems.push(`가로 오버플로 ${root.scrollWidth}px > ${root.clientWidth}px (${culprits[0] ?? '원인 불명'})`)
      }

      return problems
    })

    result.forEach((p) => failures.push(`${path} @${width} — ${p}`))
    await page.close()
  }
}

// 접근성은 폭과 무관하므로 한 번만 본다.
for (const path of PATHS) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 60_000 })

  const problems = await page.evaluate(() => {
    const found = []

    const h1s = document.querySelectorAll('h1')
    if (h1s.length !== 1) found.push(`h1 이 ${h1s.length}개 (1개여야 함)`)

    const levels = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => Number(h.tagName[1]))
    for (let i = 1; i < levels.length; i += 1) {
      if (levels[i] - levels[i - 1] > 1) found.push(`제목 레벨 건너뜀 h${levels[i - 1]}→h${levels[i]}`)
    }

    document.querySelectorAll('a').forEach((a) => {
      if (!a.textContent.trim() && !a.getAttribute('aria-label')) found.push('이름 없는 링크')
    })
    document.querySelectorAll('button').forEach((b) => {
      if (!b.textContent.trim() && !b.getAttribute('aria-label')) found.push('이름 없는 버튼')
    })
    document.querySelectorAll('input').forEach((input) => {
      const labelled = input.id && document.querySelector(`label[for="${input.id}"]`)
      if (!labelled && !input.getAttribute('aria-label')) found.push(`라벨 없는 입력 (${input.type})`)
    })
    document.querySelectorAll('img').forEach((img) => {
      if (img.alt === null) found.push('alt 없는 이미지')
    })
    // 표는 캡션이 없으면 스크린리더가 무슨 표인지 알려 주지 못한다.
    document.querySelectorAll('table').forEach((t) => {
      if (!t.querySelector('caption')) found.push('caption 없는 표')
    })

    return found
  })

  problems.forEach((p) => failures.push(`${path} — ${p}`))
  await page.close()
}

await browser.close()

if (failures.length > 0) {
  console.error(`검증 실패 ${failures.length}건`)
  failures.forEach((f) => console.error(`  ✗ ${f}`))
  process.exit(1)
}

console.log(`검증 통과 — ${PATHS.length}개 페이지 × ${WIDTHS.length}개 폭, 접근성 포함`)
