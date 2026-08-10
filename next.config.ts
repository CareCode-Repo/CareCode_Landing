import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /*
   * 소개 사이트는 서버가 할 일이 없다. 정적 파일로 뽑아 어디든 올릴 수 있게 한다.
   * 앱(CareCode_FE)과 별개로 배포되므로 서버 런타임을 끌고 다닐 이유가 없다.
   */
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}

export default nextConfig
