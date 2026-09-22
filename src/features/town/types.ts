/**
 * 동네 장면이 바깥에 노출하는 손잡이.
 *
 * 스크롤 엔진은 이 타입만 알면 된다. three.js 를 직접 import 하지 않으므로
 * 장면 모듈이 지연 로드 청크로 따로 떨어진다.
 */
export type TownHandle = {
  /** 아이의 개월 수 0~72. 계절·성장·카메라가 이 값 하나로 정해진다. */
  setMonth(m: number): void
  /** 장면이 가려지는 구간에서 렌더 루프를 세운다 */
  setVisible(v: boolean): void
  /** 프레이밍 측정용 — 주요 건물의 화면 좌표(%) */
  probe(): Record<string, [number, number]>
  /** 성능 측정용 — 실제 GPU 에서만 의미 있는 값들 */
  stats(): {
    fps: number
    jsMs: number
    drawCalls: number
    triangles: number
    geometries: number
    textures: number
    tier: string
    pixelRatio: number
  }
  dispose(): void
}
