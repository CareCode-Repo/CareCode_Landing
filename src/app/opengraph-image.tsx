import { ImageResponse } from 'next/og'
import { SITE_NAME, SITE_TAGLINE } from '@/content/site'

/**
 * 공유 썸네일.
 *
 * 카카오톡·슬랙에 링크를 붙였을 때 뜨는 그림이다. 사이트를 처음 여는 사람이 보는 첫 화면과
 * 같은 것을 보여 줘야 해서, 모눈 배경과 월령 축을 그대로 옮겼다.
 *
 * 정적 출력이라 빌드 시점에 한 번 그려진다.
 */
/** 정적 출력에서는 이미지 라우트도 빌드 시점에 한 번만 그린다고 명시해야 한다. */
export const dynamic = 'force-static'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`

/** 홈 히어로와 같은 27개월 기준. 부모급여는 지났고 나머지는 유효하다. */
const MONTHS = 27
const AXIS_MAX = 72
const BANDS = [
  { from: 0, to: 23, tone: '#C2453D' },
  { from: 0, to: 71, tone: '#36AA1C' },
  { from: 24, to: 71, tone: '#36AA1C' },
  { from: 0, to: 11, tone: '#A8B2A5' },
]

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#F6F8F3',
          // 모눈 종이
          backgroundImage:
            'linear-gradient(to right, #DCE3D6 1px, transparent 1px), linear-gradient(to bottom, #DCE3D6 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          padding: '72px 80px',
          color: '#1C2620',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              letterSpacing: 4,
              color: '#4A564D',
            }}
          >
            CARECODE · {SITE_NAME}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 28,
              fontSize: 74,
              lineHeight: 1.24,
              letterSpacing: -3,
            }}
          >
            <span>받을 수 있었는데</span>
            <span>몰라서 못 받은 돈</span>
          </div>
        </div>

        {/* 월령 축. 사이트의 시그니처를 그대로 축약했다. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 40 }}>
          {BANDS.map((band, i) => (
            <div key={i} style={{ display: 'flex', width: '100%', height: 26, backgroundColor: '#EEF2E9' }}>
              <div style={{ display: 'flex', width: `${(band.from / AXIS_MAX) * 100}%` }} />
              <div
                style={{
                  display: 'flex',
                  width: `${((band.to - band.from + 1) / AXIS_MAX) * 100}%`,
                  backgroundColor: band.tone,
                }}
              />
            </div>
          ))}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 6,
              fontSize: 20,
              color: '#A8B2A5',
            }}
          >
            <span>0</span>
            <span>12</span>
            <span>24</span>
            <span>36</span>
            <span>48</span>
            <span>60</span>
            <span>72개월</span>
          </div>

          <div style={{ display: 'flex', marginTop: 18, fontSize: 26, color: '#4A564D' }}>
{MONTHS}개월 아이는 지금 3건을 받을 수 있고, 1건은 아직 소급 신청할 수 있습니다
          </div>
        </div>
      </div>
    ),
    size,
  )
}
