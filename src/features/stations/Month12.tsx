import { ReactNode } from 'react'
import MonthTimeline from '@/components/MonthTimeline'
import { Station, StationHead } from './Station'

/*
 * 12개월 — 첫 돌. 첫만남이용권의 대상 기간(0–11개월)이 여기서 끝난다.
 * 이 페이지에서 유일하게 상태가 있는 자리(월령 타임라인)를 여기에 둔다.
 * 스크롤이 개월 수를 정하는 페이지에서, 여기서만은 부모가 직접 개월 수를 옮긴다.
 */
export function Month12(): ReactNode {
  return (
    <Station id="m12" month={12}>
      <StationHead
        id="m12"
        month={12}
        title={
          <>
            기간이 지나면
            <br />
            조용히 사라집니다
          </>
        }
      >
        <p>
          첫 돌이 지나면 첫만남이용권의 대상 기간이 끝납니다. 아무도 알려 주지 않습니다. 맘편한은
          아이가 지나온 개월 구간을 거슬러 올라가 대상이었던 지원금을 찾고,{' '}
          <strong>소급 신청이 아직 가능한 것</strong>과 이미 지난 것을 나눠 보여 드립니다.
        </p>
        <p>
          조건에 맞는 지원금은 신청 기한이 일주일 남았을 때, 그리고 하루 남았을 때 알립니다. 놓친
          뒤에 알려 주는 것보다 놓치기 전에 막는 편이 낫습니다.
        </p>
      </StationHead>

      <div className="yr-play" data-in="">
        <MonthTimeline />
      </div>
    </Station>
  )
}
