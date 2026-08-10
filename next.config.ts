import type { NextConfig } from 'next'

/*
 * GitHub Pages 프로젝트 페이지는 /<저장소명> 아래에 붙는다. basePath 를 주지 않으면
 * CSS·JS 를 루트에서 찾아 전부 404 가 난다. 로컬 개발에서는 루트로 서비스하므로
 * 값을 비워 두고, 배포 워크플로에서만 넣는다.
 *
 * 커스텀 도메인을 붙이면 이 변수를 비우면 된다.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const nextConfig: NextConfig = {
  /*
   * 소개 사이트는 서버가 할 일이 없다. 정적 파일로 뽑아 어디든 올릴 수 있게 한다.
   * 앱(CareCode_FE)과 별개로 배포되므로 서버 런타임을 끌고 다닐 이유가 없다.
   */
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
}

export default nextConfig
