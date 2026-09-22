import Link from 'next/link'
import { CSSProperties, ReactNode } from 'react'
import { VERDICTS } from '@/content/facts'
import { Station, StationHead } from './Station'

/*
 * 24개월 — 부모급여의 대상 기간(0–23개월)이 끝나고 양육수당으로 넘어가는 달.
 * 지원이 갈아타는 경계는 합계가 틀리기 가장 쉬운 자리라, 여기서 "그 숫자가 맞는가"를 묻는다.
 * 원장은 고친 것만이 아니라 원인을 함께 싣는다.
 */
const LEDGER = [
  {
    what: '자격 판정',
    before: '지역 정책 전부 합산',
    after: '자녀 수 · 소득 판정',
    note: '다자녀 전용 지원금이 외동 가정에도 합산되고 있었습니다.',
  },
  {
    what: '지급 기간',
    before: '대상 연령 상한',
    after: '별도 항목',
    note: '월 250만 원짜리 지원금에 대상 상한 60개월을 곱해 1억 5천만 원이 한 사람의 예상액에 들어갔습니다.',
  },
  {
    what: '융자',
    before: '총액에 포함',
    after: '따로 안내',
    note: '갚아야 하는 돈은 받는 돈이 아닙니다.',
  },
  {
    what: '중복 불가',
    before: '모두 합산',
    after: '가장 큰 것 하나',
    note: '같은 목적이라 동시에 받을 수 없는 지원금은 하나만 셉니다.',
  },
] as const

export function Month24(): ReactNode {
  return (
    <Station id="m24" month={24}>
      <StationHead
        id="m24"
        month={24}
        title={
          <>
            그 숫자가 맞다는 건
            <br />
            어떻게 압니까
          </>
        }
      >
        <p>
          부모급여가 끝나고 양육수당이 이어지는 달입니다. 지원이 갈아타는 경계에서 합계가 가장 쉽게
          틀립니다. 처음 만들었을 때 한 가정의 예상 총액이{' '}
          <span className="figure">295,068,000원</span>으로 나왔습니다. 명백히 틀린 값이라 원인을
          찾았습니다.
        </p>
      </StationHead>

      <div className="yr-ledger" role="table" aria-label="예상 총액 계산을 고친 기록">
        <div className="yr-ledger__row yr-ledger__head" role="row">
          <span role="columnheader">항목</span>
          <span role="columnheader">처음</span>
          <span role="columnheader">지금</span>
          <span role="columnheader">원인</span>
        </div>
        {LEDGER.map((r) => (
          <div className="yr-ledger__row" role="row" key={r.what} data-in="">
            <span role="rowheader" className="yr-ledger__n">
              {r.what}
            </span>
            <span role="cell" className="yr-ledger__a">
              {r.before}
            </span>
            <span role="cell" className="yr-ledger__b">
              {r.after}
            </span>
            <span role="cell" className="yr-ledger__d">
              {r.note}
            </span>
          </div>
        ))}
        <div className="yr-ledger__row yr-ledger__total" role="row" data-in="">
          <span role="rowheader" className="yr-ledger__n">
            예상 총액
          </span>
          <span role="cell" className="yr-ledger__a figure">
            295,068,000원
          </span>
          <span role="cell" className="yr-ledger__b figure">
            80,568,000원
          </span>
          <span role="cell" className="yr-ledger__d">
            같은 가정, 같은 정책 목록입니다. 바뀐 것은 세는 방법뿐입니다.
          </span>
        </div>
      </div>

      <h3 className="yr-h3" data-in="">
        대상인지는 세 갈래로 나눕니다
      </h3>
      <ul className="yr-levels">
        {VERDICTS.map((v) => (
          <li key={v.head} style={{ '--c': v.tone } as CSSProperties} data-in="">
            <span className="stamp" style={{ color: v.tone }}>
              {v.head}
            </span>
            <p>{v.body}</p>
          </li>
        ))}
      </ul>
      <p className="yr-fine" data-in="">
        <Link href="/benefits">자격 판정과 계산 방식 자세히 보기</Link>
      </p>
    </Station>
  )
}
