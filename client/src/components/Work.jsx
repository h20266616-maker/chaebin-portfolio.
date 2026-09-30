import { useCallback, useEffect, useRef, useState } from 'react'
import { useScramble } from '../hooks/useScramble'
import GlitchText from './GlitchText'
import { projects } from '../data/projects'

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
  const { display, start, stop } = useScramble(label)
  return (
    <button
      onClick={onClick}
      onMouseEnter={start}
      onMouseLeave={stop}
      style={{
        padding:         '6px 16px',
        border:          active ? '1px solid #AAFF00' : '1px solid #8C8C8C',
        borderRadius:    '9999px',
        backgroundColor: active ? '#AAFF00' : 'transparent',
        color:           '#1A1A1A',
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
      {display}
    </button>
  )
}

/* ─── WorkCard ─── */
function WorkCard({ project, setRef, setVideoRef, onEnter, onLeave, onClick }) {
  const { display, start, stop } = useScramble(project.title)
  const [imgError, setImgError]  = useState(false)

  const firstSrc     = project.images?.[0]
  const firstIsVideo = isVideo(firstSrc)

  return (
    <div
      ref={setRef}
      onMouseEnter={() => { start(); onEnter() }}
      onMouseLeave={() => { stop();  onLeave() }}
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
        backgroundColor: '#F7F7F7',
        border:          '1px solid #D4D4D4',
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
          backgroundColor: '#EBEBEB',
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
              alt={project.title}
              loading="lazy"
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
              color:         '#1A1A1A',
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
          backgroundColor: '#F7F7F7',
          flexShrink:      0,
          pointerEvents:   'none',
        }}
      >
        <p
          style={{
            fontWeight:    600,
            fontSize:      '0.52rem',
            color:         '#AAFF00',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom:  '4px',
          }}
        >
          {project.category}
        </p>
        <p style={{ fontWeight: 700, fontSize: '0.68rem', color: '#1A1A1A', lineHeight: 1.25 }}>
          {display}
        </p>
      </div>
    </div>
  )
}

/* ─── ProjectModal ─── */
function ProjectModal({ project, isClosing, onClose, onPrev, onNext }) {
  const [selectedThumb, setSelectedThumb] = useState(0)
  const [mainImgError,  setMainImgError]  = useState(false)
  const isMobile   = window.innerWidth < 768
  const currentIdx = projects.findIndex(p => p.id === project.id)

  /* Reset thumbnail index and media error state when navigating between projects */
  useEffect(() => {
    setSelectedThumb(0)
    setMainImgError(false)
  }, [project.id])

  const currentSrc     = project.images?.[selectedThumb]
  const currentIsVideo = isVideo(currentSrc)

  /* Explicit play() call — safeguard for browsers that ignore autoPlay on mount */
  const modalVideoRef = useRef(null)
  useEffect(() => {
    if (currentIsVideo && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {})
    }
  }, [currentIsVideo, selectedThumb])

  const panelAnim = {
    opacity:    isClosing ? 0 : 1,
    transform:  isClosing ? 'scale(0.94)' : 'scale(1)',
    transition: 'opacity 250ms ease, transform 250ms ease',
  }

  return (
    /* Backdrop — click to close */
    <div
      onClick={onClose}
      style={{
        position:        'fixed',
        inset:           0,
        backgroundColor: 'rgba(28,28,28,0.85)',
        zIndex:          9000,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         isMobile ? '12px' : '32px',
        opacity:         isClosing ? 0 : 1,
        transition:      'opacity 300ms ease',
      }}
    >
      {/* Panel — stop backdrop click propagating */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          ...panelAnim,
          position:        'relative',
          backgroundColor: '#F7F7F7',
          border:          '1px solid #AAFF00',
          borderRadius:    '12px',
          width:           isMobile ? '92vw' : 'min(1000px, 90vw)',
          maxHeight:       isMobile ? '90vh' : '85vh',
          display:         'flex',
          flexDirection:   isMobile ? 'column' : 'row',
          overflowY:       'auto',
        }}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          onMouseEnter={e => { e.currentTarget.style.color = '#AAFF00' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#1A1A1A' }}
          aria-label="닫기"
          style={{
            position:   'absolute',
            top:        '14px',
            right:      '14px',
            zIndex:     10,
            background: 'none',
            border:     'none',
            fontSize:   '1.75rem',
            fontWeight: 800,
            color:      '#1A1A1A',
            cursor:     'pointer',
            lineHeight: 1,
            padding:    '4px 8px',
            transition: 'color 150ms ease',
            fontFamily: 'inherit',
          }}
        >
          ×
        </button>

        {/* ── LEFT — media area (~60% desktop) ── */}
        <div
          style={{
            flex:            isMobile ? 'none' : '3',
            display:         'flex',
            flexDirection:   'column',
            backgroundColor: '#EBEBEB',
            minHeight:       isMobile ? '220px' : '0',
            borderRadius:    isMobile ? '12px 12px 0 0' : '12px 0 0 12px',
            overflow:        'hidden',
          }}
        >
          {/* Main media — blurred backdrop fills the area, foreground artwork centered/uncropped */}
          <div
            style={{
              flex:            1,
              position:        'relative',
              minHeight:       isMobile ? '200px' : '360px',
              overflow:        'hidden',
              backgroundColor: '#1C1C1C',
            }}
          >
            {!mainImgError && currentSrc ? (
              <>
                {/* Layer 1: blurred backdrop — same source, cover-fills the container */}
                {currentIsVideo ? (
                  <video
                    key={`backdrop-${selectedThumb}`}
                    src={currentSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-hidden="true"
                    style={{
                      position:  'absolute',
                      top:       0,
                      left:      0,
                      width:     '100%',
                      height:    '100%',
                      objectFit: 'cover',
                      filter:    'blur(40px) saturate(1.2)',
                      transform: 'scale(1.15)',
                      opacity:   0.6,
                      display:   'block',
                    }}
                  />
                ) : (
                  <img
                    key={`backdrop-${selectedThumb}`}
                    src={currentSrc}
                    aria-hidden="true"
                    style={{
                      position:  'absolute',
                      top:       0,
                      left:      0,
                      width:     '100%',
                      height:    '100%',
                      objectFit: 'cover',
                      filter:    'blur(40px) saturate(1.2)',
                      transform: 'scale(1.15)',
                      opacity:   0.6,
                      display:   'block',
                    }}
                  />
                )}

                {/* Layer 2: foreground artwork — uncropped, centered, drop shadow for separation */}
                {currentIsVideo ? (
                  <video
                    ref={modalVideoRef}
                    key={`fg-${selectedThumb}`}
                    src={currentSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    onError={() => setMainImgError(true)}
                    style={{
                      position:  'absolute',
                      top:       '50%',
                      left:      '50%',
                      transform: 'translate(-50%, -50%)',
                      maxWidth:  '92%',
                      maxHeight: '92%',
                      width:     'auto',
                      height:    'auto',
                      objectFit: 'contain',
                      filter:    'drop-shadow(0 8px 32px rgba(0,0,0,0.25))',
                      display:   'block',
                    }}
                  />
                ) : (
                  <img
                    key={`fg-${selectedThumb}`}
                    src={currentSrc}
                    alt={project.title}
                    onError={() => setMainImgError(true)}
                    style={{
                      position:  'absolute',
                      top:       '50%',
                      left:      '50%',
                      transform: 'translate(-50%, -50%)',
                      maxWidth:  '92%',
                      maxHeight: '92%',
                      width:     'auto',
                      height:    'auto',
                      objectFit: 'contain',
                      filter:    'drop-shadow(0 8px 32px rgba(0,0,0,0.25))',
                      display:   'block',
                    }}
                  />
                )}
              </>
            ) : (
              <span
                style={{
                  position:      'absolute',
                  top:           '50%',
                  left:          '50%',
                  transform:     'translate(-50%, -50%)',
                  fontWeight:    700,
                  fontSize:      isMobile ? '2rem' : '3rem',
                  color:         '#F7F7F7',
                  opacity:       0.18,
                  letterSpacing: '-0.02em',
                  userSelect:    'none',
                  pointerEvents: 'none',
                  whiteSpace:    'nowrap',
                }}
              >
                {project.category}
              </span>
            )}

            {/* Media counter badge */}
            <span
              style={{
                position:           'absolute',
                bottom:             '12px',
                right:              '12px',
                zIndex:             10,
                fontSize:           '0.6rem',
                fontWeight:         600,
                color:              'rgba(247,247,247,0.7)',
                letterSpacing:      '0.06em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {String(selectedThumb + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}
            </span>
          </div>

          {/* Thumbnail strip — shown only when project has more than one media item */}
          {project.images.length > 1 && (
            <div
              style={{
                display:         'flex',
                gap:             '8px',
                padding:         '12px 16px',
                flexWrap:        'wrap',
                borderTop:       '1px solid #D4D4D4',
                backgroundColor: '#EBEBEB',
              }}
            >
              {project.images.map((imgSrc, ti) => {
                const thumbIsVideo = isVideo(imgSrc)
                return (
                  <div
                    key={ti}
                    onClick={() => { setSelectedThumb(ti); setMainImgError(false) }}
                    style={{
                      width:           '52px',
                      height:          '68px',
                      backgroundColor: '#D4D4D4',
                      border:          ti === selectedThumb
                        ? '2px solid #AAFF00'
                        : '1px solid rgba(26,26,26,0.15)',
                      cursor:          'pointer',
                      overflow:        'hidden',
                      flexShrink:      0,
                      opacity:         ti === selectedThumb ? 1 : 0.45,
                      transition:      'border-color 150ms ease, opacity 150ms ease',
                      position:        'relative',
                      display:         'flex',
                      alignItems:      'center',
                      justifyContent:  'center',
                    }}
                  >
                    {thumbIsVideo ? (
                      <>
                        <div
                          style={{
                            position:        'absolute',
                            inset:           0,
                            backgroundColor: '#1C1C1C',
                          }}
                        />
                        <span
                          style={{
                            position:   'relative',
                            zIndex:     1,
                            fontSize:   '1.1rem',
                            color:      '#AAFF00',
                            lineHeight: 1,
                          }}
                        >
                          ▶
                        </span>
                      </>
                    ) : (
                      <img
                        src={imgSrc}
                        alt={`${project.title} ${ti + 1}`}
                        style={{
                          width:     '100%',
                          height:    '100%',
                          objectFit: 'cover',
                          display:   'block',
                        }}
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT — info area (~40% desktop) ── */}
        <div
          style={{
            flex:          isMobile ? 'none' : '2',
            padding:       isMobile ? '24px 20px 28px' : '40px 36px 36px',
            display:       'flex',
            flexDirection: 'column',
            gap:           '16px',
            minWidth:      0,
            overflowY:     'auto',
          }}
        >
          {/* Category tag */}
          <p
            style={{
              fontWeight:    600,
              fontSize:      '0.62rem',
              color:         '#AAFF00',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom:  '-4px',
            }}
          >
            {project.category}
          </p>

          {/* Award badge — shown only when project.award is set */}
          {project.award && (
            <div
              style={{
                display:         'inline-block',
                alignSelf:       'flex-start',
                backgroundColor: '#AAFF00',
                color:           '#1A1A1A',
                fontWeight:      600,
                fontSize:        '0.62rem',
                padding:         '4px 10px',
                borderRadius:    '4px',
                letterSpacing:   '0.02em',
                lineHeight:      1.5,
                marginTop:       '-8px',
              }}
            >
              {project.award.startsWith('✦') ? project.award : `✦ ${project.award}`}
            </div>
          )}

          {/* Series indicator — shown only when project.series exists */}
          {project.series && (
            <div style={{ marginTop: '-4px' }}>
              <span
                style={{
                  fontWeight:    600,
                  fontSize:      '0.62rem',
                  color:         '#8C8C8C',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginRight:   '8px',
                }}
              >
                SERIES
              </span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize:   '0.875rem',
                  color:      '#1A1A1A',
                }}
              >
                {project.series}
              </span>
            </div>
          )}

          {/* Title */}
          <GlitchText
            tag="h2"
            style={{
              fontWeight:    800,
              fontSize:      isMobile ? '1.5rem' : '2rem',
              color:         '#1A1A1A',
              lineHeight:    1.1,
              letterSpacing: '-0.03em',
              margin:        0,
            }}
          >
            {project.title}
          </GlitchText>

          {/* Year */}
          <p
            style={{
              fontWeight: 400,
              fontSize:   '0.78rem',
              color:      '#8C8C8C',
              marginTop:  '-8px',
            }}
          >
            {project.year}
          </p>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: '#D4D4D4', flexShrink: 0 }} />

          {/* Description */}
          <p
            style={{
              fontWeight: 400,
              fontSize:   '0.875rem',
              color:      '#1A1A1A',
              lineHeight: 1.85,
            }}
          >
            {project.description}
          </p>

          {/* About the series */}
          {project.seriesDescription && (
            <div style={{ marginTop: '8px' }}>
              <p
                style={{
                  fontWeight:    600,
                  fontSize:      '0.62rem',
                  color:         '#8C8C8C',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom:  '8px',
                }}
              >
                ABOUT THE SERIES
              </p>
              <p
                style={{
                  fontWeight: 400,
                  fontSize:   '0.875rem',
                  color:      '#1A1A1A',
                  lineHeight: 1.85,
                  opacity:    0.8,
                }}
              >
                {project.seriesDescription}
              </p>
            </div>
          )}

          {/* Process */}
          {project.process && (
            <div style={{ marginTop: '8px' }}>
              <p
                style={{
                  fontWeight:    600,
                  fontSize:      '0.62rem',
                  color:         '#8C8C8C',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom:  '8px',
                }}
              >
                PROCESS
              </p>
              <p
                style={{
                  fontWeight: 400,
                  fontSize:   '0.875rem',
                  color:      '#1A1A1A',
                  lineHeight: 1.85,
                  opacity:    0.9,
                }}
              >
                {project.process}
              </p>
            </div>
          )}

          {/* Tools — hidden when tools array is empty */}
          {project.tools && project.tools.length > 0 && (
            <div>
              <p
                style={{
                  fontWeight:    600,
                  fontSize:      '0.62rem',
                  color:         '#8C8C8C',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom:  '8px',
                }}
              >
                TOOLS
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {project.tools.map(tool => (
                  <span
                    key={tool}
                    style={{
                      border:        '1px solid #1A1A1A',
                      padding:       '3px 10px',
                      fontSize:      '0.65rem',
                      fontWeight:    400,
                      color:         '#1A1A1A',
                      letterSpacing: '0.02em',
                      whiteSpace:    'nowrap',
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External link */}
          {project.link && (
            <div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#AAFF00'
                  e.currentTarget.style.borderColor     = '#AAFF00'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor     = '#1A1A1A'
                }}
                style={{
                  display:        'inline-block',
                  border:         '1px solid #1A1A1A',
                  padding:        '8px 16px',
                  borderRadius:   '4px',
                  fontWeight:     600,
                  fontSize:       '0.875rem',
                  color:          '#1A1A1A',
                  textDecoration: 'none',
                  transition:     'background-color 150ms ease, border-color 150ms ease',
                  fontFamily:     'inherit',
                  letterSpacing:  '0.02em',
                  cursor:         'pointer',
                }}
              >
                {project.linkLabel || '웹사이트'} ↗
              </a>
            </div>
          )}

          {/* Navigation row */}
          <div
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              paddingTop:     '16px',
              borderTop:      '1px solid #D4D4D4',
              marginTop:      '4px',
              flexShrink:     0,
            }}
          >
            <button
              onClick={onPrev}
              onMouseEnter={e => { e.currentTarget.style.color = '#AAFF00' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#1A1A1A' }}
              style={{
                background:    'none',
                border:        'none',
                fontSize:      '0.7rem',
                fontWeight:    600,
                color:         '#1A1A1A',
                cursor:        'pointer',
                letterSpacing: '0.1em',
                transition:    'color 150ms ease',
                fontFamily:    'inherit',
                padding:       '4px 0',
                userSelect:    'none',
              }}
            >
              ← PREV
            </button>
            <span
              style={{
                fontSize:           '0.68rem',
                fontWeight:         400,
                color:              '#8C8C8C',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing:      '0.04em',
              }}
            >
              {String(currentIdx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
            <button
              onClick={onNext}
              onMouseEnter={e => { e.currentTarget.style.color = '#AAFF00' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#1A1A1A' }}
              style={{
                background:    'none',
                border:        'none',
                fontSize:      '0.7rem',
                fontWeight:    600,
                color:         '#1A1A1A',
                cursor:        'pointer',
                letterSpacing: '0.1em',
                transition:    'color 150ms ease',
                fontFamily:    'inherit',
                padding:       '4px 0',
                userSelect:    'none',
              }}
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Work — main section ─── */
export default function Work() {
  const [activeView, setActiveView]         = useState('FLAT')
  const [currentCard, setCurrentCard]       = useState(1)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const [isMobileHint,   setIsMobileHint]   = useState(false)

  /* ── Modal state ── */
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalClosing,  setIsModalClosing]  = useState(false)

  /* ── Stable refs for rAF loop ── */
  const stageRef          = useRef(null)
  const cardEls           = useRef(new Array(projects.length).fill(null))
  const videoEls          = useRef(new Array(projects.length).fill(null))
  const rafRef            = useRef(null)
  const rotRef            = useRef(0)
  const activeViewRef     = useRef('FLAT')
  const mouseRef          = useRef({ x: 0, y: 0, inside: false })
  const hovRef            = useRef(-1)
  const frontRef          = useRef(1)
  const isPausedRef       = useRef(false)
  const selProjRef        = useRef(null)
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

  useEffect(() => { selProjRef.current = selectedProject }, [selectedProject])

  /* ── Modal open / close / navigate ── */
  const openModal = (project) => {
    isPausedRef.current  = true
    hovRef.current       = -1
    mouseRef.current     = { ...mouseRef.current, inside: false }
    setSelectedProject(project)
  }

  const closeModal = useCallback(() => {
    setIsModalClosing(true)
    setTimeout(() => {
      setIsModalClosing(false)
      setSelectedProject(null)
      isPausedRef.current = false
    }, 260)
  }, [])

  const goNext = useCallback(() => {
    const proj = selProjRef.current
    if (!proj) return
    const idx = projects.findIndex(p => p.id === proj.id)
    setSelectedProject(projects[(idx + 1) % projects.length])
  }, [])

  const goPrev = useCallback(() => {
    const proj = selProjRef.current
    if (!proj) return
    const idx = projects.findIndex(p => p.id === proj.id)
    setSelectedProject(projects[(idx - 1 + projects.length) % projects.length])
  }, [])

  /* ── Keyboard: Escape closes, arrows navigate ── */
  useEffect(() => {
    const onKey = (e) => {
      if (!selProjRef.current) return
      if (e.key === 'Escape')     closeModal()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal, goNext, goPrev])

  /* ── Wheel → horizontal scroll (non-passive so we can preventDefault) ── */
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      if (activeViewRef.current === 'TILT') {
        targetScrollXRef.current += e.deltaY * 0.8
      } else {
        rotRef.current += e.deltaY * 0.1
      }
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
      if (!isPausedRef.current && hovRef.current === -1) {
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
    <section
      id="work"
      className="section-padding"
      style={{
        position:        'relative',
        backgroundColor: '#FAFAFA',
        scrollSnapAlign: 'start',
        scrollSnapStop:  'normal',
        minHeight:       '100vh',
        display:         'flex',
        flexDirection:   'column',
        justifyContent:  'center',
        paddingTop:      '32px',
        paddingBottom:   '32px',
        boxSizing:       'border-box',
      }}
    >
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
          backgroundColor:   '#EBEBEB',
          borderRadius:      '16px',
          height:            '80vh',
          overflow:          'hidden',
          perspective:       '1500px',
          perspectiveOrigin: '50% 50%',
          touchAction:       'pan-y',
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
              color:         '#1A1A1A',
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
            onClick={() => openModal(project)}
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
                color:         'rgba(26,26,26,0.6)',
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
                  color:         '#8C8C8C',
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
              color:              '#1A1A1A',
              letterSpacing:      '0.04em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(currentCard).padStart(2, '0')} — {String(projects.length).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* ── Project detail modal ── */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isClosing={isModalClosing}
          onClose={closeModal}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </section>
  )
}
