import Link from 'next/link'
import { ReactNode } from 'react'
import { KNOWN_UNKNOWN } from '@/content/facts'
import { Station, StationHead } from './Station'

/*
 * 36개월 — 어린이집에서 유치원을 알아보기 시작하는 무렵.
 * 못 하는 것을 각주가 아니라 정식 구간으로 세운다. 이 서비스가 다른 곳과 갈리는 지점이다.
 */
export function Month36(): ReactNode {
  return (
    <Station id="m36" month={36}>
      <StationHead
        id="m36"
        month={36}
        title={
          <>
            모르는 건
            <br />
            모른다고 씁니다
          </>
        }
      >
        <p>
          어린이집 자리와 지원금은 부모가 실제 결정을 내리는 정보입니다. 근거 없는 숫자를 그럴듯하게
          보여 주면, 그걸 믿고 다른 선택지를 포기한 사람이 손해를 봅니다.{' '}
          <strong>모른다고 쓰는 편이 낫습니다.</strong>
        </p>
      </StationHead>

      <div className="yr-cannots">
        {KNOWN_UNKNOWN.map((row) => (
          <div className="yr-cannots__row" key={row.unknown} data-in="">
            <div>
              <p className="label" style={{ color: 'var(--seal-deep)' }}>
                아는 것
              </p>
              <p className="yr-cannots__v">{row.known}</p>
            </div>
            <div>
              <p className="label" style={{ color: 'var(--stamp)' }}>
                모르는 것
              </p>
              <p className="yr-cannots__v">{row.unknown}</p>
              <p className="yr-cannots__why">{row.why}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="yr-fine" data-in="">
        확실하지 않은 금액은 <span className="unknown">미상</span>으로 둡니다. 0원으로 채우지
        않습니다. <Link href="/data">데이터 출처와 한계 보기</Link>
      </p>
    </Station>
  )
}
