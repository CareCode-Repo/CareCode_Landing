import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { PageHead, Section, Shell } from '@/components/Page'
import { MEASURED_LABEL, MEASURED_ON, SOURCES, SYNC_SCHEDULE, formatCount } from '@/content/figures'

export const metadata: Metadata = {
  title: '데이터',
  description:
    '어디서 받아 오는지, 무엇을 알 수 있고 무엇을 알 수 없는지. 비어 있는 지역과 못 채운 값을 그대로 적었습니다.',
}

/** 이 표가 이 페이지의 이유다. 마케팅 페이지가 보통 쓰지 않는 오른쪽 칸. */
const LEDGER = [
  {
    known: '시설 전체의 정원과 현원',
    unknown: '반별 정원',
    why: '공공데이터가 시설 단위로만 줍니다. 0세반이 찼는데 5세반에 자리가 난 것일 수 있어, 알림에 그대로 적습니다.',
  },
  {
    known: '정책의 대상 연령·지역·소득 기준',
    unknown: '일부 정책의 지원 금액',
    why: '금액이 숫자가 아니라 설명 문장 안에 섞여 옵니다. 기계로 뽑다 실패한 건 미상으로 두고, 받아 보신 분들의 제보로 채웁니다.',
  },
  {
    known: '관측된 정원 변동',
    unknown: '대기 순번이 도는 시점',
    why: '정부가 공개하지 않습니다. 부모들이 남긴 입소 기록이 세 건 이상 모인 시설만 통계를 냅니다.',
  },
  {
    known: '전국 시군구 200여 곳의 시설',
    unknown: '광주와 전남의 시설',
    why: '두 정부 API 모두 이 두 지역에서 빈 결과를 돌려줍니다. 우리 쪽 문제가 아니라 확인된 사실이라 적어 둡니다.',
  },
]

export default function DataPage(): ReactNode {
  return (
    <>
      <PageHead
        eyebrow="데이터"
        title={<>아는 것과 모르는 것</>}
        lead={
          <>
            이 서비스가 다루는 정보는 전부 정부가 공개한 것입니다. 그래서 무엇을 알 수 있는지는
            정부가 무엇을 주는지에 달려 있고, 주지 않는 것은 저희도 모릅니다. 어느 쪽인지 구분해
            적습니다.
          </>
        }
      />

      <Section label={`출처 · ${MEASURED_LABEL}`} title="네 곳에서 받아 옵니다">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <caption className="sr-only">공공데이터 출처별 수집 현황 ({MEASURED_LABEL})</caption>
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--ink)' }}>
                <th scope="col" className="label pb-3">
                  출처
                </th>
                <th scope="col" className="label pb-3">
                  대상
                </th>
                <th scope="col" className="label pb-3 text-right">
                  수집량 · {MEASURED_ON}
                </th>
                <th scope="col" className="label pb-3 text-right">
                  형식
                </th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.name} className="border-b" style={{ borderColor: 'var(--rule)' }}>
                  <th scope="row" className="py-4 pr-4 text-[0.95rem] font-normal">
                    {s.name}
                  </th>
                  <td className="py-4 pr-4 text-[0.95rem]" style={{ color: 'var(--ink-soft)' }}>
                    {s.gets}
                  </td>
                  <td className="figure py-4 pr-4 text-right text-[0.95rem]">
                    {formatCount(s.count)}
                    {s.unit}
                  </td>
                  <td
                    className="figure py-4 text-right text-[0.8125rem]"
                    style={{ color: 'var(--past)' }}
                  >
                    {s.format}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          className="mt-6 max-w-2xl text-[0.9rem] leading-[1.85]"
          style={{ color: 'var(--ink-soft)' }}
        >
          네 곳 모두 응답 형식과 지역 코드 체계가 다릅니다. 시군구를 하나씩 돌면서 모으고, 한 곳이
          실패해도 나머지는 계속 받습니다. 수집이 아예 멈추거나 호출 한도를 넘기면 사람에게
          알립니다.
        </p>

        {/* 이 사이트는 근거 없는 숫자를 쓰지 않겠다고 말한다. 그러면 언제 잰 값인지도 말해야 한다. */}
        <p className="mt-3 max-w-2xl text-[0.9rem] leading-[1.85]" style={{ color: 'var(--past)' }}>
          위 수집량은 {MEASURED_LABEL} 실측값입니다. 매주 새로 받아 오므로 지금 수치와 다를 수
          있습니다.
        </p>
      </Section>

      {/* 이 페이지의 위험 감수 지점. 오른쪽 칸을 쓰는 서비스는 드물다. */}
      <section className="border-b py-14 md:py-20" style={{ borderColor: 'var(--rule)' }}>
        <Shell>
          <p className="label">대조</p>
          <h2 className="display mt-4 text-[1.5rem] md:text-[2rem]">
            무엇을 모르는지 적어 두는 이유
          </h2>
          <p
            className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.9]"
            style={{ color: 'var(--ink-soft)' }}
          >
            어린이집 자리와 지원금은 부모가 실제 결정을 내리는 정보입니다. 근거 없는 숫자를
            그럴듯하게 보여 주면, 그걸 믿고 다른 선택지를 포기한 사람이 손해를 봅니다. 모른다고 쓰는
            편이 낫습니다.
          </p>

          <ul className="mt-10 space-y-px" style={{ backgroundColor: 'var(--rule)' }}>
            {LEDGER.map((row) => (
              <li
                key={row.unknown}
                className="p-6 md:p-7"
                style={{ backgroundColor: 'var(--paper)' }}
              >
                <div className="grid gap-5 md:grid-cols-2 md:gap-10">
                  <div>
                    <p className="label" style={{ color: 'var(--seal-deep)' }}>
                      아는 것
                    </p>
                    <p className="mt-2.5 text-[1rem] leading-[1.7]">{row.known}</p>
                  </div>
                  <div
                    className="border-t pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-10"
                    style={{ borderColor: 'var(--rule)' }}
                  >
                    <p className="label" style={{ color: 'var(--stamp)' }}>
                      모르는 것
                    </p>
                    <p className="mt-2.5 text-[1rem] leading-[1.7]">{row.unknown}</p>
                    <p
                      className="mt-3 text-[0.875rem] leading-[1.8]"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      {row.why}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Shell>
      </section>

      <Section label="갱신" title="언제 새로 받아 오나">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[440px] border-collapse text-left">
            <caption className="sr-only">데이터 갱신 주기</caption>
            <tbody>
              {SYNC_SCHEDULE.map(({ what, when }) => (
                <tr key={what} className="border-b" style={{ borderColor: 'var(--rule)' }}>
                  <th scope="row" className="py-4 pr-6 text-[0.95rem] font-normal">
                    {what}
                  </th>
                  <td
                    className="figure py-4 text-right text-[0.95rem]"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    {when}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          className="mt-6 max-w-2xl text-[0.9rem] leading-[1.85]"
          style={{ color: 'var(--ink-soft)' }}
        >
          알림은 수집이 끝난 뒤에 나갑니다. 그날 들어온 데이터를 근거로 보내야 하기 때문입니다.
        </p>
      </Section>
    </>
  )
}
