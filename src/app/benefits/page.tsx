import type { Metadata } from 'next'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Figure, PageHead, Section } from '@/components/Page'
import { VERDICTS } from '@/content/facts'

export const metadata: Metadata = {
  title: '지원금',
  description:
    '놓친 지원금 찾기, 거주지별 비교, 실수령액 제보로 확정하는 금액. 추정치는 추정치라고 표기합니다.',
}


export default function BenefitsPage(): ReactNode {
  return (
    <>
      <PageHead
        eyebrow="지원금"
        title={<>얼마를 받을 수 있는지, 왜 그런지</>}
        lead={
          <>
            목록을 보여 주는 것만으로는 부족합니다. 이 가정이 실제로 얼마를 받을 수 있는지 계산하고,
            그 근거가 된 정책을 함께 보여 드립니다.
          </>
        }
      />

      <Section label="자격 판정" title="세 갈래로 나눕니다">
        <ul className="space-y-px" style={{ backgroundColor: 'var(--rule)' }}>
          {VERDICTS.map((v) => (
            <li key={v.head} className="p-6" style={{ backgroundColor: 'var(--paper)' }}>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="stamp" style={{ color: v.tone }}>
                  {v.head}
                </span>
              </div>
              <p
                className="mt-4 max-w-2xl text-[0.95rem] leading-[1.85]"
                style={{ color: 'var(--ink-soft)' }}
              >
                {v.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="계산" title="지급 방식마다 다르게 셉니다">
        <div className="max-w-2xl">
          <p className="text-[1.0625rem] leading-[1.9]">
            처음 만들었을 때 한 가정의 예상 총액이{' '}
            <span className="figure">295,068,000원</span>으로 나왔습니다. 명백히 틀린 값이라
            원인을 찾았습니다.
          </p>
        </div>

        <div className="mt-8 grid gap-px md:grid-cols-2" style={{ backgroundColor: 'var(--rule)' }}>
          <div className="p-6" style={{ backgroundColor: 'var(--paper)' }}>
            <p className="label">원인 하나</p>
            <p className="mt-3 text-[0.95rem] leading-[1.85]">
              자녀 수와 소득 조건을 보지 않고 지역에 있는 정책을 전부 더하고 있었습니다. 다자녀 전용
              지원금이 외동 가정에도 합산됐습니다.
            </p>
          </div>
          <div className="p-6" style={{ backgroundColor: 'var(--paper)' }}>
            <p className="label">원인 둘</p>
            <p className="mt-3 text-[0.95rem] leading-[1.85]">
              <strong>대상 연령을 지급 기간으로 착각</strong>했습니다. 월 250만 원짜리 지원금에 대상
              상한 60개월을 곱해 1억 5천만 원이 한 사람의 예상액에 들어갔습니다.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <span
            className="figure text-[1.5rem]"
            style={{ color: 'var(--past)', textDecoration: 'line-through' }}
          >
            295,068,000원
          </span>
          <span aria-hidden="true" style={{ color: 'var(--past)' }}>
            →
          </span>
          <span className="figure text-[1.75rem]" style={{ color: 'var(--seal-deep)' }}>
            80,568,000원
          </span>
        </div>

        <p
          className="mt-6 max-w-2xl text-[0.9rem] leading-[1.85]"
          style={{ color: 'var(--ink-soft)' }}
        >
          지급 기간을 별도 항목으로 떼어 내고 자격 판정을 넣은 결과입니다. 융자는 갚아야 하는 돈이라
          총액에서 빼고 따로 안내합니다. 같은 목적이라 동시에 받을 수 없는 지원금은 가장 큰 것
          하나만 셉니다.
        </p>
      </Section>

      <Section label="금액 신뢰도" title="숫자를 주지 않는 정부, 받아 본 부모">
        <div className="max-w-2xl">
          <p className="text-[1.0625rem] leading-[1.9]">
            지원금 설명은 자유 문장으로 옵니다.{' '}
            <span className="figure text-[0.95rem]">“국공립 100,000원, 사립 280,000원”</span>,{' '}
            <span className="figure text-[0.95rem]">“융자(연 1.5%)”</span> 같은 식입니다.
            기계로 뽑다 실패한 정책을 버리면 목록에서 사라져 존재 자체를 모르게 됩니다.
          </p>
          <p className="mt-5 text-[1.0625rem] leading-[1.9]" style={{ color: 'var(--ink-soft)' }}>
            그래서 버리지 않고 <span className="unknown">미상</span>으로 남깁니다. 대신 실제로
            받아 보신 분께 금액을 묻고, 같은 값이 세 건 모이면 그때 확정합니다. 관리자가 직접 확인한
            정책은 지역별 검증 비율과 함께 표시합니다.
          </p>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-3">
          <Figure
            value="3"
            unit="건"
            label="합의에 필요한 제보"
            note="한 사람의 오타가 금액을 흔들면 안 됩니다"
          />
          <Figure value="주 1" unit="회" label="제보 요청 주기" note="매일 물으면 소음이 됩니다" />
          <Figure value="미상" label="확인 못 한 금액" note="0원으로 채우지 않습니다" muted />
        </div>
      </Section>

      <Section label="비교" title="사는 곳에 따라 달라지는 금액">
        <div className="max-w-2xl">
          <p className="text-[1.0625rem] leading-[1.9]">
            같은 조건이어도 지자체마다 지원이 다릅니다. 다른 지역에 살면 얼마를 더 받는지 계산하고,
            차액의 근거가 된 정책 목록을 함께 드립니다.
          </p>
          <p className="mt-5 text-[0.9rem] leading-[1.85]" style={{ color: 'var(--ink-soft)' }}>
            숫자만 주면 믿을 이유가 없습니다. 어떤 정책 때문에 차이가 나는지 보이면 직접 확인하실 수
            있습니다.
          </p>
          <p className="mt-8">
            <Link href="/data" className="text-[0.95rem] underline underline-offset-4">
              이 데이터가 어디서 오는지 보기
            </Link>
          </p>
        </div>
      </Section>
    </>
  )
}
