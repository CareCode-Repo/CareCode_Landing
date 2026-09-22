import { ReactNode } from 'react'
import { Station, StationHead } from './Station'

/*
 * 48개월 — 네 해째. 이제 부모가 서비스의 데이터가 된다.
 * 정부가 주지 않는 두 가지(실수령액 · 대기 기간)는 겪어 본 부모만 안다.
 */
const RULES = [
  { v: '3건', k: '금액을 확정하는 제보 수', note: '한 사람의 오타가 금액을 흔들면 안 됩니다' },
  { v: '3건', k: '대기 통계를 내는 입소 기록 수', note: '그보다 적으면 숫자 대신 이유를 드립니다' },
  { v: '주 1회', k: '제보 요청 주기', note: '매일 물으면 소음이 됩니다' },
] as const

export function Month48(): ReactNode {
  return (
    <Station id="m48" month={48}>
      <StationHead
        id="m48"
        month={48}
        title={
          <>
            겪은 사람만
            <br />
            아는 것
          </>
        }
      >
        <p>
          정부는 지원금을 실제로 얼마 받았는지, 대기 순번이 언제 도는지 알려 주지 않습니다. 받아 본
          부모, 기다려 본 부모만 압니다. 그래서 금액 제보와 입소 기록을 직접 남기실 수 있게 했고,{' '}
          <strong>기록이 모이기 전에는 숫자를 만들지 않습니다.</strong>
        </p>
      </StationHead>

      <ul className="yr-figures yr-figures--3">
        {RULES.map((r) => (
          <li key={r.k} data-in="">
            <p className="figure yr-figures__v">{r.v}</p>
            <p className="yr-figures__k">{r.k}</p>
            <p className="yr-figures__n">{r.note}</p>
          </li>
        ))}
      </ul>

      <figure className="yr-quote" data-in="">
        <blockquote>
          “입소한 7명의 실제 기록 기준입니다. 절반이 5개월 안에 입소했습니다. 현재 12명이 대기 중으로
          등록해 두었습니다.”
        </blockquote>
        <figcaption className="yr-fine">기록이 세 건 이상 모인 시설에서 보여 드리는 문장의 예시입니다.</figcaption>
      </figure>
    </Station>
  )
}
