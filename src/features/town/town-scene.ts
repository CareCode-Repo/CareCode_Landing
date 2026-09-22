/*
 * 동네 한 블록 — 아이가 자라는 여섯 해.
 *
 * 이 캔버스는 홈 전체 뒤에 고정되어 있고, 스크롤 진행이 곧 아이의 개월 수다(0 → 72).
 * 개월 수 하나가 세 가지를 동시에 정한다.
 *   1) 계절 — 4월생으로 가정한다. 벚꽃, 초록, 은행잎, 눈이 차례로 지나간다
 *   2) 성장 — 유모차에서 걸음마로, 마지막에는 책가방을 멘다. 태어난 해에 심은 나무도 함께 자란다
 *   3) 시선 — 그 시기에 부모가 드나드는 건물(어린이집·소아과·행정복지센터)로 카메라가 간다
 *
 * 스케일 규약: 1 unit = 1 m. 어른 1.68 m 를 기준으로 전부 잡았다.
 *   빌라 층고 2.9 · 상가 층고 3.4 · 도로 폭 8 · 보도 폭 2.5 · 은행나무 6~7H
 * 이 규약이 없으면 블록 크기가 감으로 정해져 장난감처럼 읽힌다.
 *
 * 카피는 전부 DOM 이다. 캔버스에 글자를 그리지 않으므로 SEO·스크린리더에 손실이 없고,
 * 간판도 색 면으로만 둔다.
 *
 * WebGL2·동작 줄이기 판정은 여기가 아니라 GrowScene 이 import 전에 한다 —
 * 쓰지 않을 사용자에게 three.js 청크를 받게 하지 않기 위해서다.
 */
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import type { TownHandle } from './types'
import {
  clamp01,
  createLoopGate,
  disposeObject3D,
  grainTexture,
  lerp,
  makeCanvas,
  observeResize,
  sizeToHost,
  smooth,
  windowTexture,
} from './scene-util'

const ADULT = 1.68
const MAX_MONTH = 72

/* 달력 월(0 = 1월). 4월생이면 0·12·…·72개월이 전부 봄이고, 6·18개월은 가을이 된다.
   동네가 열리는 구간(출생 · 6 · 18 · 72개월)이 봄과 가을에 앉도록 고른 값이다. */
const BIRTH_CAL_MONTH = 3

/* ------------------------------------------------------------------
   계절 키프레임. at 은 달력 월(0 = 1월 초, 12 = 다음 해 1월 초).
   ------------------------------------------------------------------ */
type Season = {
  at: number
  sky: number
  grass: number
  /** 은행나무 잎 */
  ginkgo: number
  /** 벚나무 — 봄에는 꽃, 여름에는 잎, 가을에는 단풍 */
  cherry: number
  /** 잎의 양. 0 이면 가지만 남는다 */
  canopy: number
  /** 쌓인 눈 */
  snow: number
  /** 태양 고도(rad) */
  sunEl: number
  sunI: number
  sun: number
  ambI: number
}

const SEASONS: Season[] = [
  { at: 0.5, sky: 0xdfe6ec, grass: 0xb3b8a6, ginkgo: 0x8d7b5a, cherry: 0x8d7b5a, canopy: 0.0, snow: 0.92, sunEl: 0.5, sunI: 2.3, sun: 0xfff0dc, ambI: 1.0 },
  { at: 3.4, sky: 0xe3edf1, grass: 0x9dc37c, ginkgo: 0xa9cf6e, cherry: 0xf4c3d3, canopy: 1.0, snow: 0.0, sunEl: 0.85, sunI: 2.7, sun: 0xfff6e8, ambI: 0.85 },
  { at: 6.6, sky: 0xd5e8f2, grass: 0x6aa64e, ginkgo: 0x4f9437, cherry: 0x4c8f35, canopy: 1.08, snow: 0.0, sunEl: 1.05, sunI: 2.95, sun: 0xfffaf0, ambI: 0.8 },
  { at: 9.6, sky: 0xece5d8, grass: 0xb1ad76, ginkgo: 0xf1c230, cherry: 0xd2683a, canopy: 0.95, snow: 0.0, sunEl: 0.72, sunI: 2.6, sun: 0xffe7c4, ambI: 0.85 },
  { at: 11.3, sky: 0xe2e3e0, grass: 0xa9ab8c, ginkgo: 0xd8b24a, cherry: 0xa4643e, canopy: 0.25, snow: 0.2, sunEl: 0.55, sunI: 2.4, sun: 0xfff0dc, ambI: 0.95 },
]

function seasonAt(m: number): { a: Season; b: Season; k: number } {
  let cal = (((BIRTH_CAL_MONTH + m) % 12) + 12) % 12
  const first = SEASONS[0]
  const wrap = { ...first, at: first.at + 12 }
  const keys = [...SEASONS, wrap]
  if (cal < first.at) cal += 12
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]
    const b = keys[i + 1]
    if (cal >= a.at && cal <= b.at) return { a, b, k: smooth((cal - a.at) / (b.at - a.at)) }
  }
  return { a: first, b: first, k: 0 }
}

/* ------------------------------------------------------------------
   개월 수 키프레임 — 가족이 서 있는 곳과 카메라가 보는 곳.
   구간 사이에서 smoothstep 으로 이으므로, 도장에 찍힌 개월 수에서 가족이 "도착"한다.
   ------------------------------------------------------------------ */
type Place = 'home' | 'daycare' | 'tree' | 'clinic' | 'center' | 'town'

type Beat = { m: number; at: [number, number]; look: [number, number]; dist: number; focus: Place }

/* 좌표는 아래 배치(PLACES)와 같은 동네 지도를 본다. 가족은 보도(±4.9) 위를 걷는다. */
const BEATS: Beat[] = [
  { m: 0, at: [-26, -5.2], look: [-20, -8], dist: 92, focus: 'home' },
  { m: 6, at: [15, -5.2], look: [13, -10], dist: 74, focus: 'daycare' },
  { m: 12, at: [11.5, 11.5], look: [13, 12], dist: 70, focus: 'tree' },
  { m: 18, at: [-11.5, -5.2], look: [-10, -9], dist: 72, focus: 'clinic' },
  { m: 24, at: [-5.2, 14], look: [-11, 12], dist: 76, focus: 'center' },
  { m: 36, at: [17, -5.2], look: [13, -10], dist: 80, focus: 'daycare' },
  { m: 48, at: [18, 12], look: [9, 8], dist: 90, focus: 'tree' },
  { m: 60, at: [5.2, 9], look: [0, 0], dist: 104, focus: 'town' },
  { m: 72, at: [-24, -5.2], look: [-4, -2], dist: 122, focus: 'town' },
]

function beatAt(m: number): { a: Beat; b: Beat; k: number } {
  if (m <= BEATS[0].m) return { a: BEATS[0], b: BEATS[0], k: 0 }
  const last = BEATS[BEATS.length - 1]
  if (m >= last.m) return { a: last, b: last, k: 0 }
  for (let i = 0; i < BEATS.length - 1; i++) {
    const a = BEATS[i]
    const b = BEATS[i + 1]
    if (m >= a.m && m <= b.m) return { a, b, k: smooth((m - a.m) / (b.m - a.m)) }
  }
  return { a: last, b: last, k: 0 }
}

/* 아이 키(m). 0개월 0.5 m 에서 72개월 1.16 m. 초기에 빨리 크는 모양을 제곱근으로 흉내 낸다.
   화면에 숫자로 내보내는 값이 아니라 크기 비례만 맞춘 것이다. */
const childHeight = (m: number): number => 0.5 + 0.66 * Math.sqrt(clamp01(m / MAX_MONTH))

/* ------------------------------------------------------------------
   동네 지도. 도로 두 개가 가운데서 만난다(x 축 도로 z=0, z 축 도로 x=0, 폭 8).
   카메라가 +x+z 쪽에서 내려다보므로 건물의 정면은 +z 또는 +x 를 향해야 보인다.
   그래서 네 블록 중 가장 가까운 남동쪽(+x+z)은 낮은 공원으로 비워 둔다.
   ------------------------------------------------------------------ */
const PLACES = {
  home: { x: -26, z: -12, w: 12, d: 10 },
  clinic: { x: -11.5, z: -11.5, w: 9, d: 9 },
  daycare: { x: 15, z: -14, w: 14, d: 9 },
  center: { x: -14, z: 14, w: 12, d: 12 },
  park: { x: 15, z: 15 },
} as const

export function mount(host: HTMLElement): TownHandle {
  const canvas = makeCanvas(host)
  const W0 = host.getBoundingClientRect().width
  const TIER = W0 >= 1280 ? 'high' : W0 >= 900 ? 'mid' : 'low'

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, TIER === 'high' ? 2 : 1.5))
  renderer.shadowMap.enabled = true
  /* r18x 부터 PCFSoftShadowMap 은 없어졌고 PCFShadowMap 이 부드러운 쪽을 맡는다 */
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  /* 종이색 지면 위에 앉는 장면이라 한낮에도 하얗게 뜨지 않게 조금 누른다 */
  renderer.toneMappingExposure = 0.96

  const scene = new THREE.Scene()
  const skyColor = new THREE.Color(SEASONS[1].sky)
  scene.background = skyColor
  const fog = new THREE.Fog(SEASONS[1].sky, 150, 330)
  scene.fog = fog

  /* ---------------- 카메라 ----------------
     망원 원근(fov 24)이 아이소메트릭 느낌을 지키면서 사람이 사람 크기로 읽힌다.
     순수 직교는 도면처럼 납작해진다. */
  const camera = new THREE.PerspectiveCamera(24, 1, 8, 520)
  const UP = new THREE.Vector3(0, 1, 0)
  const CAM_DIR = new THREE.Vector3(0.62, 0.72, 0.86).normalize()
  /* 카피가 왼쪽에 앉는 넓은 화면에서는 피사체를 오른쪽으로 민다(거리에 대한 비율) */
  let panRatio = 0
  /* 좁은 화면은 종이 판이 아래쪽을 덮으므로 피사체를 위로 올린다(화면 높이에 대한 비율) */
  let liftRatio = 0
  /* 세로로 긴 화면은 가로 시야가 좁아 같은 거리에서 건물만 꽉 찬다. 거리를 늘려 동네 폭을 맞춘다 */
  let distScale = 1
  const HALF_FOV = THREE.MathUtils.degToRad(12)
  const camDir = new THREE.Vector3()
  const camRight = new THREE.Vector3()
  const camUp = new THREE.Vector3()
  const camAt = new THREE.Vector3()

  function placeCamera(look: THREE.Vector3, baseDist: number, orbit: number) {
    const dist = baseDist * distScale
    camDir.copy(CAM_DIR).applyAxisAngle(UP, orbit)
    camRight.crossVectors(UP, camDir).normalize()
    camUp.crossVectors(camDir, camRight).normalize()
    /* 보는 점을 왼쪽·아래로 옮기면 피사체가 화면 오른쪽·위에 앉는다 */
    camAt
      .copy(look)
      .addScaledVector(camRight, -dist * panRatio)
      .addScaledVector(camUp, -2 * dist * Math.tan(HALF_FOV) * liftRatio)
    camera.position.copy(camAt).addScaledVector(camDir, dist)
    camera.lookAt(camAt)
  }

  /* ---------------- 조명 ---------------- */
  const hemi = new THREE.HemisphereLight(0xdfeaf2, 0x8a8a70, 0.85)
  scene.add(hemi)

  const sun = new THREE.DirectionalLight(0xfff6e8, 2.7)
  sun.castShadow = true
  const SM = TIER === 'high' ? 2048 : TIER === 'mid' ? 1536 : 1024
  sun.shadow.mapSize.set(SM, SM)
  const S = 58
  sun.shadow.camera.left = -S
  sun.shadow.camera.right = S
  sun.shadow.camera.top = S
  sun.shadow.camera.bottom = -S
  sun.shadow.camera.near = 20
  sun.shadow.camera.far = 260
  sun.shadow.bias = -0.0008
  sun.shadow.normalBias = 0.04
  /* 그림자는 매 프레임 다시 구울 이유가 없다. 태양은 계절이 바뀔 때만 움직이고,
     움직이는 것은 사람과 차 정도다. 자동 갱신을 끄고 필요할 때만 올린다. */
  sun.shadow.autoUpdate = false
  sun.shadow.needsUpdate = true
  sun.target.position.set(0, 0, 0)
  scene.add(sun, sun.target)

  const world = new THREE.Group()
  scene.add(world)

  /* ================================================================
     지면 · 도로 · 보도
     ================================================================ */
  const grassMat = new THREE.MeshStandardMaterial({ color: SEASONS[1].grass, roughness: 1 })
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), grassMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  world.add(ground)

  const asphaltTex = grainTexture(256, '#62666b', '#2a2d30', 0.4)
  asphaltTex.repeat.set(30, 2)
  const asphaltMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: asphaltTex, roughness: 0.95 })
  const asphaltBase = new THREE.Color(0xffffff)

  const roadX = new THREE.Mesh(new THREE.PlaneGeometry(220, 8), asphaltMat)
  roadX.rotation.x = -Math.PI / 2
  roadX.position.y = 0.02
  roadX.receiveShadow = true
  const roadZ = new THREE.Mesh(new THREE.PlaneGeometry(8, 220), asphaltMat)
  roadZ.rotation.x = -Math.PI / 2
  roadZ.position.y = 0.021
  roadZ.receiveShadow = true
  world.add(roadX, roadZ)

  const walkTex = grainTexture(128, '#d2d5cd', '#9aa096', 0.3)
  walkTex.repeat.set(20, 1)
  const walkMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: walkTex, roughness: 0.95 })
  const walkBase = new THREE.Color(0xffffff)
  /* 보도는 교차로에서 끊긴다. 네 방향 × 양쪽 = 여덟 조각 */
  const WALK_LEN = 100
  for (const side of [-1, 1]) {
    for (const half of [-1, 1]) {
      const cx = half * (4 + WALK_LEN / 2)
      const a = new THREE.Mesh(new THREE.BoxGeometry(WALK_LEN, 0.16, 2.5), walkMat)
      a.position.set(cx, 0.08, side * 5.25)
      const b = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.16, WALK_LEN), walkMat)
      b.position.set(side * 5.25, 0.08, cx)
      a.receiveShadow = b.receiveShadow = true
      world.add(a, b)
    }
  }

  /* 중앙선(노란 겹선)과 횡단보도. 막대 하나하나를 메시로 만들면 드로우콜이 수십 개라 인스턴스로 */
  const lineGeo = new THREE.BoxGeometry(1, 0.02, 1)
  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xe6c24a, roughness: 0.7 })
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf1f2ed, roughness: 0.7 })
  const tmpM = new THREE.Matrix4()
  const tmpQ = new THREE.Quaternion()
  const tmpP = new THREE.Vector3()
  const tmpS = new THREE.Vector3()

  {
    const centers: [number, number, number, number][] = [] // x, z, sx, sz
    for (const half of [-1, 1]) {
      for (const off of [-0.12, 0.12]) {
        centers.push([half * 57, off, 100, 0.12])
        centers.push([off, half * 57, 0.12, 100])
      }
    }
    const yellow = new THREE.InstancedMesh(lineGeo, yellowMat, centers.length)
    centers.forEach(([x, z, sx, sz], i) => {
      tmpM.compose(tmpP.set(x, 0.035, z), tmpQ.identity(), tmpS.set(sx, 1, sz))
      yellow.setMatrixAt(i, tmpM)
    })
    world.add(yellow)

    const stripes: [number, number, number, number][] = []
    for (const side of [-1, 1]) {
      for (let s = -3.25; s <= 3.3; s += 1.08) {
        stripes.push([side * 8.2, s, 3.0, 0.5]) // x 축 도로를 건너는 횡단보도
        stripes.push([s, side * 8.2, 0.5, 3.0]) // z 축 도로를 건너는 횡단보도
      }
    }
    const zebra = new THREE.InstancedMesh(lineGeo, whiteMat, stripes.length)
    stripes.forEach(([x, z, sx, sz], i) => {
      tmpM.compose(tmpP.set(x, 0.035, z), tmpQ.identity(), tmpS.set(sx, 1, sz))
      zebra.setMatrixAt(i, tmpM)
    })
    zebra.receiveShadow = true
    world.add(zebra)
  }

  /* ================================================================
     건물 — 벽은 상자 하나, 창은 텍스처. 옥상은 공용 재질이라 눈이 한 번에 쌓인다.
     ================================================================ */
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xb8b3a8, roughness: 0.95 })
  const roofBase = new THREE.Color(0xb8b3a8)

  type Spec = {
    x: number
    z: number
    w: number
    d: number
    floors: number
    floorH: number
    wall: string
    glass?: string
    frame?: string
    trim?: number
    /** 1층을 상가 유리로 */
    shopfront?: string
  }

  /*
   * 벽 상자. BoxGeometry 는 면마다 그룹이 따로라 재질 배열을 주면 상자 하나에 드로우콜이
   * 여섯 번 든다. 창 반복은 텍스처 repeat 대신 면별 UV 로 넣고, 인덱스를 [옆면 넷 | 윗·아랫면]
   * 순서로 다시 묶어 재질 두 개(벽 · 옥상)로 그린다.
   * 면 순서는 +x, -x, +y, -y, +z, -z 이고 면마다 정점 4개 · 인덱스 6개다.
   */
  function wallBox(w: number, h: number, d: number, floors: number): THREE.BoxGeometry {
    const geo = new THREE.BoxGeometry(w, h, d)
    const uv = geo.attributes.uv
    const across = [d, d, w, w, w, w] // 면의 가로 길이(m)
    for (let face = 0; face < 6; face++) {
      const ru = Math.max(1, Math.round(across[face] / 9))
      const rv = face === 2 || face === 3 ? 1 : floors
      for (let v = face * 4; v < face * 4 + 4; v++) uv.setXY(v, uv.getX(v) * ru, uv.getY(v) * rv)
    }
    const idx = Array.from(geo.index!.array)
    const face = (f: number) => idx.slice(f * 6, f * 6 + 6)
    geo.setIndex([...face(0), ...face(1), ...face(4), ...face(5), ...face(2), ...face(3)])
    geo.clearGroups()
    geo.addGroup(0, 24, 0)
    geo.addGroup(24, 12, 1)
    return geo
  }

  const wallMats = new Map<string, THREE.MeshStandardMaterial>()
  function wallMaterial(wall: string, glass: string, frame: string): THREE.MeshStandardMaterial {
    const key = `${wall}|${glass}|${frame}`
    let m = wallMats.get(key)
    if (!m) {
      m = new THREE.MeshStandardMaterial({ map: windowTexture(wall, glass, frame), roughness: 0.9 })
      wallMats.set(key, m)
    }
    return m
  }

  function building(s: Spec): THREE.Group {
    const g = new THREE.Group()
    const base = s.shopfront ? s.floorH : 0
    const upper = s.shopfront ? s.floors - 1 : s.floors
    const walls = wallMaterial(s.wall, s.glass ?? '#7f95a6', s.frame ?? '#cfc6b4')

    if (upper > 0) {
      const h = upper * s.floorH
      const body = new THREE.Mesh(wallBox(s.w, h, s.d, upper), [walls, roofMat])
      body.position.set(s.x, base + h / 2, s.z)
      body.castShadow = body.receiveShadow = true
      g.add(body)
    }

    if (s.shopfront) {
      const shop = wallMaterial(s.shopfront, '#3f5868', '#2f3b44')
      const storefront = new THREE.Mesh(wallBox(s.w - 0.3, s.floorH, s.d - 0.3, 1), [shop, roofMat])
      storefront.position.set(s.x, s.floorH / 2, s.z)
      storefront.castShadow = storefront.receiveShadow = true
      g.add(storefront)
    }

    /* 난간. 윗면은 옥상 재질이라 눈이 같이 쌓인다 */
    const top = s.floors * s.floorH
    const trimMat = new THREE.MeshStandardMaterial({ color: s.trim ?? new THREE.Color(s.wall).multiplyScalar(0.9), roughness: 0.9 })
    const parapet = new THREE.Mesh(wallBox(s.w + 0.3, 0.55, s.d + 0.3, 1), [trimMat, roofMat])
    parapet.position.set(s.x, top + 0.27, s.z)
    parapet.castShadow = true
    g.add(parapet)

    /* 옥상 설비 한 덩이 — 평평한 옥상은 비어 있으면 모형처럼 보인다 */
    const box = new THREE.Mesh(new THREE.BoxGeometry(Math.min(3, s.w * 0.25), 1.2, 2), roofMat)
    box.position.set(s.x - s.w * 0.22, top + 1.1, s.z - s.d * 0.15)
    box.castShadow = true
    g.add(box)

    world.add(g)
    return g
  }

  /* 간판. 글자는 그리지 않는다 — 색 면이 무엇의 간판인지는 DOM 카피가 말한다 */
  function sign(x: number, y: number, z: number, w: number, h: number, color: number, faceX = false) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(faceX ? 0.18 : w, h, faceX ? w : 0.18),
      new THREE.MeshStandardMaterial({ color, roughness: 0.6 }),
    )
    m.position.set(x, y, z)
    m.castShadow = true
    world.add(m)
  }

  const SEAL = 0x36aa1c
  const STAMP = 0xc2453d

  // 집 — 4층 빌라. 정면(+z)이 보도를 본다
  const P = PLACES
  building({ ...P.home, floors: 4, floorH: 2.9, wall: '#ebe2d2', frame: '#cdbfa6' })
  sign(P.home.x, 1.1, P.home.z + P.home.d / 2 + 0.1, 2.2, 2.2, 0x8a7d66) // 현관문
  {
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, 1.4), roofMat)
    canopy.position.set(P.home.x, 2.3, P.home.z + P.home.d / 2 + 0.7)
    canopy.castShadow = true
    world.add(canopy)
  }

  // 소아청소년과가 든 모퉁이 상가 — 1층 유리, 2층 간판
  building({ ...P.clinic, floors: 3, floorH: 3.4, wall: '#f1efe9', frame: '#c9ccc6', shopfront: '#e7e9e4' })
  sign(P.clinic.x, 4.6, P.clinic.z + P.clinic.d / 2 + 0.1, 6.5, 1.1, 0xffffff)
  sign(P.clinic.x - 2.6, 4.6, P.clinic.z + P.clinic.d / 2 + 0.22, 1.0, 0.8, SEAL)
  sign(P.clinic.x + P.clinic.w / 2 + 0.1, 4.6, P.clinic.z, 5, 1.1, 0xffffff, true)

  // 어린이집 — 2층, 초록 띠, 앞마당과 울타리
  building({ ...P.daycare, floors: 2, floorH: 3.2, wall: '#f6f0e3', frame: '#e3cf9c', trim: SEAL })
  sign(P.daycare.x - 3, 5.2, P.daycare.z + P.daycare.d / 2 + 0.1, 4.2, 0.9, 0xf2b93c)
  {
    const yardZ0 = P.daycare.z + P.daycare.d / 2 // 건물 앞면
    const yardZ1 = -6.8 // 울타리
    const x0 = P.daycare.x - P.daycare.w / 2
    const x1 = P.daycare.x + P.daycare.w / 2
    const posts: [number, number][] = []
    for (let x = x0; x <= x1 + 0.01; x += 1.2) if (Math.abs(x - P.daycare.x) > 1.1) posts.push([x, yardZ1])
    for (let z = yardZ0; z <= yardZ1; z += 1.2) {
      posts.push([x0, z])
      posts.push([x1, z])
    }
    const postMat = new THREE.MeshStandardMaterial({ color: 0xf4f1e8, roughness: 0.8 })
    const fence = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, 1.0, 0.1), postMat, posts.length)
    posts.forEach(([x, z], i) => {
      tmpM.compose(tmpP.set(x, 0.5, z), tmpQ.identity(), tmpS.set(1, 1, 1))
      fence.setMatrixAt(i, tmpM)
    })
    fence.castShadow = true
    world.add(fence)
    const rail = new THREE.Mesh(new THREE.BoxGeometry(P.daycare.w, 0.08, 0.08), postMat)
    rail.position.set(P.daycare.x, 0.95, yardZ1)
    world.add(rail)

    /* 미끄럼틀 — 노랑 발판, 빨강 활주면 */
    const slideBase = new THREE.Mesh(new RoundedBoxGeometry(1.2, 1.4, 1.2, 2, 0.08), new THREE.MeshStandardMaterial({ color: 0xf2b93c, roughness: 0.6 }))
    slideBase.position.set(P.daycare.x + 3.8, 0.7, yardZ0 + 1.2)
    const slide = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 2.2), new THREE.MeshStandardMaterial({ color: STAMP, roughness: 0.5 }))
    slide.position.set(P.daycare.x + 3.8, 0.75, yardZ0 + 2.5)
    slide.rotation.x = 0.55
    const sandbox = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 1.4), new THREE.MeshStandardMaterial({ color: 0xe0cfa6, roughness: 1 }))
    sandbox.position.set(P.daycare.x - 3.5, 0.12, yardZ0 + 1.4)
    for (const m of [slideBase, slide, sandbox]) {
      m.castShadow = m.receiveShadow = true
      world.add(m)
    }
  }

  // 행정복지센터 — 정면(+x)이 z 축 도로를 본다. 국기 게양대
  building({ ...P.center, floors: 2, floorH: 3.6, wall: '#e2ddd2', glass: '#6f8796', frame: '#b8b1a2', trim: 0x9f988a })
  sign(P.center.x + P.center.w / 2 + 0.1, 5.6, P.center.z, 5.5, 0.9, 0x2f5f8f, true)
  {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 8.5, 8), new THREE.MeshStandardMaterial({ color: 0xd7d9d6, metalness: 0.4, roughness: 0.4 }))
    pole.position.set(-7.2, 4.25, 8.4)
    pole.castShadow = true
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0), new THREE.MeshStandardMaterial({ color: 0xf6f6f2, side: THREE.DoubleSide, roughness: 0.8 }))
    flag.position.set(-6.45, 7.9, 8.4)
    flag.castShadow = true
    world.add(pole, flag)
  }

  // 배경 아파트와 상가 — 뒤쪽(-z)과 왼쪽(-x)에만 둔다. 앞에 두면 주인공 건물을 가린다
  const FILLER: Spec[] = [
    { x: -30, z: -36, w: 16, d: 10, floors: 12, floorH: 2.9, wall: '#e6e4df' },
    { x: -6, z: -38, w: 12, d: 10, floors: 9, floorH: 2.9, wall: '#dcdfdb' },
    { x: 16, z: -36, w: 14, d: 10, floors: 14, floorH: 2.9, wall: '#ece7dc' },
    { x: 40, z: -32, w: 12, d: 10, floors: 8, floorH: 2.9, wall: '#e2e4e0' },
    { x: 40, z: -14, w: 10, d: 10, floors: 4, floorH: 3.1, wall: '#efe8dc', shopfront: '#e4e1d8' },
    { x: -48, z: -12, w: 10, d: 12, floors: 5, floorH: 2.9, wall: '#e9e3d6' },
    { x: -48, z: 16, w: 10, d: 12, floors: 4, floorH: 3.0, wall: '#dfe1dc' },
    { x: -28, z: 32, w: 12, d: 10, floors: 3, floorH: 3.2, wall: '#ece6da', shopfront: '#e2dfd6' },
  ]
  FILLER.forEach((s) => building(s))

  /* ================================================================
     나무 — 은행나무 가로수, 공원의 벚나무, 그리고 태어난 해에 심은 한 그루
     ================================================================ */
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b5a48, roughness: 1 })
  const ginkgoMat = new THREE.MeshStandardMaterial({ color: SEASONS[1].ginkgo, roughness: 0.9 })
  const cherryMat = new THREE.MeshStandardMaterial({ color: SEASONS[1].cherry, roughness: 0.9 })

  type Tree = { x: number; z: number; h: number; r: number }

  const ginkgoSpots: Tree[] = []
  for (const side of [-1, 1]) {
    for (let d = 10; d <= 46; d += 6) {
      for (const half of [-1, 1]) {
        const jitter = ((d * 7 + side * 3 + half) % 5) * 0.12
        ginkgoSpots.push({ x: half * d, z: side * 6.1, h: 6.2 + jitter, r: 1.5 })
        ginkgoSpots.push({ x: side * 6.1, z: half * d, h: 6.0 + jitter, r: 1.45 })
      }
    }
  }

  const cherrySpots: Tree[] = []
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.3
    cherrySpots.push({ x: P.park.x + Math.cos(a) * 9.5, z: P.park.z + Math.sin(a) * 9.5, h: 4.6, r: 2.0 })
  }
  cherrySpots.push({ x: -21, z: 23, h: 4.4, r: 1.9 }, { x: -24, z: 8.5, h: 4.2, r: 1.8 })

  const trunkGeo = new THREE.CylinderGeometry(0.16, 0.24, 1, 7)
  trunkGeo.translate(0, 0.5, 0)
  /* 은행나무는 원뿔, 벚나무는 넓게 퍼진 구 — 실루엣만으로 종이 갈린다 */
  const ginkgoGeo = new THREE.ConeGeometry(1, 1, 9)
  ginkgoGeo.translate(0, 0.5, 0)
  const cherryGeo = new THREE.IcosahedronGeometry(1, 1)
  cherryGeo.scale(1, 0.72, 1)

  const trees = [...ginkgoSpots, ...cherrySpots]
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, trees.length)
  trees.forEach((t, i) => {
    tmpM.compose(tmpP.set(t.x, 0, t.z), tmpQ.identity(), tmpS.set(1, t.h * 0.55, 1))
    trunks.setMatrixAt(i, tmpM)
  })
  trunks.castShadow = true
  const ginkgoCanopy = new THREE.InstancedMesh(ginkgoGeo, ginkgoMat, ginkgoSpots.length)
  const cherryCanopy = new THREE.InstancedMesh(cherryGeo, cherryMat, cherrySpots.length)
  ginkgoCanopy.castShadow = cherryCanopy.castShadow = true
  world.add(trunks, ginkgoCanopy, cherryCanopy)

  function layoutCanopies(amount: number) {
    ginkgoSpots.forEach((t, i) => {
      const s = Math.max(0.0001, amount)
      tmpM.compose(tmpP.set(t.x, t.h * 0.35, t.z), tmpQ.identity(), tmpS.set(t.r * s, t.h * 0.7 * s, t.r * s))
      ginkgoCanopy.setMatrixAt(i, tmpM)
    })
    cherrySpots.forEach((t, i) => {
      const s = Math.max(0.0001, amount)
      tmpM.compose(tmpP.set(t.x, t.h * 0.72, t.z), tmpQ.identity(), tmpS.set(t.r * s, t.r * s, t.r * s))
      cherryCanopy.setMatrixAt(i, tmpM)
    })
    ginkgoCanopy.instanceMatrix.needsUpdate = true
    cherryCanopy.instanceMatrix.needsUpdate = true
  }

  /* 태어난 해에 심은 벚나무. 공원 가운데, 산책로가 둘러싼다.
     4월생이라 해마다 생일 무렵에 꽃이 핀다. */
  const pathRing = new THREE.Mesh(
    new THREE.RingGeometry(4.6, 6.0, 48),
    new THREE.MeshStandardMaterial({ color: 0xdccfb3, roughness: 1 }),
  )
  pathRing.rotation.x = -Math.PI / 2
  pathRing.position.set(P.park.x, 0.03, P.park.z)
  pathRing.receiveShadow = true
  world.add(pathRing)

  const benchMat = new THREE.MeshStandardMaterial({ color: 0x8c6a4a, roughness: 0.8 })
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.9
    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.5), benchMat)
    bench.position.set(P.park.x + Math.cos(a) * 6.8, 0.23, P.park.z + Math.sin(a) * 6.8)
    bench.rotation.y = -a + Math.PI / 2
    bench.castShadow = true
    world.add(bench)
  }

  const birthTree = new THREE.Group()
  const btTrunk = new THREE.Mesh(trunkGeo, trunkMat)
  btTrunk.scale.set(1.1, 2.6, 1.1)
  const btCanopy = new THREE.Mesh(cherryGeo, cherryMat)
  btCanopy.position.y = 3.0
  btCanopy.scale.setScalar(1.9)
  btTrunk.castShadow = btCanopy.castShadow = true
  birthTree.add(btTrunk, btCanopy)
  birthTree.position.set(P.park.x, 0, P.park.z)
  world.add(birthTree)

  /* ================================================================
     사람과 차 — 동네가 살아 있다는 가장 싼 증거
     ================================================================ */
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe8c4a2, roughness: 0.8 })

  function person(shirt: number, pants: number, headRatio: number): THREE.Group {
    /* 키 1 기준으로 만들고 바깥에서 키만큼 늘린다. 아이는 머리 비율이 크다 */
    const g = new THREE.Group()
    const legs = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.38, 4, 8), new THREE.MeshStandardMaterial({ color: pants, roughness: 0.9 }))
    legs.position.y = 0.26
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.26, 4, 8), new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.85 }))
    body.position.y = 0.62
    const head = new THREE.Mesh(new THREE.SphereGeometry(headRatio, 14, 10), skinMat)
    head.position.y = 0.86 + headRatio * 0.5
    for (const m of [legs, body, head]) m.castShadow = true
    g.add(legs, body, head)
    return g
  }

  const family = new THREE.Group()
  const parent = person(0x3f6f8f, 0x39424c, 0.075)
  parent.scale.setScalar(ADULT)
  const child = person(0xf2b93c, 0x5d6f86, 0.11)
  child.position.set(0.55, 0, 0.1)
  /* 책가방 — 취학을 앞둔 해에만 멘다 */
  const backpack = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.24, 0.12, 2, 0.03), new THREE.MeshStandardMaterial({ color: STAMP, roughness: 0.6 }))
  backpack.position.set(0, 0.64, -0.14)
  backpack.castShadow = true
  child.add(backpack)

  const stroller = new THREE.Group()
  {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x2f3439, roughness: 0.6, metalness: 0.3 })
    const basket = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.36, 0.78, 2, 0.08), new THREE.MeshStandardMaterial({ color: 0x9fb8a2, roughness: 0.8 }))
    basket.position.set(0, 0.62, 0)
    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), basket.material)
    hood.position.set(0, 0.78, -0.2)
    hood.rotation.x = -0.4
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 0.04), frameMat)
    handle.position.set(0, 1.02, -0.62)
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.6), frameMat)
    bar.position.set(0, 0.84, -0.42)
    bar.rotation.x = 0.7
    stroller.add(basket, hood, handle, bar)
    const wheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 12)
    wheelGeo.rotateZ(Math.PI / 2)
    for (const [x, z] of [[-0.24, -0.28], [0.24, -0.28], [-0.24, 0.3], [0.24, 0.3]] as const) {
      const w = new THREE.Mesh(wheelGeo, frameMat)
      w.position.set(x, 0.12, z)
      stroller.add(w)
    }
    stroller.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true
    })
    stroller.position.set(0, 0, 0.95)
  }

  family.add(parent, child, stroller)
  world.add(family)

  /* 지나가는 사람들 — 인스턴스 둘(몸·머리)로 그린다 */
  type Walker = { axis: 'x' | 'z'; lane: number; start: number; speed: number; h: number }
  const WALKERS: Walker[] = []
  for (let i = 0; i < 16; i++) {
    const axis = i % 2 === 0 ? 'x' : 'z'
    const lane = (i % 4 < 2 ? -1 : 1) * 4.7
    WALKERS.push({ axis, lane, start: ((i * 37) % 100) - 50, speed: (i % 3 === 0 ? -1 : 1) * (0.9 + (i % 5) * 0.12), h: i % 5 === 0 ? 1.15 : 1.58 + (i % 4) * 0.06 })
  }
  const walkerBody = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.16, 0.6, 4, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }), WALKERS.length)
  const walkerHead = new THREE.InstancedMesh(new THREE.SphereGeometry(0.12, 10, 8), skinMat, WALKERS.length)
  const COATS = [0x5b7fa6, 0xc2453d, 0xe0c068, 0x6f8f5a, 0x8b8f96, 0xe8e2d4, 0x39424c]
  WALKERS.forEach((_, i) => walkerBody.setColorAt(i, new THREE.Color(COATS[i % COATS.length])))
  walkerBody.castShadow = walkerHead.castShadow = true
  world.add(walkerBody, walkerHead)

  /* 차 — 노란 어린이집 차량 한 대를 섞는다 */
  type Car = { g: THREE.Group; axis: 'x' | 'z'; lane: number; dir: 1 | -1; start: number; speed: number }
  const cars: Car[] = []
  const CAR_SPEC: [number, 'x' | 'z', 1 | -1, number, number][] = [
    [0xf2f2ee, 'x', 1, -40, 7],
    [0x3a4450, 'x', -1, 10, 6],
    [0xf2b93c, 'x', 1, 20, 5],
    [0x8d949b, 'z', 1, -20, 6.5],
    [0x2f5f8f, 'z', -1, 35, 5.5],
  ]
  CAR_SPEC.forEach(([color, axis, dir, start, speed]) => {
    const g = new THREE.Group()
    const body = new THREE.Mesh(new RoundedBoxGeometry(4.2, 1.0, 1.8, 2, 0.18), new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.2 }))
    body.position.y = 0.72
    const cabin = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.8, 1.6, 2, 0.16), new THREE.MeshStandardMaterial({ color: 0x33414c, roughness: 0.2, metalness: 0.3 }))
    cabin.position.set(-0.25, 1.5, 0)
    body.castShadow = cabin.castShadow = true
    g.add(body, cabin)
    world.add(g)
    /* 우측 통행 — 진행 방향 오른쪽 차로 */
    const lane = axis === 'x' ? (dir === 1 ? 2 : -2) : dir === 1 ? -2 : 2
    cars.push({ g, axis, lane, dir, start, speed })
  })

  /* ================================================================
     알림 표식 — 그 시기에 부모가 받는 알림이 어느 건물에서 오는지
     ================================================================ */
  type Pin = { g: THREE.Group; mat: THREE.MeshStandardMaterial; y: number; place: Place }
  const pinGeo = new THREE.SphereGeometry(0.55, 18, 12)
  const pinTip = new THREE.ConeGeometry(0.38, 0.9, 14)
  pinTip.rotateX(Math.PI)
  pinTip.translate(0, -0.55, 0)

  function pin(x: number, y: number, z: number, place: Place): Pin {
    const mat = new THREE.MeshStandardMaterial({ color: SEAL, emissive: SEAL, emissiveIntensity: 0.4, roughness: 0.4 })
    const g = new THREE.Group()
    g.add(new THREE.Mesh(pinGeo, mat), new THREE.Mesh(pinTip, mat))
    g.position.set(x, y, z)
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true
    })
    world.add(g)
    return { g, mat, y, place }
  }

  const pins = [
    pin(P.daycare.x, 6.4 + 2.4, P.daycare.z, 'daycare'),
    pin(P.clinic.x, 10.2 + 2.4, P.clinic.z, 'clinic'),
    pin(P.center.x, 7.2 + 2.4, P.center.z, 'center'),
  ]

  /* 개월 수에 따라 어느 알림이 살아 있는가. 페이지 본문이 말하는 서비스와 같은 순서다.
     - 행정복지센터: 부모급여(0–23개월). 끝나기 직전에는 마감 도장색
     - 어린이집: 대기를 거는 무렵부터 유치원으로 넘어가기 전까지
     - 소아과: 접종·검진이 계속 온다 */
  function pinState(place: Place, m: number): { on: number; deadline: boolean } {
    if (place === 'center') return { on: m <= 24 ? 1 : 0.25, deadline: m >= 20 && m <= 24 }
    if (place === 'daycare') return { on: m < 3 ? 0.2 : m <= 40 ? 1 : 0.3, deadline: false }
    return { on: 0.7, deadline: false }
  }

  /* ================================================================
     개월 수 적용
     ================================================================ */
  const cA = new THREE.Color()
  const cB = new THREE.Color()
  const snowColor = new THREE.Color(0xf3f5f7)
  const sealColor = new THREE.Color(SEAL)
  const stampColor = new THREE.Color(STAMP)
  const lookNow = new THREE.Vector3()
  let distNow = 60
  let focusNow: Place = 'home'
  const famFrom = new THREE.Vector3()
  const famTo = new THREE.Vector3()
  let famHeading = 0

  function mix(a: number, b: number, k: number): THREE.Color {
    return cA.set(a).lerp(cB.set(b), k)
  }

  function applyMonth(m: number) {
    /* 계절 */
    const s = seasonAt(m)
    const { a, b, k } = s
    const snow = lerp(a.snow, b.snow, k)

    skyColor.copy(mix(a.sky, b.sky, k))
    fog.color.copy(skyColor)
    hemi.color.copy(skyColor)
    hemi.intensity = lerp(a.ambI, b.ambI, k)
    sun.color.copy(mix(a.sun, b.sun, k))
    sun.intensity = lerp(a.sunI, b.sunI, k)
    const el = lerp(a.sunEl, b.sunEl, k)
    /* 남서쪽 하늘. 그림자가 카메라 쪽(+x)으로 떨어져야 입체가 읽힌다 */
    sun.position.set(-Math.cos(el) * 110, Math.sin(el) * 110, Math.cos(el) * 42)

    grassMat.color.copy(mix(a.grass, b.grass, k)).lerp(snowColor, snow * 0.9)
    roofMat.color.copy(roofBase).lerp(snowColor, snow * 0.95)
    walkMat.color.copy(walkBase).lerp(snowColor, snow * 0.35)
    asphaltMat.color.copy(asphaltBase).lerp(snowColor, snow * 0.12)
    ginkgoMat.color.copy(mix(a.ginkgo, b.ginkgo, k))
    cherryMat.color.copy(mix(a.cherry, b.cherry, k))
    const canopy = lerp(a.canopy, b.canopy, k)
    layoutCanopies(canopy)

    /* 태어난 해의 나무 — 묘목에서 동네 나무 크기로 */
    const grow = clamp01(m / MAX_MONTH)
    birthTree.scale.setScalar(0.32 + grow * 0.68)
    btCanopy.scale.setScalar(1.9 * Math.max(0.0001, canopy))

    /* 가족이 설 곳과 카메라가 볼 곳 */
    const bt = beatAt(m)
    famTo.set(lerp(bt.a.at[0], bt.b.at[0], bt.k), 0.16, lerp(bt.a.at[1], bt.b.at[1], bt.k))
    lookNow.set(lerp(bt.a.look[0], bt.b.look[0], bt.k), 1.5, lerp(bt.a.look[1], bt.b.look[1], bt.k))
    distNow = lerp(bt.a.dist, bt.b.dist, bt.k)
    focusNow = bt.k < 0.5 ? bt.a.focus : bt.b.focus

    /* 아이 — 첫 돌 무렵까지는 유모차, 그다음은 걷는다 */
    const walking = clamp01((m - 11) / 2)
    const h = childHeight(m)
    child.scale.setScalar(h)
    child.visible = walking > 0.02
    stroller.visible = walking < 0.98
    stroller.scale.setScalar(Math.max(0.0001, 1 - walking))
    backpack.visible = m >= 66

    /* 알림 표식 색 — 부모급여가 끝나기 직전에는 도장 빨강 */
    for (const p of pins) {
      const st = pinState(p.place, m)
      const target = st.deadline ? stampColor : sealColor
      p.mat.color.copy(target)
      p.mat.emissive.copy(target)
      p.g.userData.on = st.on
    }

    sun.shadow.needsUpdate = true
  }

  /* ================================================================
     리사이즈 · 루프
     ================================================================ */
  function layout() {
    const r = host.getBoundingClientRect()
    /* 넓은 화면에서만 피사체를 오른쪽으로 민다 — 좁으면 화면 밖으로 나간다.
       값은 probe() 로 주요 건물의 화면 좌표를 재서 맞췄다. */
    panRatio = r.width >= 1080 ? 0.16 : r.width > 900 ? 0.1 : 0
    liftRatio = r.width > 900 ? 0 : 0.2
    const aspect = r.width / Math.max(1, r.height)
    distScale = Math.min(2.2, Math.max(1, 1.15 / aspect))
    sizeToHost(host, renderer, camera)
  }

  let targetMonth = 0
  let shownMonth = -1
  let elapsed = 0
  let shadowTick = 0
  let perfSince = 0
  let perfFrames = 0
  let perfMs = 0
  let perfFps = 0
  let perfJsMs = 0

  function updateWalkers(time: number) {
    WALKERS.forEach((w, i) => {
      const along = ((((w.start + time * w.speed) % 100) + 150) % 100) - 50
      const x = w.axis === 'x' ? along : w.lane
      const z = w.axis === 'x' ? w.lane : along
      const bob = Math.abs(Math.sin(time * 5 + i)) * 0.04
      const heading = w.axis === 'x' ? (w.speed > 0 ? Math.PI / 2 : -Math.PI / 2) : w.speed > 0 ? 0 : Math.PI
      tmpQ.setFromAxisAngle(UP, heading)
      tmpM.compose(tmpP.set(x, 0.16 + w.h * 0.36 + bob, z), tmpQ, tmpS.set(1, w.h / 1.6, 1))
      walkerBody.setMatrixAt(i, tmpM)
      tmpM.compose(tmpP.set(x, 0.16 + w.h * 0.92 + bob, z), tmpQ, tmpS.set(1, 1, 1))
      walkerHead.setMatrixAt(i, tmpM)
    })
    walkerBody.instanceMatrix.needsUpdate = true
    walkerHead.instanceMatrix.needsUpdate = true
  }

  function updateCars(time: number) {
    for (const c of cars) {
      const along = ((((c.start + time * c.speed * c.dir) % 120) + 180) % 120) - 60
      if (c.axis === 'x') {
        c.g.position.set(along, 0, c.lane)
        c.g.rotation.y = c.dir === 1 ? 0 : Math.PI
      } else {
        c.g.position.set(c.lane, 0, along)
        c.g.rotation.y = c.dir === 1 ? -Math.PI / 2 : Math.PI / 2
      }
    }
  }

  const gate = createLoopGate((dt) => {
    elapsed += dt
    const frameStart = performance.now()

    /* 스크롤은 계단처럼 튀기 쉽다. 보이는 개월 수를 목표값으로 부드럽게 끌고 간다.
       가려진 구간을 지나 다시 보일 때는 밀린 계절이 빠르게 지나간다. */
    if (shownMonth < 0) shownMonth = targetMonth
    const diff = targetMonth - shownMonth
    if (Math.abs(diff) > 0.002) {
      shownMonth += diff * (1 - Math.exp(-dt * 4.5))
      applyMonth(shownMonth)
    } else if (shownMonth !== targetMonth) {
      shownMonth = targetMonth
      applyMonth(shownMonth)
    }

    /* 가족은 목표 지점으로 걸어간다 — 순간이동하지 않는다 */
    famFrom.copy(family.position)
    family.position.lerp(famTo, 1 - Math.exp(-dt * 3))
    const moved = famFrom.distanceTo(family.position)
    if (moved > 0.002) {
      famHeading = Math.atan2(family.position.x - famFrom.x, family.position.z - famFrom.z)
    }
    /* 가장 짧은 쪽으로 돈다. 그냥 빼면 ±180° 경계에서 한 바퀴를 크게 돈다 */
    const turn = ((famHeading - family.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI
    family.rotation.y += turn * (1 - Math.exp(-dt * 6))
    const stride = clamp01(moved / (dt * 1.2 + 1e-6))
    parent.position.y = Math.abs(Math.sin(elapsed * 6)) * 0.035 * stride
    child.position.y = Math.abs(Math.sin(elapsed * 7 + 1)) * 0.03 * stride

    /* 알림 표식은 살아 있는 만큼 떠오르고 빛난다 */
    for (const p of pins) {
      const on = (p.g.userData.on as number | undefined) ?? 0.5
      const focus = p.place === focusNow ? 1 : 0
      const glow = on * (0.35 + focus * 0.45) + Math.max(0, Math.sin(elapsed * 2.4)) * 0.25 * focus
      p.mat.emissiveIntensity = glow
      p.g.position.y = p.y + Math.sin(elapsed * 1.6 + p.y) * 0.18 + on * 0.4
      p.g.scale.setScalar(0.85 + on * 0.3 + focus * 0.25)
    }

    updateWalkers(elapsed)
    updateCars(elapsed)

    /* 카메라는 개월 수를 따라 돈다 — 여섯 해 동안 동네를 한 바퀴의 1/5 쯤 */
    placeCamera(lookNow, distNow, (shownMonth / MAX_MONTH) * 0.9 - 0.2)

    /* 사람과 차가 움직이므로 그림자를 가끔 다시 굽는다. 6프레임에 한 번이면 끊겨 보이지 않는다 */
    shadowTick += 1
    if (shadowTick >= 6) {
      sun.shadow.needsUpdate = true
      shadowTick = 0
    }

    renderer.render(scene, camera)

    /* 창 하나 분량의 프레임 통계. stats() 가 이 값을 읽는다 */
    perfMs += performance.now() - frameStart
    perfFrames += 1
    if (frameStart - perfSince >= 1000) {
      perfFps = (perfFrames * 1000) / (frameStart - perfSince)
      perfJsMs = perfMs / Math.max(1, perfFrames)
      perfSince = frameStart
      perfFrames = 0
      perfMs = 0
    }
  })

  const stopResize = observeResize(host, layout)
  layout()
  applyMonth(0)
  family.position.copy(famTo)

  return {
    setMonth(m) {
      targetMonth = Math.min(MAX_MONTH, Math.max(0, m))
    },
    setVisible(v) {
      gate.setAllowed(v)
    },
    probe() {
      const out: Record<string, [number, number]> = {}
      const v = new THREE.Vector3()
      const spots: Record<string, [number, number, number]> = {
        home: [P.home.x, 6, P.home.z],
        clinic: [P.clinic.x, 5, P.clinic.z],
        daycare: [P.daycare.x, 3, P.daycare.z],
        center: [P.center.x, 3.6, P.center.z],
        tree: [P.park.x, 2, P.park.z],
        family: [family.position.x, 1, family.position.z],
      }
      for (const [k, [x, y, z]] of Object.entries(spots)) {
        v.set(x, y, z).project(camera)
        out[k] = [Math.round((v.x * 0.5 + 0.5) * 100), Math.round((0.5 - v.y * 0.5) * 100)]
      }
      return out
    },
    stats() {
      return {
        fps: Math.round(perfFps),
        jsMs: +perfJsMs.toFixed(2),
        drawCalls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        tier: TIER,
        pixelRatio: renderer.getPixelRatio(),
      }
    },
    dispose() {
      gate.dispose()
      stopResize()
      disposeObject3D(world)
      renderer.dispose()
      canvas.remove()
    },
  }
}
