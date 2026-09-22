import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { Figure, PageHead, Section } from '@/components/Page'
import { SILENT_CASES } from '@/content/facts'
import VacancyNotice from '@/components/VacancyNotice'

export const metadata: Metadata = {
  title: '어린이집',
  description:
    '대기 걸어 둔 시설에 자리가 늘면 알립니다. 정원 관측을 쌓아 입소 시점을 추정하되, 근거가 없으면 확률을 만들지 않습니다.',
}


export default function FacilitiesPage(): ReactNode {
  return (
    <>
      <PageHead
        eyebrow="어린이집"
        title={<>자리가 났다는 걸 아무도 알려 주지 않습니다</>}
        lead={
          <>
            대기를 걸어 두면 그다음은 기다리는 일뿐입니다. 시설에 전화해도 “기다려 보세요”가
            전부입니다. 정부 데이터는 지금 이 순간의 정원만 알려 줄 뿐 과거를 주지 않아, 자리가 잘
            나는 곳인지도 알 수 없습니다.
          </>
        }
      />

      <Section label="쌓는 것" title="매주 정원을 관측해 이력을 만듭니다">
        <div className="max-w-2xl">
          <p className="text-[1.0625rem] leading-[1.9]">
            시설 정보는 최신값만 남습니다. 덮어쓰면 추이가 사라집니다. 그래서 동기화할 때마다 그날의
            정원과 현원을 날짜별로 따로 적어 둡니다. 이 이력이 나머지 세 기능의 재료가 됩니다.
          </p>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-3">
          <Figure
            value="입소 예측"
            label="자리가 날 확률"
            note="관측이 없으면 확률을 만들지 않습니다"
          />
          <Figure
            value="인기도"
            label="충원율 추이"
            note="현재 충원율만 보면 정원 작은 곳이 늘 높습니다"
          />
          <Figure value="빈자리" label="증가 감지" note="있다가 아니라 늘었는가로 봅니다" />
        </div>
      </Section>

      <Section label="알림" title="새로 난 자리만 알립니다">
        <VacancyNotice />

        <div className="mt-12">
          <p className="label">알리지 않는 경우</p>
          <ul className="mt-5 divide-y" style={{ borderColor: 'var(--line)' }}>
            {SILENT_CASES.map((c) => (
              <li
                key={c.when}
                className="grid gap-1.5 border-t py-4 sm:grid-cols-[240px_1fr] sm:gap-6"
                style={{ borderColor: 'var(--line)' }}
              >
                <span className="text-[0.95rem]">{c.when}</span>
                <span
                  className="text-[0.9rem] leading-relaxed"
                  style={{ color: 'var(--fg-soft)' }}
                >
                  {c.why}
                </span>
              </li>
            ))}
          </ul>
          <p
            className="mt-6 max-w-2xl text-[0.9rem] leading-[1.85]"
            style={{ color: 'var(--fg-soft)' }}
          >
            알림은 다시 앱을 열 유일한 이유이자, 성가시면 앱을 지우게 되는 이유이기도 합니다. 그래서
            언제 보낼지보다 언제 보내지 않을지를 먼저 정했습니다.
          </p>
        </div>
      </Section>

      <Section label="대기 기간" title="겪은 사람만 아는 것">
        <div className="max-w-2xl">
          <p className="text-[1.0625rem] leading-[1.9]">
            정원 관측은 “자리가 났는가”만 알려 줍니다. 대기 순번이 언제 도는지는 정부 데이터에
            없습니다. 겪어 본 부모만 압니다.
          </p>
          <p className="mt-5 text-[1.0625rem] leading-[1.9]" style={{ color: 'var(--fg-soft)' }}>
            그래서 대기 등록과 입소·포기 시점을 직접 기록하실 수 있게 했습니다. 기록이 세 건
            미만이면 평균이 우연에 좌우되므로, 그때는 숫자 대신 왜 낼 수 없는지를 알려 드립니다.
          </p>
        </div>

        <div
          className="mt-9 border-l-2 py-1 pl-5 text-[0.95rem] leading-[1.85]"
          style={{ borderColor: 'var(--brand)', color: 'var(--fg-soft)' }}
        >
          “입소한 7명의 실제 기록 기준입니다. 절반이 5개월 안에 입소했습니다. 현재 12명이 대기
          중으로 등록해 두었습니다.”
        </div>
      </Section>
    </>
  )
}
