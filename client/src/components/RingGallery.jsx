import { useEffect, useRef, useState } from 'react'
import { imageSize } from '../data/images'
import Section from './Section'

/* ─── Gallery constants ─── */
const VIEWS = ['FLAT', 'TILT', 'RING', 'GALLERY']
const CW    = 160
const CH    = Math.round(CW * (4 / 3))

/* TILT view: rotation and vertical offset per card.
   Values cycle (via modulo) if projects.length exceeds the array length. */
const TILT_ROT_Z  = [-8,  4, -5,  7, -3,  6, -7,  3]
const TILT_OFFS_Y = [20, -10, 30, -20, 15, -30, 10, -15]

const DEG = Math.PI / 180

/* ─── Detect video files by extension ─── */
const isVideo = src => typeof src === 'string' && /\.(mp4|webm|mov)$/i.test(src)

/* ─── Pure target calculator — lives outside component so rAF closure is stable ─── */
function getTarget(i, view, rot, stageW, curRotY, n) {
  const mob   = stageW < 600
  const faceY = Math.round(curRotY / 360) * 360

  if (view === 'RING') {
    const ang  = (360 / n) * i + rot
    const rad  = ang * DEG
    const cosA = Math.cos(rad)
    const sinA = Math.sin(rad)
    const rx   = mob ? 160 : 280
    const rz   = mob ? 80  : 140
    const dep  = (cosA + 1) / 2
    return {
      x: sinA * rx, y: sinA * rx * 0.12, z: cosA * rz,
      rotY: -ang, rotZ: 0, rotX: 0,
      scale: dep * 0.30 + 0.75, opacity: dep * 0.50 + 0.50,
      zIdx: Math.round(dep * 8), depth: dep,
    }
  }

  if (view === 'FLAT') {
    const ang  = (360 / n) * i + rot
    const rad  = ang * DEG
    const cosA = Math.cos(rad)
    const sinA = Math.sin(rad)
    const r    = mob ? 180 : 320
    const dep  = (cosA + 1) / 2
    return {
      x: sinA * r, y: -Math.abs(sinA) * 22, z: 0,
      rotY: faceY, rotZ: 0, rotX: 0,
      scale: 1, opacity: dep * 0.30 + 0.70,
      zIdx: Math.round(dep * 8), depth: dep,
    }
  }

  if (view === 'TILT') {
    const sp    = (mob ? 110 : CW) + (mob ? 14 : 24)
    const tot   = n * sp
    const x     = -(tot / 2) + sp / 2 + i * sp
    const normX = Math.abs(x) / ((stageW || 800) / 2)
    return {
      x, y: TILT_OFFS_Y[i % TILT_OFFS_Y.length], z: 0,
      rotY: faceY, rotZ: TILT_ROT_Z[i % TILT_ROT_Z.length], rotX: 10,
      scale: 1, opacity: Math.max(0.35, 1 - normX * 0.35),
      zIdx: i, depth: 1 - normX,
    }
  }

  /* GALLERY — guard for n ≤ 1 to avoid division by zero */
  const t      = n > 1 ? i / (n - 1) : 0.5
  const arcDeg = (t - 0.5) * 120
  const arcRad = arcDeg * DEG
  const arcR   = mob ? 300 : 520
  return {
    x: Math.sin(arcRad) * arcR,
    y: (-Math.cos(arcRad) + 1) * arcR * 0.12,
    z: 0,
    rotY: faceY, rotZ: arcDeg * 0.25, rotX: 0,
    scale: 1.05, opacity: 1,
    zIdx: i, depth: t,
  }
}

/* ─── ViewButton ─── */
function ViewButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        padding:         '6px 16px',
        border:          active ? '1px solid #AAFF00' : '1px solid #6B6B6B',
        borderRadius:    '9999px',
        backgroundColor: active ? '#AAFF00' : 'transparent',
        color:           '#1C1C1C',
        fontWeight:      600,
        fontSize:        '0.7rem',
        letterSpacing:   '0.06em',
        cursor:          'pointer',
        transition:      'background-color 200ms ease, border-color 200ms ease',
        whiteSpace:      'nowrap',
        fontFamily:      'inherit',
        lineHeight:      1,
        userSelect:      'none',
      }}
    >
      {label}
    </button>
  )
}

/* ─── WorkCard ─── */
function WorkCard({ project, setRef, setVideoRef, onEnter, onLeave, onClick }) {
  const [imgError, setImgError]  = useState(false)

  const firstSrc     = project.images?.[0]
  const firstIsVideo = isVideo(firstSrc)

  return (
    <div
      ref={setRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        position:        'absolute',
        left:            '50%',
        top:             '50%',
        width:           `${CW}px`,
        height:          `${CH}px`,
        marginLeft:      `${-CW / 2}px`,
        marginTop:       `${-CH / 2}px`,
        willChange:      'transform, opacity',
        backgroundColor: '#FAFAFA',
        border:          '1px solid #E4E4E4',
        overflow:        'hidden',
        cursor:          'pointer',
        display:         'flex',
        flexDirection:   'column',
        userSelect:      'none',
      }}
    >
      {/* Thumbnail area */}
      <div
        style={{
          flex:            1,
          backgroundColor: '#EFEFEF',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          pointerEvents:   'none',
          position:        'relative',
          overflow:        'hidden',
        }}
      >
        {!imgError && firstSrc ? (
          firstIsVideo ? (
            <video
              ref={el => { if (setVideoRef) setVideoRef(el) }}
              src={firstSrc}
              autoPlay
              loop
              muted
              playsInline
              onError={() => { setImgError(true); if (setVideoRef) setVideoRef(null) }}
              style={{
                position:       'absolute',
                top:            0,
                left:           0,
                width:          '100%',
                height:         '100%',
                objectFit:      'contain',
                objectPosition: 'center',
                display:        'block',
              }}
            />
          ) : (
            <img
              src={firstSrc}
              alt={`${project.title} 썸네일`}
              loading="lazy"
              decoding="async"
              {...imageSize(firstSrc)}
              onError={() => setImgError(true)}
              style={{
                position:       'absolute',
                top:            0,
                left:           0,
                width:          '100%',
                height:         '100%',
                objectFit:      'contain',
                objectPosition: 'center',
                display:        'block',
              }}
            />
          )
        ) : (
          <span
            style={{
              fontWeight:    700,
              fontSize:      '0.78rem',
              color:         '#1C1C1C',
              opacity:       0.28,
              letterSpacing: '-0.01em',
            }}
          >
            {project.category}
          </span>
        )}
      </div>

      {/* Info bar */}
      <div
        style={{
          padding:         '10px 12px',
          backgroundColor: '#FAFAFA',
          flexShrink:      0,
          pointerEvents:   'none',
        }}
      >
        <p
          style={{
            fontWeight:    600,
            fontSize:      '0.52rem',
            color:         '#6B6B6B',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom:  '4px',
          }}
        >
          {project.category}
        </p>
        <p style={{ fontWeight: 700, fontSize: '0.68rem', color: '#1C1C1C', lineHeight: 1.25 }}>
          {project.title}
        </p>
      </div>
    </div>
  )
}

/* ─── RingGallery — 디자인 작업 섹션 (카드를 누르면 공통 상세 화면이 열림) ─── */
export default function RingGallery({ works: projects, onOpen, paused }) {
  const [activeView, setActiveView]         = useState('RING')
  const [currentCard, setCurrentCard]       = useState(1)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const [isMobileHint,   setIsMobileHint]   = useState(false)

  /* ── Stable refs for rAF loop ── */
  const stageRef          = useRef(null)
  const cardEls           = useRef(new Array(projects.length).fill(null))
  const videoEls          = useRef(new Array(projects.length).fill(null))
  const rafRef            = useRef(null)
  const rotRef            = useRef(0)
  const activeViewRef     = useRef('RING')
  const mouseRef          = useRef({ x: 0, y: 0, inside: false })
  const hovRef            = useRef(-1)
  const frontRef          = useRef(1)
  const isPausedRef       = useRef(false)
  const scrollXRef        = useRef(0)           // actual (lerped) horizontal scroll offset
  const targetScrollXRef  = useRef(0)           // target offset driven by wheel / touch
  const pushOff           = useRef(Array.from({ length: projects.length }, () => ({ x: 0, y: 0 })))
  const curPos            = useRef(
    Array.from({ length: projects.length }, () => ({
      x: 0, y: 0, z: 0, rotY: 0, rotZ: 0, rotX: 0, scale: 0.9, opacity: 0,
    }))
  )

  /* Sync activeViewRef and reset scroll when switching modes */
  useEffect(() => {
    activeViewRef.current      = activeView
    targetScrollXRef.current   = 0
  }, [activeView])

  /* 상세 화면이 열려 있는 동안 회전·호버 정지 */
  useEffect(() => {
    isPausedRef.current = paused
    if (paused) {
      hovRef.current   = -1
      mouseRef.current = { ...mouseRef.current, inside: false }
    }
  }, [paused])

  /* ── Wheel → horizontal scroll (non-passive so we can preventDefault) ── */
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (e) => {
      /* 휠 좌우 탐색은 TILT 보기에서만 — 다른 보기에서는 페이지 스크롤을 막지 않음 */
      if (activeViewRef.current !== 'TILT') return
      e.preventDefault()
      targetScrollXRef.current += e.deltaY * 0.8
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  /* ── Scroll hint: show when TILT cards overflow the stage width ── */
  useEffect(() => {
    const check = () => {
      const el = stageRef.current
      if (!el) return
      const sw  = el.clientWidth
      const mob = sw < 600
      const sp  = (mob ? 110 : CW) + (mob ? 14 : 24)
      setShowScrollHint(projects.length * sp > sw)
      setIsMobileHint(mob)
    }
    check()
    const ro = new ResizeObserver(check)
    if (stageRef.current) ro.observe(stageRef.current)
    return () => ro.disconnect()
  }, [])

  /* ── Single rAF loop ── */
  useEffect(() => {
    const PUSH_R    = 220
    const PUSH_S    = 70
    const PL        = 0.12
    const LP        = 0.10
    const SCROLL_LP = 0.12
    const ROT_SPD   = 0.15
    const n         = projects.length

    const tick = () => {
      if (!isPausedRef.current) {
        rotRef.current += ROT_SPD
      }

      const stage = stageRef.current
      if (!stage) { rafRef.current = requestAnimationFrame(tick); return }

      const sw   = stage.clientWidth
      const sh   = stage.clientHeight
      const view = activeViewRef.current
      const rot  = rotRef.current
      const mouse = mouseRef.current

      /* ── Horizontal scroll — active only in TILT mode ── */
      if (view === 'TILT') {
        const mob       = sw < 600
        const sp        = (mob ? 110 : CW) + (mob ? 14 : 24)
        const maxScroll = Math.max(0, (n * sp) / 2 - sw / 2 + sp / 2)
        targetScrollXRef.current = Math.max(-maxScroll, Math.min(maxScroll, targetScrollXRef.current))
      } else {
        /* Gently push target back to 0 so it's ready when re-entering TILT */
        targetScrollXRef.current *= 0.85
      }
      scrollXRef.current += (targetScrollXRef.current - scrollXRef.current) * SCROLL_LP
      const scrollX = view === 'TILT' ? scrollXRef.current : 0

      const mX = (!isPausedRef.current && mouse.inside) ? mouse.x - sw / 2 : -99999
      const mY = (!isPausedRef.current && mouse.inside) ? mouse.y - sh / 2 : -99999

      let frontIdx = 0
      let maxDep   = -Infinity

      for (let i = 0; i < n; i++) {
        const el = cardEls.current[i]
        if (!el) continue

        const c  = curPos.current[i]
        const t  = getTarget(i, view, rot, sw, c.rotY, n)
        const po = pushOff.current[i]

        /* Apply scroll offset to target x */
        const tx = t.x - scrollX

        const approxX = tx + po.x
        const approxY = t.y  + po.y
        const dx      = approxX - mX
        const dy      = approxY - mY
        const dist    = Math.sqrt(dx * dx + dy * dy)
        let tpx = 0, tpy = 0
        if (mouse.inside && !isPausedRef.current && dist < PUSH_R && dist > 1) {
          const str = PUSH_S * (1 - dist / PUSH_R)
          tpx = (dx / dist) * str
          tpy = (dy / dist) * str
        }
        po.x += (tpx - po.x) * PL
        po.y += (tpy - po.y) * PL

        const fx = tx + po.x
        const fy = t.y + po.y

        c.x       += (fx        - c.x)       * LP
        c.y       += (fy        - c.y)       * LP
        c.z       += (t.z       - c.z)       * LP
        c.scale   += (t.scale   - c.scale)   * LP
        c.opacity += (t.opacity - c.opacity) * LP
        c.rotZ    += (t.rotZ    - c.rotZ)    * LP
        c.rotX    += (t.rotX    - c.rotX)    * LP

        let rd = t.rotY - c.rotY
        while (rd >  180) rd -= 360
        while (rd < -180) rd += 360
        c.rotY += rd * LP

        const hov  = hovRef.current === i
        const finZ = hov ? c.z + 60                : c.z
        const finS = hov ? Math.max(c.scale, 1.08) : c.scale
        const finO = hov ? 1                        : c.opacity

        el.style.transform = (
          `translateX(${c.x.toFixed(1)}px) ` +
          `translateY(${c.y.toFixed(1)}px) ` +
          `translateZ(${finZ.toFixed(1)}px) ` +
          `rotateY(${c.rotY.toFixed(2)}deg) ` +
          `rotateZ(${c.rotZ.toFixed(2)}deg) ` +
          `rotateX(${c.rotX.toFixed(2)}deg) ` +
          `scale(${finS.toFixed(3)})`
        )
        el.style.opacity       = finO.toFixed(3)
        el.style.zIndex        = hov ? '20' : String(t.zIdx)
        el.style.outline       = hov ? '2px solid #AAFF00' : 'none'
        el.style.outlineOffset = '-2px'
        el.style.boxShadow     = hov ? '0 8px 40px rgba(0,0,0,0.14)' : 'none'

        /* Front detection: in TILT use adjusted-x proximity to center,
           in other modes use depth from getTarget */
        const depthForFront = view === 'TILT'
          ? Math.max(0, 1 - Math.abs(tx) / Math.max(sw * 0.5, 1))
          : t.depth
        if (depthForFront > maxDep) { maxDep = depthForFront; frontIdx = i }
      }

      const next = frontIdx + 1
      if (next !== frontRef.current) {
        frontRef.current = next
        setCurrentCard(next)
      }

      /* Video play/pause: front card and hovered card only; all pause when modal open */
      for (let i = 0; i < n; i++) {
        const vEl = videoEls.current[i]
        if (!vEl) continue
        const focused = !isPausedRef.current && (i === frontIdx || hovRef.current === i)
        if (focused) {
          if (vEl.paused) vEl.play().catch(() => {})
        } else {
          if (!vEl.paused) vEl.pause()
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  /* ── Stage mouse event handlers ── */
  const handleMouseMove = (e) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true }
  }
  const handleMouseLeave = () => {
    mouseRef.current = { ...mouseRef.current, inside: false }
  }

  /* ── Touch handlers — TILT mode scrolls, all other modes rotate ── */
  const touchStartRef = useRef(null)
  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x:       e.touches[0].clientX,
      rot:     rotRef.current,
      scrollX: targetScrollXRef.current,
    }
  }
  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return
    const dx = e.touches[0].clientX - touchStartRef.current.x
    if (activeViewRef.current === 'TILT') {
      targetScrollXRef.current = touchStartRef.current.scrollX - dx * 1.2
    } else {
      rotRef.current = touchStartRef.current.rot + dx * 0.35
    }
  }
  const handleTouchEnd = () => { touchStartRef.current = null }

  return (
    <Section id="design" title="디자인 작업">
      {/* ── Stage panel ── */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position:          'relative',
          backgroundColor:   '#EFEFEF',
          borderRadius:      '16px',
          height:            '80vh',
          overflow:          'hidden',
          perspective:       '1500px',
          perspectiveOrigin: '50% 50%',
          /* 가로 스와이프는 갤러리가 처리, 세로 스와이프는 페이지 스크롤 (브라우저 뒤로가기 제스처 방지) */
          touchAction:         'pan-y',
          overscrollBehaviorX: 'contain',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            position:       'absolute',
            top: 0, left: 0, right: 0,
            zIndex:         30,
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            padding:        '24px 28px',
            flexWrap:       'wrap',
            gap:            '12px',
          }}
        >
          <p
            style={{
              fontWeight:    600,
              fontSize:      '0.875rem',
              color:         '#1C1C1C',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            SELECTED WORKS
          </p>
          <div
            style={{
              display:        'flex',
              gap:            '8px',
              flexWrap:       'nowrap',
              overflowX:      'auto',
              scrollbarWidth: 'none',
            }}
          >
            {VIEWS.map(v => (
              <ViewButton
                key={v}
                label={v}
                active={activeView === v}
                onClick={() => setActiveView(v)}
              />
            ))}
          </div>
        </div>

        {/* Cards — rendered dynamically from projects array */}
        {projects.map((project, i) => (
          <WorkCard
            key={project.id}
            project={project}
            setRef={el => { cardEls.current[i] = el }}
            setVideoRef={el => { videoEls.current[i] = el }}
            onEnter={() => { hovRef.current = i }}
            onLeave={() => { hovRef.current = -1 }}
            onClick={() => onOpen(project.id)}
          />
        ))}

        {/* Bottom bar */}
        <div
          style={{
            position:       'absolute',
            bottom: 0, left: 0, right: 0,
            zIndex:         30,
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            padding:        '24px 28px',
            flexWrap:       'wrap',
            gap:            '8px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p
              style={{
                fontWeight:    400,
                fontSize:      '0.75rem',
                color:         'rgba(28,28,28,0.6)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                margin:        0,
              }}
            >
              SCROLL TO EXPLORE →
            </p>
            {showScrollHint && activeView === 'TILT' && (
              <p
                style={{
                  display:       'flex',
                  alignItems:    'center',
                  gap:           '6px',
                  fontWeight:    400,
                  fontSize:      '0.68rem',
                  color:         '#6B6B6B',
                  letterSpacing: '0.12em',
                  margin:        0,
                }}
              >
                <span style={{ animation: 'scroll-hint-sway 1.8s ease-in-out infinite', display: 'inline-block', fontSize: '12px', lineHeight: 1, verticalAlign: 'middle' }}>
                  ↔
                </span>
                {isMobileHint ? '좌우로 스와이프' : '마우스 휠로 좌우 탐색'}
              </p>
            )}
          </div>
          <p
            style={{
              fontWeight:         600,
              fontSize:           '0.875rem',
              color:              '#1C1C1C',
              letterSpacing:      '0.04em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(currentCard).padStart(2, '0')} — {String(projects.length).padStart(2, '0')}
          </p>
        </div>
      </div>

    </Section>
  )
}
