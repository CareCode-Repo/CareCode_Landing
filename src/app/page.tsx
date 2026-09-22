import { ReactNode } from 'react'
import GrowScene from '@/features/grow/GrowScene'
import { Close } from '@/features/stations/Close'
import { Hero } from '@/features/stations/Hero'
import { Month01 } from '@/features/stations/Month01'
import { Month06 } from '@/features/stations/Month06'
import { Month12 } from '@/features/stations/Month12'
import { Month18 } from '@/features/stations/Month18'
import { Month24 } from '@/features/stations/Month24'
import '@/styles/grow.css'

/*
 * 여섯 해 — 출생에서 72개월까지.
 *
 * 이 파일은 구성만 한다. 각 구간이 자기 카피를 소유하고, 거의 전부 서버 컴포넌트라 본문에는
 * 자바스크립트가 실리지 않는다. 클라이언트로 내려가는 것은 스크롤 엔진(GrowScene)과
 * 월령 타임라인(MonthTimeline) 둘뿐이다.
 *
 * 구간의 순서·개수는 src/features/grow/stages.ts 와 같아야 한다 — 레일 눈금이 그 목록에서 나온다.
 */
export default function Home(): ReactNode {
  return (
    <>
      <GrowScene />
      <Hero />
      <Month01 />
      <Month06 />
      <Month12 />
      <Month18 />
      <Month24 />
      <Close />
    </>
  )
}
