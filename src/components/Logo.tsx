import { ReactNode } from 'react'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * 앱 아이콘 + 이름. 그림은 CareCode_FE 의 public/images/app-icon.svg 를 그대로 옮겨 왔다.
 *
 * <img> 의 src 에는 basePath 가 자동으로 붙지 않는다(next/link 와 다르다). GitHub Pages 의
 * 서브경로 배포에서 404 가 나지 않게 직접 붙인다. 이름이 옆에 적혀 있어 그림은 장식이다(alt="").
 */
export default function Logo({ size = 28 }: { size?: number }): ReactNode {
  return (
    <span className="inline-flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- 정적 출력이라 next/image 최적화를 쓸 수 없다 */}
      <img src={`${BASE_PATH}/icon.svg`} alt="" width={size} height={size} style={{ borderRadius: size * 0.22 }} />
      <span className="text-[1.125rem] font-bold tracking-[-0.03em]" style={{ color: 'var(--fg)' }}>
        맘편한
      </span>
    </span>
  )
}
