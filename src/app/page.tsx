import Link from 'next/link'
import { ReactNode } from 'react'
import MonthTimeline from '@/components/MonthTimeline'
import { Figure, Section, Shell } from '@/components/Page'

export default function Home(): ReactNode {
  return (
    <>
      {/* 히어로. 문구로 설득하는 대신 축 위에서 직접 보게 한다. */}
      <section
        className="border-b pt-14 pb-16 md:pt-20 md:pb-24"
        style={{ borderColor: 'var(--rule)' }}
      >
        <Shell>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
            <div className="rise">
              <p className="label">육아 지원 안내</p>
              <h1 className="display mt-5 text-[2.5rem] md:text-[3.75rem]">
                받을 수 있었는데
                <br />
                몰라서 못 받은 돈
              </h1>
              <p
                className="mt-6 max-w-md text-[1.0625rem] leading-[1.85]"
                style={{ color: 'var(--ink-soft)' }}
              >
                육아 지원금은 중앙정부와 지자체가 따로 운영합니다. 대상인지 알기 어렵고, 신청 기한을
                넘기면 조용히 사라집니다. 옆의 축을 옮겨 보면 아이 개월 수마다 무엇이 열리고
                닫히는지 한눈에 보입니다.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/benefits"
                  className="px-6 py-3 text-[0.95rem] transition-colors"
                  style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)' }}
                >
                  지원금 찾는 방법
                </Link>
                <Link
                  href="/data"
                  className="text-[0.95rem] underline underline-offset-4"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  데이터 출처 보기
                </Link>
              </div>
            </div>

            <div
              className="rise border p-6 md:p-8"
              style={{
                borderColor: 'var(--rule)',
                backgroundColor: 'var(--paper)',
                animationDelay: '90ms',
              }}
            >
              <MonthTimeline />
            </div>
          </div>
        </Shell>
      </section>

      <Section label="하는 일" title="알려 주지 않으면 알 수 없는 것들">
        <div className="grid gap-px md:grid-cols-3" style={{ backgroundColor: 'var(--rule)' }}>
          {[
            {
              head: '놓친 지원금',
              body: '아이가 지나온 개월 구간을 거슬러 올라가 대상이었던 지원금을 찾습니다. 소급 신청이 아직 가능한 것과 이미 지난 것을 나눠서 보여 줍니다.',
              foot: '이미 지난 것도 보여 주는 이유는, 둘째를 준비하는 부모에게는 그게 중요한 정보이기 때문입니다.',
            },
            {
              head: '어린이집 빈자리',
              body: '대기 걸어 둔 시설의 정원을 매주 관측해 자리가 늘어난 순간에만 알립니다. 계속 자리가 있는 곳은 이미 알고 계실 테니 알리지 않습니다.',
              foot: '어느 반에 자리가 났는지는 공공데이터가 주지 않아, 알림에 그 한계를 적어 보냅니다.',
            },
            {
              head: '신청 마감',
              body: '조건에 맞는 지원금의 신청 기한이 일주일 남았을 때, 그리고 하루 남았을 때 알립니다.',
              foot: '놓친 뒤에 알려 주는 것보다 놓치기 전에 막는 편이 낫습니다.',
            },
          ].map((card) => (
            <div key={card.head} className="p-7" style={{ backgroundColor: 'var(--paper)' }}>
              <h3 className="display text-[1.25rem]">{card.head}</h3>
              <p className="mt-4 text-[0.95rem] leading-[1.8]" style={{ color: 'var(--ink)' }}>
                {card.body}
              </p>
              <p
                className="mt-4 border-t pt-4 text-[0.8125rem] leading-relaxed"
                style={{ borderColor: 'var(--rule)', color: 'var(--ink-soft)' }}
              >
                {card.foot}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="모아 둔 것" title="네 곳의 정부 데이터를 한 자리에">
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          <Figure value="8,331" unit="곳" label="어린이집" note="보육통합정보시스템" />
          <Figure value="7,052" unit="곳" label="유치원" note="유치원알리미" />
          <Figure value="4,292" unit="곳" label="소아청소년과" note="건강보험심사평가원" />
          <Figure value="60" unit="건" label="정부지원 서비스" note="보조금24" />
        </div>
        <p
          className="mt-8 max-w-2xl text-[0.9rem] leading-[1.85]"
          style={{ color: 'var(--ink-soft)' }}
        >
          네 곳 모두 응답 형식과 지역 코드 체계가 다릅니다. 시군구 200여 곳을 하나씩 돌면서 모으고,
          한 곳이 실패해도 나머지는 계속 받습니다. 지금 비어 있는 지역과 아직 못 채운 값은{' '}
          <Link
            href="/data"
            className="underline underline-offset-4"
            style={{ color: 'var(--ink)' }}
          >
            데이터 페이지
          </Link>
          에 그대로 적어 두었습니다.
        </p>
      </Section>

      {/* 신뢰 구획. 이 서비스가 다른 곳과 갈리는 지점이라 별도로 세운다. */}
      <Section label="약속" title="모르는 건 모른다고 씁니다">
        <div className="max-w-2xl">
          <p className="text-[1.0625rem] leading-[1.9]">
            지원금 금액은 정부가 숫자로 주지 않고 설명 문장 안에 섞여 옵니다. 그걸 기계로 뽑다 보면
            틀립니다. 틀린 금액을 확정치처럼 보여 주면 그건 신뢰 문제를 넘어 분쟁이 됩니다.
          </p>
          <p className="mt-5 text-[1.0625rem] leading-[1.9]" style={{ color: 'var(--ink-soft)' }}>
            그래서 확실하지 않은 값은 <span className="unknown">미상</span>으로 두고, 표본이
            부족한 통계는 숫자 대신 이유를 돌려 드립니다. 받아 본 분들의 실수령액 제보가 세 건
            모이면 그때 금액을 확정합니다.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <span className="stamp" style={{ color: 'var(--seal-deep)' }}>
              관측 기반
            </span>
            <span className="stamp" style={{ color: 'var(--stamp)' }}>
              추정치 표기
            </span>
            <span className="stamp" style={{ color: 'var(--ink-soft)' }}>
              출처 공개
            </span>
          </div>
        </div>
      </Section>
    </>
  )
}
