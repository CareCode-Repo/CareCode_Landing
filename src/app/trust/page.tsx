import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { PageHead, Section } from '@/components/Page'

export const metadata: Metadata = {
  title: '개인정보',
  description: '무엇을 받고 왜 받는지, 건강 정보를 어떻게 따로 다루는지, 탈퇴하면 어떻게 되는지.',
}

const COLLECTED = [
  {
    group: '계정',
    items: '이메일, 이름, 전화번호',
    why: '로그인과 알림 발송에 씁니다.',
    sensitive: false,
  },
  {
    group: '거주지',
    items: '주소, 좌표',
    why: '지자체 지원금 대상 판정과 반경 검색에 씁니다. 좌표가 없으면 가까운 시설을 찾을 수 없습니다.',
    sensitive: false,
  },
  {
    group: '가구',
    items: '소득분위, 가구원 수',
    why: '소득 기준이 있는 지원금의 대상 여부를 가립니다. 입력하지 않으셔도 목록에서 빼지 않습니다.',
    sensitive: false,
  },
  {
    group: '자녀',
    items: '이름, 생년월일, 성별, 특수보육 필요 여부',
    why: '개월 수로 대상 지원금을 찾고, 연령에 맞는 시설을 고릅니다.',
    sensitive: false,
  },
  {
    group: '건강 기록',
    items: '키, 몸무게, 체온, 접종명, 증상, 진단, 처방',
    why: '성장 기록과 접종 일정 관리에 씁니다. 민감정보라 별도 동의를 받고, 동의 전에는 저장도 조회도 되지 않습니다.',
    sensitive: true,
  },
]

export default function TrustPage(): ReactNode {
  return (
    <>
      <PageHead
        eyebrow="개인정보"
        title={<>아이의 정보를 맡기는 일</>}
        lead={
          <>
            이 서비스는 아이의 진단명과 처방까지 다룹니다. 법이 민감정보로 정한 항목이고, 일반
            개인정보와 같은 동의로 처리할 수 없습니다. 무엇을 왜 받는지 항목별로 적습니다.
          </>
        }
      />

      <Section label="수집" title="받는 것과 그 이유">
        <ul className="space-y-px" style={{ backgroundColor: 'var(--rule)' }}>
          {COLLECTED.map((row) => (
            <li key={row.group} className="p-6" style={{ backgroundColor: 'var(--paper)' }}>
              <div className="grid gap-4 md:grid-cols-[132px_1fr] md:gap-8">
                <div>
                  <p className="text-[0.95rem]">{row.group}</p>
                  {row.sensitive && (
                    <span
                      className="stamp mt-2.5 inline-block"
                      style={{ color: 'var(--stamp)' }}
                    >
                      민감정보
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[0.95rem] leading-[1.75]">{row.items}</p>
                  <p
                    className="mt-2.5 text-[0.875rem] leading-[1.8]"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    {row.why}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p
          className="mt-7 max-w-2xl text-[0.9rem] leading-[1.85]"
          style={{ color: 'var(--ink-soft)' }}
        >
          목록에 없는 항목은 받지 않습니다. 쓰임이 없어진 항목은 지웁니다.
        </p>
      </Section>

      <Section label="건강 정보" title="동의 전에는 막습니다">
        <div className="max-w-2xl">
          <p className="text-[1.0625rem] leading-[1.9]">
            건강 기록은 별도 동의 없이는 저장도 조회도 되지 않습니다. 동의하지 않은 채 접근하면
            화면이 그냥 막히는 게 아니라, <strong>어떤 동의가 필요한지</strong>를 함께 알려
            드립니다. 왜 막혔는지 모른 채 화면만 보게 되면 안 되기 때문입니다.
          </p>
          <p className="mt-5 text-[1.0625rem] leading-[1.9]" style={{ color: 'var(--ink-soft)' }}>
            동의는 언제든 철회할 수 있고, 언제 무엇에 동의했는지 이력도 보실 수 있습니다.
          </p>
        </div>
      </Section>

      <Section label="권리" title="내 정보를 다루는 방법">
        <ul className="divide-y" style={{ borderColor: 'var(--rule)' }}>
          {[
            {
              what: '내려받기',
              how: '저장된 개인정보 전체를 한 번에 받아 보실 수 있습니다.',
            },
            {
              what: '동의 관리',
              how: '항목별로 켜고 끌 수 있습니다. 동의 이력도 함께 남습니다.',
            },
            {
              what: '탈퇴',
              how: '식별 정보를 지우고 계정을 닫습니다. 탈퇴한 계정으로는 로그인되지 않습니다. 다만 남기신 커뮤니티 글처럼 다른 분들의 기록과 얽힌 부분은 함께 사라지지 않습니다.',
            },
          ].map((r) => (
            <li
              key={r.what}
              className="grid gap-2 border-t py-5 md:grid-cols-[132px_1fr] md:gap-8"
              style={{ borderColor: 'var(--rule)' }}
            >
              <span className="text-[0.95rem]">{r.what}</span>
              <span className="text-[0.9rem] leading-[1.8]" style={{ color: 'var(--ink-soft)' }}>
                {r.how}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="고지" title="이 서비스가 보장하지 않는 것">
        <div className="max-w-2xl">
          <ul className="space-y-4">
            {[
              '지원금 금액은 참고 자료이며 추정치입니다. 실제 수령액은 지자체 안내를 따릅니다.',
              '입소 예측은 관측을 근거로 한 추정이며 입소를 보장하지 않습니다.',
              '빈자리 알림은 시설 전체 기준이라 해당 반의 자리를 보장하지 않습니다.',
              '성장 정보는 의학적 진단이 아닙니다.',
            ].map((line) => (
              <li key={line} className="flex gap-3.5 text-[1rem] leading-[1.8]">
                <span aria-hidden="true" style={{ color: 'var(--stamp)' }}>
                  —
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[0.9rem] leading-[1.85]" style={{ color: 'var(--ink-soft)' }}>
            잘못된 기대는 그대로 분쟁이 됩니다. 그래서 약관에도 같은 내용을 넣었습니다.
          </p>
        </div>
      </Section>
    </>
  )
}
