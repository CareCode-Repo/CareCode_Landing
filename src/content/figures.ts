/**
 * 이 사이트가 보여 주는 수치를 한 곳에 모은다.
 *
 * 백엔드는 매주 공공데이터를 새로 받아 오므로 여기 적힌 값은 시간이 지나면 반드시 낡는다.
 * 페이지마다 흩어져 있으면 낡은 걸 아무도 모른 채 지나간다.
 *
 * 이 사이트는 "근거 없는 숫자는 쓰지 않는다" 를 내세운다. 그러면서 정작 소개 페이지의 숫자가
 * 언제 기준인지 밝히지 않으면 그 주장 자체가 무너진다. 그래서 값과 기준일을 함께 둔다.
 *
 * 갱신하려면: CareCode_Interface 에서 `./gradlew liveSyncCheck` 로 실측한 뒤
 * 이 파일의 값과 MEASURED_ON 을 함께 고친다.
 */

/** 수집량을 실제로 측정한 날. 값만 고치고 이 날짜를 안 고치면 거짓말이 된다. */
export const MEASURED_ON = '2026-08-06'

/** 사람이 읽는 표기. "2026-08-06 기준" 처럼 쓴다. */
export const MEASURED_LABEL = `${MEASURED_ON} 기준`

export type Source = {
  /** 데이터를 제공하는 기관 */
  name: string
  /** 무엇을 받아 오는가 */
  gets: string
  /** 수집한 개수 */
  count: number
  /** 개수의 단위 */
  unit: '곳' | '건'
  /** 응답 형식 */
  format: 'XML' | 'JSON'
}

export const SOURCES: Source[] = [
  { name: '보육통합정보시스템', gets: '어린이집', count: 8_331, unit: '곳', format: 'XML' },
  { name: '유치원알리미', gets: '유치원', count: 7_052, unit: '곳', format: 'JSON' },
  { name: '건강보험심사평가원', gets: '소아청소년과', count: 4_292, unit: '곳', format: 'XML' },
  { name: '보조금24', gets: '정부지원 서비스', count: 60, unit: '건', format: 'JSON' },
]

export const formatCount = (n: number): string => n.toLocaleString('ko-KR')

/** 데이터를 새로 받아 오는 주기. */
export const SYNC_SCHEDULE: ReadonlyArray<{ what: string; when: string }> = [
  { what: '어린이집 · 유치원', when: '주 1회' },
  { what: '소아청소년과', when: '주 1회' },
  { what: '정부지원 서비스', when: '매일' },
  { what: '주소 좌표 보정', when: '매일' },
]

export type BenefitBand = {
  name: string
  /** 대상 연령 하한(개월) */
  from: number
  /** 대상 연령 상한(개월) */
  to: number
  /** 월 지급액(원). 공공데이터가 숫자를 주지 않는 정책은 null. */
  monthly: number | null
  /** 대상 기간이 지난 뒤에도 소급 신청이 가능한 개월 수 */
  retroactive: number
}

/**
 * 월령 타임라인에 그리는 정책.
 *
 * 전국 공통 정책만 넣는다. 지자체 정책은 사는 곳마다 달라 예시로 그릴 수 없다.
 * 첫만남이용권은 바우처라 월 지급액이 없어 미상으로 둔다.
 */
export const BENEFIT_BANDS: BenefitBand[] = [
  { name: '부모급여', from: 0, to: 23, monthly: 700_000, retroactive: 6 },
  { name: '아동수당', from: 0, to: 95, monthly: 100_000, retroactive: 0 },
  { name: '양육수당', from: 24, to: 86, monthly: 100_000, retroactive: 6 },
  { name: '첫만남이용권', from: 0, to: 11, monthly: null, retroactive: 12 },
  { name: '보육료 지원', from: 0, to: 71, monthly: 280_000, retroactive: 0 },
]

/** 타임라인 축의 오른쪽 끝(개월). 취학 전까지를 담는다. */
export const AXIS_MAX_MONTHS = 72
