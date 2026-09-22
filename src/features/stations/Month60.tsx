import Link from 'next/link'
import { ReactNode } from 'react'
import { Station, StationHead } from './Station'

/*
 * 60개월 — 다섯 해 동안 쌓인 기록. 그만큼 맡긴 정보도 많아졌다.
 * 무엇을 받았는지보다 부모가 그걸 어떻게 되찾고 지울 수 있는지를 앞에 둔다.
 */
const RIGHTS = [
  { what: '내려받기', how: '저장된 개인정보 전체를 한 번에 받아 보실 수 있습니다.' },
  { what: '동의 관리', how: '항목별로 켜고 끌 수 있습니다. 언제 무엇에 동의했는지 이력도 남습니다.' },
  {
    what: '탈퇴',
    how: '식별 정보를 지우고 계정을 닫습니다. 탈퇴한 계정으로는 로그인되지 않습니다.',
  },
] as const

export function Month60(): ReactNode {
  return (
    <Station id="m60" month={60}>
      <StationHead
        id="m60"
        month={60}
        title={
          <>
            다섯 해치 기록은
            <br />
            부모의 것입니다
          </>
        }
      >
        <p>
          이 서비스는 아이의 진단명과 처방까지 다룹니다. 법이 민감정보로 정한 항목이고, 일반
          개인정보와 같은 동의로 처리할 수 없습니다. 목록에 없는 항목은 받지 않고, 쓰임이 없어진
          항목은 지웁니다.
        </p>
      </StationHead>

      <dl className="yr-rows yr-rows--wide">
        {RIGHTS.map((r) => (
          <div className="yr-rows__row" key={r.what} data-in="">
            <dt>{r.what}</dt>
            <dd>{r.how}</dd>
          </div>
        ))}
      </dl>
      <p className="yr-fine" data-in="">
        <Link href="/trust">받는 항목과 그 이유 전체 보기</Link>
      </p>
    </Station>
  )
}
