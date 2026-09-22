/**
 * 여섯 해의 정거장. 개월 레일의 눈금 개수가 이 목록에서 나온다.
 *
 * 홈(src/app/page.tsx)의 [data-month] 구간과 순서·개수가 같아야 한다. 레일은 런타임에
 * [data-month] 를 다시 질의해 눈금과 짝을 맞추므로, 여기가 어긋나면 눈금이 남거나 모자란다.
 *
 * `open` 은 그 구간의 지면을 비워 뒤의 동네(3D)가 보이게 한다는 뜻이다.
 * 동네가 그 시기의 주인공일 때만 연다 — 전부 열면 글이 풍경에 묻힌다.
 */
export type Stage = {
  id: string
  /** 그 구간이 화면 가운데에 왔을 때 아이의 개월 수 */
  month: number
  open: boolean
}

export const STAGES: Stage[] = [
  { id: 'top', month: 0, open: true },
  { id: 'm01', month: 1, open: false },
  { id: 'm06', month: 6, open: true },
  { id: 'm12', month: 12, open: false },
  { id: 'm18', month: 18, open: true },
  { id: 'm24', month: 24, open: false },
  { id: 'm36', month: 36, open: false },
  { id: 'm48', month: 48, open: false },
  { id: 'm60', month: 60, open: false },
  { id: 'm72', month: 72, open: true },
]

/** 레일과 도장에 쓰는 표기. 레일 위아래 끝에 '출생' · '취학 전'이 이미 적혀 있어 0도 숫자로 쓴다. */
export const monthLabel = (m: number): string => `${Math.max(0, m)}개월`
