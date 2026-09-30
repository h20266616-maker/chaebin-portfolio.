// 기존 chaebin-portfolio WORK 섹션(FLAT / TILT / RING / GALLERY 3D 갤러리 + 상세 모달)을
// 배포된 사이트 코드에서 그대로 복원한 컴포넌트입니다. 수치·동작은 원본과 동일합니다.
// 사용법: <WorkGallery projects={projects} />
import { useState, useRef, useEffect, useCallback } from "react";

const CARD_W = 160;
const CARD_H = Math.round(CARD_W * (4 / 3));
const MODES = ["FLAT", "TILT", "RING", "GALLERY"];
const DEFAULT_MODE = "FLAT"; // 원본 기본값은 "RING"
const TILT_ROT = [-8, 4, -5, 7, -3, 6, -7, 3];
const TILT_Y = [20, -10, 30, -20, 15, -30, 10, -15];
const DEG = Math.PI / 180;
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
const isVideo = (s) => typeof s === "string" && /\.(mp4|webm|mov)$/i.test(s);
const pad = (n) => String(n).padStart(2, "0");

/* ---------- 호버 시 글자 섞였다가 돌아오는 효과 ---------- */
function useScramble(text) {
  const [display, setDisplay] = useState(text);
  const raf = useRef(null);
  const startTime = useRef(null);
  const DURATION = 600;

  const start = useCallback(() => {
    cancelAnimationFrame(raf.current);
    startTime.current = null;
    const step = (t) => {
      if (!startTime.current) startTime.current = t;
      const p = Math.min((t - startTime.current) / DURATION, 1);
      const revealed = Math.floor(p * text.length);
      setDisplay(
        text
          .split("")
          .map((ch, i) =>
            ch === " " || ch === "·"
              ? ch
              : i < revealed
              ? text[i]
              : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          )
          .join("")
      );
      if (p < 1) raf.current = requestAnimationFrame(step);
      else setDisplay(text);
    };
    raf.current = requestAnimationFrame(step);
  }, [text]);

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setDisplay(text);
  }, [text]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { display, start, stop };
}

/* ---------- 모드별 카드 목표 위치 ---------- */
function getLayout(i, mode, rot, width, curRotY, n) {
  const mobile = width < 600;
  const flatRotY = Math.round(curRotY / 360) * 360;

  if (mode === "RING") {
    const angle = (360 / n) * i + rot;
    const rad = angle * DEG;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rx = mobile ? 160 : 280;
    const rz = mobile ? 80 : 140;
    const d = (cos + 1) / 2;
    return {
      x: sin * rx, y: sin * rx * 0.12, z: cos * rz,
      rotY: -angle, rotZ: 0, rotX: 0,
      scale: d * 0.3 + 0.75, opacity: d * 0.5 + 0.5,
      zIdx: Math.round(d * 8), depth: d,
    };
  }

  if (mode === "FLAT") {
    const rad = ((360 / n) * i + rot) * DEG;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const r = mobile ? 180 : 320;
    const d = (cos + 1) / 2;
    return {
      x: sin * r, y: -Math.abs(sin) * 22, z: 0,
      rotY: flatRotY, rotZ: 0, rotX: 0,
      scale: 1, opacity: d * 0.3 + 0.7,
      zIdx: Math.round(d * 8), depth: d,
    };
  }

  if (mode === "TILT") {
    const step = (mobile ? 110 : CARD_W) + (mobile ? 14 : 24);
    const x = -(n * step) / 2 + step / 2 + i * step;
    const dist = Math.abs(x) / ((width || 800) / 2);
    return {
      x, y: TILT_Y[i % TILT_Y.length], z: 0,
      rotY: flatRotY, rotZ: TILT_ROT[i % TILT_ROT.length], rotX: 10,
      scale: 1, opacity: Math.max(0.35, 1 - dist * 0.35),
      zIdx: i, depth: 1 - dist,
    };
  }

  // GALLERY: 부채꼴 배치
  const u = n > 1 ? i / (n - 1) : 0.5;
  const spread = (u - 0.5) * 120;
  const rad = spread * DEG;
  const r = mobile ? 300 : 520;
  return {
    x: Math.sin(rad) * r, y: (-Math.cos(rad) + 1) * r * 0.12, z: 0,
    rotY: flatRotY, rotZ: spread * 0.25, rotX: 0,
    scale: 1.05, opacity: 1,
    zIdx: i, depth: u,
  };
}

/* ---------- 모드 버튼 ---------- */
function ModeButton({ label, active, onClick }) {
  const { display, start, stop } = useScramble(label);
  return (
    <button
      onClick={onClick}
      onMouseEnter={start}
      onMouseLeave={stop}
      style={{
        padding: "6px 16px",
        border: active ? "1px solid #AAFF00" : "1px solid #8C8C8C",
        borderRadius: "9999px",
        backgroundColor: active ? "#AAFF00" : "transparent",
        color: "#1A1A1A", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.06em",
        cursor: "pointer", transition: "background-color 200ms ease, border-color 200ms ease",
        whiteSpace: "nowrap", fontFamily: "inherit", lineHeight: 1, userSelect: "none",
      }}
    >
      {display}
    </button>
  );
}

/* ---------- 카드 ---------- */
function Card({ project, setRef, setVideoRef, onEnter, onLeave, onClick }) {
  const { display, start, stop } = useScramble(project.title);
  const [broken, setBroken] = useState(false);
  const src = project.images?.[0];
  const video = isVideo(src);
  const mediaStyle = {
    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
    objectFit: "contain", objectPosition: "center", display: "block",
  };

  return (
    <div
      ref={setRef}
      onMouseEnter={() => { start(); onEnter(); }}
      onMouseLeave={() => { stop(); onLeave(); }}
      onClick={onClick}
      style={{
        position: "absolute", left: "50%", top: "50%",
        width: `${CARD_W}px`, height: `${CARD_H}px`,
        marginLeft: `${-CARD_W / 2}px`, marginTop: `${-CARD_H / 2}px`,
        willChange: "transform, opacity", backgroundColor: "#F7F7F7",
        border: "1px solid #D4D4D4", overflow: "hidden", cursor: "pointer",
        display: "flex", flexDirection: "column", userSelect: "none",
      }}
    >
      <div
        style={{
          flex: 1, backgroundColor: "#EBEBEB", display: "flex", alignItems: "center",
          justifyContent: "center", pointerEvents: "none", position: "relative", overflow: "hidden",
        }}
      >
        {!broken && src ? (
          video ? (
            <video
              ref={(el) => setVideoRef && setVideoRef(el)}
              src={src} autoPlay loop muted playsInline
              onError={() => { setBroken(true); setVideoRef && setVideoRef(null); }}
              style={mediaStyle}
            />
          ) : (
            <img src={src} alt={project.title} onError={() => setBroken(true)} style={mediaStyle} />
          )
        ) : (
          <span style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A1A1A", opacity: 0.28 }}>
            {project.category}
          </span>
        )}
      </div>
      <div style={{ padding: "10px 12px", backgroundColor: "#F7F7F7", flexShrink: 0, pointerEvents: "none" }}>
        <p style={{ display: "inline-block", fontWeight: 600, fontSize: "0.52rem", color: "#1A1A1A", backgroundColor: "#AAFF00", padding: "1px 4px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
          {project.category}
        </p>
        <p style={{ fontWeight: 700, fontSize: "0.68rem", color: "#1A1A1A", lineHeight: 1.25 }}>{display}</p>
      </div>
    </div>
  );
}

/* ---------- 상세 모달 ---------- */
const labelStyle = {
  fontWeight: 600, fontSize: "0.62rem", color: "#8C8C8C",
  letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px",
};
const bodyStyle = { fontWeight: 400, fontSize: "0.875rem", color: "#1A1A1A", lineHeight: 1.85 };
const navBtnStyle = {
  background: "none", border: "none", fontSize: "0.7rem", fontWeight: 600, color: "#1A1A1A",
  cursor: "pointer", letterSpacing: "0.1em", transition: "color 150ms ease",
  fontFamily: "inherit", padding: "4px 0", userSelect: "none",
};
// 호버: 라임은 글자색이 아니라 밑줄로만
const limeHover = {
  onMouseEnter: (e) => { Object.assign(e.currentTarget.style, { textDecoration: "underline", textDecorationColor: "#AAFF00", textDecorationThickness: "2px", textUnderlineOffset: "4px" }); },
  onMouseLeave: (e) => { e.currentTarget.style.textDecoration = "none"; },
};

/* ---------- 큰 이미지 좌우 화살표 ---------- */
function ArrowButton({ side, label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "absolute", top: "50%", [side]: "12px", transform: "translateY(-50%)", zIndex: 11,
        width: "40px", height: "40px", borderRadius: "50%", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
        backgroundColor: hover ? "#AAFF00" : "rgba(28,28,28,0.45)", color: hover ? "#1A1A1A" : "#FFFFFF",
        fontSize: "1.5rem", lineHeight: 1, fontFamily: "inherit", transition: "background-color 150ms ease, color 150ms ease",
      }}
    >
      <span aria-hidden="true" style={{ marginTop: "-2px" }}>{side === "left" ? "‹" : "›"}</span>
    </button>
  );
}

function DetailModal({ project, projects, isClosing, onClose, onPrev, onNext }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [broken, setBroken] = useState(false);
  const mobile = window.innerWidth < 768;
  const index = projects.findIndex((p) => p.id === project.id);
  const images = project.images || [];
  const src = images[imgIdx];
  const titles = project.imageTitles; // 있을 때만 이미지별 제목 표시
  const video = isVideo(src);
  const videoRef = useRef(null);
  const fgRef = useRef(null);
  const thumbRefs = useRef([]);
  const dirRef = useRef(0); // 넘긴 방향: 1 다음, -1 이전, 0 전환 없음
  const dragRef = useRef(null);
  const multi = images.length > 1;

  useEffect(() => { dirRef.current = 0; setImgIdx(0); setBroken(false); }, [project.id]);

  // 이미지 한 장씩 넘기기 (범위 밖이면 무시)
  const goTo = useCallback((i) => {
    if (i < 0 || i >= images.length || i === imgIdx) return;
    dirRef.current = i > imgIdx ? 1 : -1;
    setImgIdx(i);
    setBroken(false);
  }, [images.length, imgIdx]);

  // 넘길 때 약 250ms 옆으로 밀리며 바뀌는 전환 + 현재 썸네일이 보이도록 스크롤
  useEffect(() => {
    const dir = dirRef.current;
    if (!dir) return;
    dirRef.current = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = fgRef.current;
    if (el && !reduce && el.animate) {
      el.animate(
        [
          { transform: `translate(calc(-50% + ${dir * 48}px), -50%)`, opacity: 0 },
          { transform: "translate(-50%, -50%)", opacity: 1 },
        ],
        { duration: 250, easing: "ease-out" }
      );
    }
    thumbRefs.current[imgIdx]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [imgIdx]);

  // 키보드 ← →: 이미지부터 넘기고, 끝에서는 이전/다음 작품으로
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") { if (imgIdx < images.length - 1) goTo(imgIdx + 1); else onNext(); }
      if (e.key === "ArrowLeft") { if (imgIdx > 0) goTo(imgIdx - 1); else onPrev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imgIdx, images.length, goTo, onNext, onPrev]);

  // 스와이프(터치)·드래그(마우스): 가로로 50px 이상 밀었을 때만 넘기기
  const onPointerDown = (e) => {
    if (!multi || (e.pointerType === "mouse" && e.button !== 0)) return;
    dragRef.current = { x: e.clientX, y: e.clientY };
    if (e.pointerType === "mouse") e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerUp = (e) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy)) goTo(imgIdx + (dx < 0 ? 1 : -1));
  };

  // 열릴 때도 250ms 페이드 + 0.94→1 확대 (첫 프레임을 0.94/투명으로 그린 뒤 전환)
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(id);
  }, []);
  const shown = entered && !isClosing;
  useEffect(() => { if (video && videoRef.current) videoRef.current.play().catch(() => {}); }, [video, imgIdx]);

  const backdrop = {
    position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover",
    filter: "blur(40px) saturate(1.2)", transform: "scale(1.15)", opacity: 0.6, display: "block",
  };
  const fg = {
    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    maxWidth: "92%", maxHeight: "92%", width: "auto", height: "auto", objectFit: "contain",
    filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.25))", display: "block",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, backgroundColor: "rgba(28,28,28,0.85)", zIndex: 9000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: mobile ? "12px" : "32px", opacity: shown ? 1 : 0, transition: "opacity 300ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "scale(1)" : "scale(0.94)",
          transition: "opacity 250ms ease, transform 250ms ease",
          position: "relative", backgroundColor: "#F7F7F7", border: "1px solid #AAFF00",
          borderRadius: "12px", width: mobile ? "92vw" : "min(1000px, 90vw)",
          maxHeight: mobile ? "90vh" : "85vh", display: "flex",
          flexDirection: mobile ? "column" : "row", overflowY: "auto",
        }}
      >
        <button
          onClick={onClose} aria-label="닫기"
          onMouseEnter={(e) => { e.currentTarget.style.color = "#6B6B6B"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#1A1A1A"; }}
          style={{
            position: "absolute", top: "14px", right: "14px", zIndex: 10, background: "none",
            border: "none", fontSize: "1.75rem", fontWeight: 800, color: "#1A1A1A", cursor: "pointer",
            lineHeight: 1, padding: "4px 8px", transition: "color 150ms ease", fontFamily: "inherit",
          }}
        >
          ×
        </button>

        {/* 이미지 영역 */}
        <div
          style={{
            flex: mobile ? "none" : "3", display: "flex", flexDirection: "column",
            backgroundColor: "#EBEBEB", minHeight: mobile ? "220px" : "0",
            borderRadius: mobile ? "12px 12px 0 0" : "12px 0 0 12px", overflow: "hidden",
          }}
        >
          <div
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => { dragRef.current = null; }}
            onDragStart={(e) => e.preventDefault()}
            style={{
              flex: 1, position: "relative", minHeight: mobile ? "min(56vh, 460px)" : "360px", overflow: "hidden", backgroundColor: "#1C1C1C",
              touchAction: multi ? "pan-y" : "auto", cursor: multi ? "grab" : "default", userSelect: "none",
            }}
          >
            {!broken && src ? (
              <>
                {video ? (
                  <video key={`bd-${imgIdx}`} src={src} autoPlay loop muted playsInline aria-hidden="true" style={backdrop} />
                ) : (
                  <img key={`bd-${imgIdx}`} src={src} alt="" aria-hidden="true" style={backdrop} />
                )}
                {video ? (
                  <video key={`fg-${imgIdx}`} ref={(el) => { videoRef.current = el; fgRef.current = el; }} src={src} autoPlay loop muted playsInline onError={() => setBroken(true)} style={fg} />
                ) : (
                  <img key={`fg-${imgIdx}`} ref={fgRef} src={src} alt={project.title} draggable={false} onError={() => setBroken(true)} style={fg} />
                )}
              </>
            ) : (
              <span
                style={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  fontWeight: 700, fontSize: mobile ? "2rem" : "3rem", color: "#F7F7F7", opacity: 0.18,
                  whiteSpace: "nowrap", pointerEvents: "none",
                }}
              >
                {project.category}
              </span>
            )}
            {titles?.[imgIdx] && (
              <span
                style={{
                  position: "absolute", bottom: "12px", left: "12px", zIndex: 10, fontSize: "0.68rem",
                  fontWeight: 700, color: "#FFFFFF", backgroundColor: "rgba(28,28,28,0.6)",
                  padding: "4px 8px", letterSpacing: "0.02em", lineHeight: 1.4, maxWidth: "70%",
                }}
              >
                {titles[imgIdx]}
              </span>
            )}
            {multi && imgIdx > 0 && (
              <ArrowButton side="left" label="이전 이미지" onClick={() => goTo(imgIdx - 1)} />
            )}
            {multi && imgIdx < images.length - 1 && (
              <ArrowButton side="right" label="다음 이미지" onClick={() => goTo(imgIdx + 1)} />
            )}
            <span
              style={{
                position: "absolute", bottom: "12px", right: "12px", zIndex: 10, fontSize: "0.6rem",
                fontWeight: 600, color: "rgba(247,247,247,0.7)", letterSpacing: "0.06em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {pad(imgIdx + 1)} / {pad(images.length)}
            </span>
          </div>

          {images.length > 1 && (
            <div
              style={{
                display: "flex", gap: "8px", padding: "12px 16px", borderTop: "1px solid #D4D4D4", backgroundColor: "#EBEBEB",
                // 모바일은 한 줄 가로 스크롤 (큰 이미지 영역이 줄어들지 않도록)
                flexWrap: mobile ? "nowrap" : "wrap", overflowX: mobile ? "auto" : "visible", flexShrink: 0,
              }}
            >
              {images.map((im, i) => (
                <div
                  key={i}
                  ref={(el) => { thumbRefs.current[i] = el; }}
                  title={titles?.[i]}
                  onClick={() => goTo(i)}
                  style={{
                    width: "52px", height: "68px", backgroundColor: "#D4D4D4",
                    border: i === imgIdx ? "2px solid #AAFF00" : "1px solid rgba(26,26,26,0.15)",
                    cursor: "pointer", overflow: "hidden", flexShrink: 0, opacity: i === imgIdx ? 1 : 0.45,
                    transition: "border-color 150ms ease, opacity 150ms ease", position: "relative",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {isVideo(im) ? (
                    <>
                      <div style={{ position: "absolute", inset: 0, backgroundColor: "#1C1C1C" }} />
                      <span style={{ position: "relative", zIndex: 1, fontSize: "1.1rem", color: "#AAFF00", lineHeight: 1 }}>▶</span>
                    </>
                  ) : (
                    <img
                      src={im} alt={`${project.title} ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 텍스트 영역 */}
        <div
          style={{
            flex: mobile ? "none" : "2", padding: mobile ? "24px 20px 28px" : "40px 36px 36px",
            display: "flex", flexDirection: "column", gap: "16px", minWidth: 0, overflowY: "auto",
          }}
        >
          <p style={{ alignSelf: "flex-start", fontWeight: 600, fontSize: "0.62rem", color: "#1A1A1A", backgroundColor: "#AAFF00", padding: "2px 6px", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "-4px" }}>
            {project.category}
          </p>
          {project.award && (
            <div
              style={{
                display: "inline-block", alignSelf: "flex-start", backgroundColor: "#AAFF00", color: "#1A1A1A",
                fontWeight: 600, fontSize: "0.62rem", padding: "4px 10px", borderRadius: "4px",
                letterSpacing: "0.02em", lineHeight: 1.5, marginTop: "-8px",
              }}
            >
              {project.award.startsWith("✦") ? project.award : `✦ ${project.award}`}
            </div>
          )}
          {project.series && (
            <div style={{ marginTop: "-4px" }}>
              <span style={{ ...labelStyle, marginBottom: 0, marginRight: "8px" }}>시리즈</span>
              <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1A1A1A" }}>{project.series}</span>
            </div>
          )}
          <h2 style={{ fontWeight: 800, fontSize: mobile ? "1.5rem" : "2rem", color: "#1A1A1A", lineHeight: 1.1, letterSpacing: "-0.03em", margin: 0 }}>
            {project.title}
          </h2>
          <p style={{ fontWeight: 400, fontSize: "0.78rem", color: "#8C8C8C", marginTop: "-8px" }}>{project.year}</p>
          <div style={{ height: "1px", backgroundColor: "#D4D4D4", flexShrink: 0 }} />
          {project.description && <p style={bodyStyle}>{project.description}</p>}
          {project.role && (
            <div style={{ marginTop: "8px" }}>
              <p style={labelStyle}>역할</p>
              <p style={bodyStyle}>{project.role}</p>
            </div>
          )}
          {project.seriesDescription && (
            <div style={{ marginTop: "8px" }}>
              <p style={labelStyle}>시리즈 소개</p>
              <p style={{ ...bodyStyle, opacity: 0.8 }}>{project.seriesDescription}</p>
            </div>
          )}
          {project.process && (
            <div style={{ marginTop: "8px" }}>
              <p style={labelStyle}>작업 과정</p>
              <p style={{ ...bodyStyle, opacity: 0.9 }}>{project.process}</p>
            </div>
          )}
          {project.tools?.length > 0 && (
            <div>
              <p style={labelStyle}>사용 도구</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {project.tools.map((t) => (
                  <span key={t} style={{ border: "1px solid #1A1A1A", padding: "3px 10px", fontSize: "0.65rem", color: "#1A1A1A", whiteSpace: "nowrap" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {project.board && (
            <p style={{ ...bodyStyle, margin: 0 }}>
              <a
                href={project.board.href} target="_blank" rel="noopener noreferrer"
                style={{ color: "#1A1A1A", textDecoration: "underline", textDecorationColor: "#AAFF00", textDecorationThickness: "2px", textUnderlineOffset: "4px" }}
              >
                {project.board.label} ↗
              </a>
            </p>
          )}
          {project.link && (
            <div>
              <a
                href={project.link} target="_blank" rel="noopener noreferrer"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#AAFF00"; e.currentTarget.style.borderColor = "#AAFF00"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#1A1A1A"; }}
                style={{
                  display: "inline-block", border: "1px solid #1A1A1A", padding: "8px 16px", borderRadius: "4px",
                  fontWeight: 600, fontSize: "0.875rem", color: "#1A1A1A", textDecoration: "none",
                  transition: "background-color 150ms ease, border-color 150ms ease", letterSpacing: "0.02em",
                }}
              >
                {project.linkLabel || "웹사이트"} ↗
              </a>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid #D4D4D4", marginTop: "4px", flexShrink: 0 }}>
            <button onClick={onPrev} {...limeHover} style={navBtnStyle}>← 이전</button>
            <span style={{ fontSize: "0.68rem", color: "#8C8C8C", fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em" }}>
              {pad(index + 1)} / {pad(projects.length)}
            </span>
            <button onClick={onNext} {...limeHover} style={navBtnStyle}>다음 →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 메인 갤러리 ---------- */
export default function WorkGallery({ projects = [], id = "work", sectionBackground = "transparent" }) {
  const n = projects.length;
  const [mode, setMode] = useState(DEFAULT_MODE);
  const [current, setCurrent] = useState(1);
  const [overflowing, setOverflowing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selected, setSelected] = useState(null);
  const [closing, setClosing] = useState(false);

  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const videoRefs = useRef([]);
  const rafRef = useRef(0);
  const rotRef = useRef(0);
  const modeRef = useRef(DEFAULT_MODE);
  const mouseRef = useRef({ x: 0, y: 0, inside: false });
  const hoveredRef = useRef(-1);
  const currentRef = useRef(1);
  const pausedRef = useRef(false);
  const selectedRef = useRef(null);
  const smoothScrollRef = useRef(0);
  const scrollRef = useRef(0);
  const repelRef = useRef([]);
  const stateRef = useRef([]);
  const touchRef = useRef(null);

  // 카드 개수에 맞춰 상태 배열 준비
  if (repelRef.current.length !== n) {
    repelRef.current = Array.from({ length: n }, () => ({ x: 0, y: 0 }));
    const introScale = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.9 : 0.3;
    stateRef.current = Array.from({ length: n }, () => ({ x: 0, y: 0, z: 0, rotY: 0, rotZ: 0, rotX: 0, scale: introScale, opacity: 0 }));
  }

  useEffect(() => { modeRef.current = mode; scrollRef.current = 0; }, [mode]);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  // 개별 작품 링크: #work/<작품 id>로 들어오면 해당 모달 열기
  useEffect(() => {
    const sync = () => {
      const m = window.location.hash.match(/^#work\/(.+)$/);
      if (!m) return;
      const p = projects.find((x) => String(x.id) === decodeURIComponent(m[1]));
      if (!p) return;
      document.getElementById(id)?.scrollIntoView();
      pausedRef.current = true;
      setSelected(p);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [projects, id]);

  // 모달을 열거나 넘기면 주소도 바꾸기, 닫으면 #work로
  useEffect(() => {
    const hash = selected ? `#work/${encodeURIComponent(selected.id)}` : "#work";
    if (!selected && !window.location.hash.startsWith("#work/")) return;
    if (window.location.hash !== hash) history.replaceState(null, "", hash);
  }, [selected]);

  const open = (p) => {
    pausedRef.current = true;
    hoveredRef.current = -1;
    mouseRef.current = { ...mouseRef.current, inside: false };
    setSelected(p);
  };
  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setClosing(false); setSelected(null); pausedRef.current = false; }, 260);
  }, []);
  const next = useCallback(() => {
    const cur = selectedRef.current; if (!cur) return;
    const i = projects.findIndex((p) => p.id === cur.id);
    setSelected(projects[(i + 1) % projects.length]);
  }, [projects]);
  const prev = useCallback(() => {
    const cur = selectedRef.current; if (!cur) return;
    const i = projects.findIndex((p) => p.id === cur.id);
    setSelected(projects[(i - 1 + projects.length) % projects.length]);
  }, [projects]);

  // 키보드: ESC 닫기 (← →는 상세 모달이 이미지 넘기기 → 끝에서 이전/다음 작품으로 처리)
  useEffect(() => {
    const onKey = (e) => {
      if (!selectedRef.current) return;
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // 마우스 휠 (TILT 모드에서 좌우 스크롤)
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const onWheel = (e) => {
      if (modeRef.current !== "TILT") return; // 다른 모드에서는 페이지 스크롤 허용
      e.preventDefault();
      scrollRef.current += e.deltaY * 0.8;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // 반응형
  useEffect(() => {
    const measure = () => {
      const el = containerRef.current; if (!el) return;
      const w = el.clientWidth;
      const mobile = w < 600;
      const step = (mobile ? 110 : CARD_W) + (mobile ? 14 : 24);
      setOverflowing(n * step > w);
      setIsMobile(mobile);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [n]);

  // 첫 진입 연출: 패널이 처음 50% 이상 보일 때까지 카드를 정중앙(scale 0.3, 투명)에 붙잡아 두었다가
  // 풀어 주면 기존 lerp가 현재 모드 배치로 펼침. 페이지당 한 번, 동작 줄이기 설정이면 생략.
  const introRef = useRef(
    typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const el = containerRef.current;
    if (introRef.current || !el) return;
    if (!("IntersectionObserver" in window)) { introRef.current = true; return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { introRef.current = true; io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 애니메이션 루프
  useEffect(() => {
    const tick = () => {
      if (!pausedRef.current) rotRef.current += 0.15;
      const el = containerRef.current;
      if (!el) { rafRef.current = requestAnimationFrame(tick); return; }

      const W = el.clientWidth;
      const H = el.clientHeight;
      const m = modeRef.current;
      const rot = rotRef.current;
      const mouse = mouseRef.current;

      if (m === "TILT") {
        const mobile = W < 600;
        const step = (mobile ? 110 : CARD_W) + (mobile ? 14 : 24);
        const max = Math.max(0, (n * step) / 2 - W / 2 + step / 2);
        scrollRef.current = Math.max(-max, Math.min(max, scrollRef.current));
      } else {
        scrollRef.current *= 0.85;
      }
      smoothScrollRef.current += (scrollRef.current - smoothScrollRef.current) * 0.12;
      const offset = m === "TILT" ? smoothScrollRef.current : 0;

      const active = !pausedRef.current && mouse.inside;
      const mx = active ? mouse.x - W / 2 : -99999;
      const my = active ? mouse.y - H / 2 : -99999;

      let best = 0;
      let bestDepth = -Infinity;

      for (let i = 0; i < n; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const s = stateRef.current[i];
        if (!introRef.current) {
          // 첫 진입 전: 정중앙에 작게, 투명하게 대기
          card.style.transform = "translateX(0px) translateY(0px) translateZ(0px) rotateY(0deg) rotateZ(0deg) rotateX(0deg) scale(0.3)";
          card.style.opacity = "0";
          continue;
        }
        const t = getLayout(i, m, rot, W, s.rotY, n);
        const rp = repelRef.current[i];

        // 커서 근처 카드 밀어내기
        const baseX = t.x - offset;
        const dx = baseX + rp.x - mx;
        const dy = t.y + rp.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let tx = 0, ty = 0;
        if (active && dist < 220 && dist > 1) {
          const f = 70 * (1 - dist / 220);
          tx = (dx / dist) * f;
          ty = (dy / dist) * f;
        }
        rp.x += (tx - rp.x) * 0.12;
        rp.y += (ty - rp.y) * 0.12;

        // 목표값으로 부드럽게 이동
        s.x += (baseX + rp.x - s.x) * 0.1;
        s.y += (t.y + rp.y - s.y) * 0.1;
        s.z += (t.z - s.z) * 0.1;
        s.scale += (t.scale - s.scale) * 0.1;
        s.opacity += (t.opacity - s.opacity) * 0.1;
        s.rotZ += (t.rotZ - s.rotZ) * 0.1;
        s.rotX += (t.rotX - s.rotX) * 0.1;
        let dRot = t.rotY - s.rotY;
        while (dRot > 180) dRot -= 360;
        while (dRot < -180) dRot += 360;
        s.rotY += dRot * 0.1;

        const hovered = hoveredRef.current === i;
        const z = hovered ? s.z + 60 : s.z;
        const scale = hovered ? Math.max(s.scale, 1.08) : s.scale;
        const opacity = hovered ? 1 : s.opacity;

        card.style.transform =
          `translateX(${s.x.toFixed(1)}px) translateY(${s.y.toFixed(1)}px) translateZ(${z.toFixed(1)}px) ` +
          `rotateY(${s.rotY.toFixed(2)}deg) rotateZ(${s.rotZ.toFixed(2)}deg) rotateX(${s.rotX.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = hovered ? "20" : String(t.zIdx);
        card.style.outline = hovered ? "2px solid #AAFF00" : "none";
        card.style.outlineOffset = "-2px";
        card.style.boxShadow = hovered ? "0 8px 40px rgba(0,0,0,0.14)" : "none";

        const depth = m === "TILT" ? Math.max(0, 1 - Math.abs(baseX) / Math.max(W * 0.5, 1)) : t.depth;
        if (depth > bestDepth) { bestDepth = depth; best = i; }
      }

      const front = best + 1;
      if (front !== currentRef.current) { currentRef.current = front; setCurrent(front); }

      // 정면 또는 호버 중인 카드의 영상만 재생
      for (let i = 0; i < n; i++) {
        const v = videoRefs.current[i];
        if (!v) continue;
        if (!pausedRef.current && (i === best || hoveredRef.current === i)) {
          if (v.paused) v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [n]);

  const onMouseMove = (e) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (r) mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, inside: true };
  };
  const onMouseLeave = () => { mouseRef.current = { ...mouseRef.current, inside: false }; };
  const onTouchStart = (e) => {
    touchRef.current = { x: e.touches[0].clientX, rot: rotRef.current, scroll: scrollRef.current };
  };
  const onTouchMove = (e) => {
    if (!touchRef.current) return;
    const dx = e.touches[0].clientX - touchRef.current.x;
    if (modeRef.current === "TILT") scrollRef.current = touchRef.current.scroll - dx * 1.2;
    else rotRef.current = touchRef.current.rot + dx * 0.35;
  };
  const onTouchEnd = () => { touchRef.current = null; };

  return (
    <section
      id={id}
      style={{
        position: "relative", backgroundColor: sectionBackground, minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "32px clamp(16px, 4vw, 48px)", boxSizing: "border-box",
      }}
    >
      <style>{`@keyframes scroll-hint-sway{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}`}</style>
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position: "relative", backgroundColor: "#EBEBEB", borderRadius: "16px", height: "80vh",
          overflow: "hidden", perspective: "1500px", perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, zIndex: 30, display: "flex",
            justifyContent: "space-between", alignItems: "center", padding: "24px 28px",
            flexWrap: "wrap", gap: "12px",
          }}
        >
          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1A1A1A", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            작업
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "nowrap", overflowX: "auto", scrollbarWidth: "none" }}>
            {MODES.map((m) => (
              <ModeButton key={m} label={m} active={mode === m} onClick={() => setMode(m)} />
            ))}
          </div>
        </div>

        {projects.map((p, i) => (
          <Card
            key={p.id}
            project={p}
            setRef={(el) => { cardRefs.current[i] = el; }}
            setVideoRef={(el) => { videoRefs.current[i] = el; }}
            onEnter={() => { hoveredRef.current = i; }}
            onLeave={() => { hoveredRef.current = -1; }}
            onClick={() => open(p)}
          />
        ))}

        <div
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 30, display: "flex",
            justifyContent: "space-between", alignItems: "center", padding: "24px 28px",
            flexWrap: "wrap", gap: "8px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ fontSize: "0.75rem", color: "rgba(26,26,26,0.6)", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
              넘겨서 보기 →
            </p>
            {overflowing && mode === "TILT" && (
              <p style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.68rem", color: "#8C8C8C", letterSpacing: "0.12em", margin: 0 }}>
                <span style={{ animation: "scroll-hint-sway 1.8s ease-in-out infinite", display: "inline-block", fontSize: "12px", lineHeight: 1 }}>↔</span>
                {isMobile ? "좌우로 스와이프" : "마우스 휠로 좌우 탐색"}
              </p>
            )}
          </div>
          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1A1A1A", letterSpacing: "0.04em", fontVariantNumeric: "tabular-nums" }}>
            {pad(current)} — {pad(n)}
          </p>
        </div>
      </div>


      {selected && (
        <DetailModal
          project={selected}
          projects={projects}
          isClosing={closing}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}
