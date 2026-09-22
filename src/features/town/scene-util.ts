/* 동네 장면 공용 유틸 — three.js 장면이 필요로 하는 최소한만 둔다. */
import * as THREE from 'three'

/* 2D 컨텍스트는 이론상 null 이 될 수 있다. 여기서 한 번만 좁힌다. */
export function ctx2d(c: HTMLCanvasElement): CanvasRenderingContext2D {
  const g = c.getContext('2d')
  if (!g) throw new Error('2D 컨텍스트를 만들 수 없습니다')
  return g
}

export function makeCanvas(host: HTMLElement): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.style.display = 'block'
  c.style.width = '100%'
  c.style.height = '100%'
  host.appendChild(c)
  return c
}

export function sizeToHost(
  host: HTMLElement,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
): { w: number; h: number } {
  const r = host.getBoundingClientRect()
  const w = Math.max(1, Math.round(r.width))
  const h = Math.max(1, Math.round(r.height))
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  return { w, h }
}

export function observeResize(host: HTMLElement, fn: () => void): () => void {
  if (typeof ResizeObserver === 'undefined') {
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }
  const ro = new ResizeObserver(fn)
  ro.observe(host)
  return () => ro.disconnect()
}

/*
 * 화면 밖이거나 탭이 숨겨졌으면 루프를 멈춘다.
 * 고정 캔버스라 불투명 구간 뒤에 가려져 있는 동안은 그릴 이유가 없다.
 */
export type LoopGate = {
  setAllowed(v: boolean): void
  dispose(): void
}

export function createLoopGate(onFrame: (dt: number) => void): LoopGate {
  let raf = 0
  let running = false
  let allowed = true
  const timer = new THREE.Timer()

  function tick(now: number) {
    raf = requestAnimationFrame(tick)
    timer.update(now)
    onFrame(Math.min(timer.getDelta(), 0.05))
  }

  function sync() {
    const should = allowed && !document.hidden
    if (should && !running) {
      running = true
      timer.reset()
      raf = requestAnimationFrame(tick)
    } else if (!should && running) {
      running = false
      cancelAnimationFrame(raf)
    }
  }

  document.addEventListener('visibilitychange', sync)
  sync()

  return {
    setAllowed(v: boolean) {
      allowed = v
      sync()
    },
    dispose() {
      allowed = false
      sync()
      document.removeEventListener('visibilitychange', sync)
    },
  }
}

export function disposeObject3D(root: THREE.Object3D): void {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    const m = mesh.material
    if (!m) return
    const list: THREE.Material[] = Array.isArray(m) ? m : [m]
    list.forEach((mat) => {
      for (const k in mat) {
        const v = (mat as unknown as Record<string, unknown>)[k] as THREE.Texture | undefined
        if (v && v.isTexture) v.dispose()
      }
      mat.dispose()
    })
  })
}

/*
 * 창문 텍스처. 벽을 상자 하나로 두고 창을 그림으로 얹는다 — 창마다 메시를 만들면
 * 건물 하나에 수백 번의 드로우콜이 든다.
 * 한 장이 한 층·창 네 칸이다. repeat 로 층수와 폭을 맞춘다.
 */
export function windowTexture(wall: string, glass: string, frame: string): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 128
  const g = ctx2d(c)
  g.fillStyle = wall
  g.fillRect(0, 0, 256, 128)
  for (let i = 0; i < 4; i++) {
    const x = 14 + i * 62
    g.fillStyle = frame
    g.fillRect(x - 3, 30, 42, 64)
    g.fillStyle = glass
    g.fillRect(x, 33, 36, 58)
    /* 유리 위쪽을 조금 밝게 — 하늘이 비친 것처럼 읽힌다 */
    g.fillStyle = 'rgba(255,255,255,0.18)'
    g.fillRect(x, 33, 36, 16)
  }
  /* 층 사이 띠 */
  g.fillStyle = 'rgba(0,0,0,0.06)'
  g.fillRect(0, 122, 256, 6)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

/* 아스팔트·보도처럼 면이 균일하면 CG 로 읽히는 표면에 얹을 잡티 */
export function grainTexture(size: number, base: string, spec: string, amount: number): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = ctx2d(c)
  g.fillStyle = base
  g.fillRect(0, 0, size, size)
  for (let i = 0; i < size * size * amount; i++) {
    g.fillStyle = spec
    g.globalAlpha = 0.05 + Math.random() * 0.16
    g.fillRect(Math.random() * size, Math.random() * size, 1, 1)
  }
  g.globalAlpha = 1
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)

/* 키프레임 사이를 선형으로 이으면 경계에서 뻣뻣하다. 살짝 부드럽게 */
export const smooth = (k: number): number => k * k * (3 - 2 * k)
