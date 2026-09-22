import { ReactNode } from 'react'
import { MEASURED_LABEL, SOURCES, formatCount } from '@/content/figures'
import { Station, StationHead } from './Station'

/* 1개월 — 출생신고를 마친 달. 지원이 없어서가 아니라 있는 자리가 다르다는 것부터 말한다. */

const GAP = [
  { k: '운영', policy: '중앙정부와 지자체가 따로', parent: '우리 집 한 곳' },
  { k: '기준', policy: '대상 연령 상·하한 · 소득 · 자녀 수', parent: '우리 아이 개월 수' },
  { k: '금액', policy: '설명 문장 안에 섞여 옴', parent: '그래서 얼마인가' },
  { k: '시간', policy: '신청 기한이 지나면 사라짐', parent: '지금 신청할 수 있나' },
] as const

export function Month01(): ReactNode {
  return (
    <Station id="m01" month={1}>
      <StationHead
        id="m01"
        month={1}
        title={
          <>
            지원이 없어서가 아닙니다.
            <br />
            있는 자리가 다를 뿐입니다.
          </>
        }
      >
        <p>
          지원은 이미 정부가 만들고 있습니다. 다만 그것이 존재하는 단위와, 아이를 안은 부모가 서
          있는 단위가 다릅니다. 맘편한이 하는 일은 새 지원을 만드는 게 아니라{' '}
          <strong>이 간극을 메우는 것</strong>입니다.
        </p>
      </StationHead>

      <div className="yr-gap" role="table" aria-label="지원이 존재하는 단위와 부모가 서 있는 단위">
        <div className="yr-gap__row yr-gap__head" role="row">
          <span role="columnheader">
            <span className="sr-only">항목</span>
          </span>
          <span role="columnheader">지원이 존재하는 단위</span>
          <span role="columnheader">부모가 서 있는 단위</span>
        </div>
        {GAP.map((row) => (
          <div className="yr-gap__row" role="row" key={row.k} data-in="">
            <span role="rowheader" className="label">
              {row.k}
            </span>
            <span role="cell">{row.policy}</span>
            <span role="cell" className="yr-gap__parent">
              {row.parent}
            </span>
          </div>
        ))}
      </div>

      <h3 className="yr-h3" data-in="">
        네 곳의 정부 데이터를 한 자리에 <span className="yr-when">{MEASURED_LABEL}</span>
      </h3>
      <ul className="yr-figures">
        {SOURCES.map((s) => (
          <li key={s.name} data-in="">
            <p className="figure yr-figures__v">
              {formatCount(s.count)}
              <small>{s.unit}</small>
            </p>
            <p className="yr-figures__k">{s.gets}</p>
            <p className="yr-figures__n">{s.name}</p>
          </li>
        ))}
      </ul>
      <p className="yr-fine" data-in="">
        네 곳 모두 응답 형식과 지역 코드 체계가 다릅니다. 시군구 200여 곳을 하나씩 돌면서 모으고, 한
        곳이 실패해도 나머지는 계속 받습니다.
      </p>
    </Station>
  )
}
