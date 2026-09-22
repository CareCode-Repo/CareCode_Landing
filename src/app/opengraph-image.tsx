import { ImageResponse } from 'next/og'
import { SITE_NAME, SITE_TAGLINE } from '@/content/site'

/**
 * 공유 썸네일.
 *
 * 카카오톡·슬랙에 링크를 붙였을 때 뜨는 그림이다. 앱과 같은 흰 바탕 · 브랜드 그린으로,
 * 홈 히어로의 문장과 월령 막대(부모급여 · 아동수당 · 양육수당 · 첫만남이용권)를 그대로 옮겼다.
 *
 * 정적 출력이라 빌드 시점에 한 번 그려진다.
 */
/** 정적 출력에서는 이미지 라우트도 빌드 시점에 한 번만 그린다고 명시해야 한다. */
export const dynamic = 'force-static'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`

/** 홈 월령 타임라인의 기본값과 같은 27개월. 부모급여는 지났고 나머지는 유효하다. */
const MONTHS = 27
const AXIS_MAX = 72
const BANDS = [
  { from: 0, to: 23, tone: '#E55656' },
  { from: 0, to: 71, tone: '#4FBE27' },
  { from: 24, to: 71, tone: '#4FBE27' },
  { from: 0, to: 11, tone: '#BDBDBD' },
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
          backgroundColor: '#FFFFFF',
          padding: '72px 80px',
          color: '#212121',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', width: 44, height: 44, borderRadius: 12, backgroundColor: '#4FBE27' }} />
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 700 }}>{SITE_NAME}</div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 34,
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: -3,
            }}
          >
            <span>받을 수 있었는데</span>
            <span style={{ color: '#007300' }}>몰라서 못 받은 돈</span>
          </div>
        </div>

        {/* 월령 막대. 홈의 타임라인을 축약했다. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 36 }}>
          {BANDS.map((band, i) => (
            <div key={i} style={{ display: 'flex', width: '100%', height: 22, borderRadius: 11, backgroundColor: '#F5F5F5' }}>
              <div style={{ display: 'flex', width: `${(band.from / AXIS_MAX) * 100}%` }} />
              <div
                style={{
                  display: 'flex',
                  width: `${((band.to - band.from + 1) / AXIS_MAX) * 100}%`,
                  borderRadius: 11,
                  backgroundColor: band.tone,
                }}
              />
            </div>
          ))}
          <div style={{ display: 'flex', marginTop: 14, fontSize: 26, color: '#616161' }}>
            {MONTHS}개월 아이는 지금 3건을 받을 수 있고, 1건은 아직 소급 신청할 수 있습니다
          </div>
        </div>
      </div>
    ),
    size,
  )
}
