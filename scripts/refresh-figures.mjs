/**
 * 백엔드 공개 통계에서 수집량을 받아 figures.ts 를 갱신한다.
 *
 * 이 사이트는 "근거 없는 숫자는 쓰지 않는다" 를 내세운다. 그래서 값을 바꿀 때 기준일도 같이
 * 바꿔야 하고, 넷 중 하나라도 못 받으면 **아무것도 바꾸지 않는다.** 일부만 갱신하고 날짜를
 * 새로 찍으면 낡은 값에 새 날짜가 붙어 거짓말이 된다.
 *
 * 사용법:
 *   STATS_API_BASE=https://api.example.com node scripts/refresh-figures.mjs
 *
 * 종료 코드
 *   0  갱신함 (또는 변경 없음)
 *   1  실패 — 파일은 손대지 않았다
 *   2  STATS_API_BASE 가 없어 건너뜀
 */
import { readFile, writeFile } from 'node:fs/promises'

const BASE = (process.env.STATS_API_BASE ?? '').replace(/\/$/, '')
const FILE = new URL('../src/content/figures.ts', import.meta.url)

if (!BASE) {
  console.log('STATS_API_BASE 가 없어 건너뜁니다. 백엔드가 공개된 뒤 설정하세요.')
  process.exit(2)
}

/** 응답이 이상하면 조용히 0 을 쓰지 않고 실패한다. */
const getJson = async (path) => {
  const res = await fetch(`${BASE}${path}`, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`)
  return res.json()
}

const positive = (value, label) => {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${label} 값이 이상합니다: ${JSON.stringify(value)}`)
  return Math.round(n)
}

/** 시설 통계의 typeDistribution 키는 FacilityType enum 이름이다. */
const pickFacility = (distribution, keys, label) => {
  for (const key of keys) {
    if (distribution?.[key] != null) return positive(distribution[key], label)
  }
  throw new Error(`${label} 을(를) typeDistribution 에서 찾지 못했습니다: ${Object.keys(distribution ?? {}).join(', ')}`)
}

let counts
try {
  const [facilities, policies, hospitals] = await Promise.all([
    getJson('/facilities/statistics'),
    getJson('/policies/statistics'),
    getJson('/health/hospitals/statistics'),
  ])

  const dist = facilities.typeDistribution
  counts = {
    어린이집: pickFacility(dist, ['DAYCARE', 'CHILDCARE', '어린이집'], '어린이집'),
    유치원: pickFacility(dist, ['KINDERGARTEN', '유치원'], '유치원'),
    소아청소년과: positive(hospitals.byType?.['소아청소년과'] ?? hospitals.total, '소아청소년과'),
    '정부지원 서비스': positive(policies.totalPolicies, '정부지원 서비스'),
  }
} catch (error) {
  console.error(`수치를 받지 못했습니다: ${error.message}`)
  console.error('낡은 값에 새 날짜를 붙이지 않도록 파일을 고치지 않았습니다.')
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)
let source = await readFile(FILE, 'utf8')
const before = source

for (const [gets, count] of Object.entries(counts)) {
  const pattern = new RegExp(`(gets: '${gets}', count: )[\\d_]+`)
  if (!pattern.test(source)) {
    console.error(`figures.ts 에서 ${gets} 항목을 찾지 못했습니다. 구조가 바뀐 것 같습니다.`)
    process.exit(1)
  }
  source = source.replace(pattern, `$1${count.toLocaleString('en-US').replace(/,/g, '_')}`)
}

source = source.replace(/(export const MEASURED_ON = ')[\d-]+(')/, `$1${today}$2`)

if (source === before) {
  console.log('수치와 기준일 모두 그대로입니다.')
  process.exit(0)
}

await writeFile(FILE, source)
console.log(`갱신 (${today})`)
Object.entries(counts).forEach(([k, v]) => console.log(`  ${k}: ${v.toLocaleString('ko-KR')}`))
