import { useEffect, useRef, useState } from "react";

// 갤러리 아래 작품 목록.
// 호버(데스크톱): 라임 배경이 왼쪽→오른쪽으로 차오르고, 커서 오른쪽 아래 24px에 첫 이미지 썸네일이 따라옴.
// 썸네일 위치는 갤러리 루프와 별개의 requestAnimationFrame(lerp 0.2)으로, 보일 때만 돈다.
const OFFSET = 24;
const THUMB_W = 160;

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function WorkList({ projects, onOpen }) {
  const [hovered, setHovered] = useState(null); // 호버 중인 작품 id
  const [preview, setPreview] = useState(null); // 썸네일로 보여 줄 작품
  const [shown, setShown] = useState(false);
  const thumbRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const hideTimer = useRef(0);

  const stopLoop = () => { cancelAnimationFrame(raf.current); raf.current = 0; };
  const startLoop = () => {
    if (raf.current) return;
    const k = reducedMotion() ? 1 : 0.2;
    const step = () => {
      pos.current.x += (target.current.x - pos.current.x) * k;
      pos.current.y += (target.current.y - pos.current.y) * k;
      if (thumbRef.current) {
        thumbRef.current.style.transform = `translate3d(${pos.current.x.toFixed(1)}px, ${pos.current.y.toFixed(1)}px, 0)`;
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => () => { stopLoop(); clearTimeout(hideTimer.current); }, []);

  const onEnterRow = (p, e) => {
    if (!canHover()) return; // 터치 기기: 기존대로 (채움·썸네일 없음)
    setHovered(p.id);
    clearTimeout(hideTimer.current);
    target.current = { x: e.clientX + OFFSET, y: e.clientY + OFFSET };
    if (!shown) pos.current = { ...target.current }; // 처음 나타날 때는 커서 옆에서 바로
    setPreview(p);
    setShown(true);
    startLoop();
  };
  const onMove = (e) => {
    target.current = { x: e.clientX + OFFSET, y: e.clientY + OFFSET };
  };
  const onLeaveList = () => {
    setHovered(null);
    setShown(false);
    // 페이드아웃(150ms)이 끝나면 루프 정지
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(stopLoop, reducedMotion() ? 0 : 160);
  };

  const src = preview?.images?.[0];

  return (
    <>
      <ul
        onMouseLeave={onLeaveList}
        onMouseMove={onMove}
        style={{ listStyle: "none", margin: "24px 0 0", padding: 0, borderTop: "1px solid #1A1A1A" }}
      >
        {projects.map((p) => {
          const on = hovered === p.id;
          return (
            <li key={p.id} style={{ borderBottom: "1px solid #E4E4E4" }}>
              <button
                type="button"
                onClick={() => onOpen(p)}
                onMouseEnter={(e) => onEnterRow(p, e)}
                onFocus={() => setHovered(p.id)}
                onBlur={() => setHovered(null)}
                style={{
                  position: "relative", width: "100%", display: "flex", flexWrap: "wrap", alignItems: "baseline",
                  columnGap: "16px", rowGap: "4px", padding: "14px 0", background: "none", border: "none",
                  textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "#1A1A1A",
                }}
              >
                {/* 왼쪽에서 오른쪽으로 차오르는 라임 배경 */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute", inset: 0, backgroundColor: "#AAFF00", transformOrigin: "left center",
                    transform: on ? "scaleX(1)" : "scaleX(0)", transition: "transform 250ms ease", zIndex: 0,
                  }}
                />
                <span style={{ position: "relative", width: "48px", flexShrink: 0, color: "#6B6B6B", fontSize: "0.875rem" }}>{p.year}</span>
                <span style={{ position: "relative", fontWeight: 700, fontSize: "1rem" }}>{p.title}</span>
                <span style={{ position: "relative", color: "#6B6B6B", fontSize: "0.75rem", letterSpacing: "0.06em" }}>{p.category}</span>
                {p.award && (
                  <span style={{ position: "relative", fontSize: "0.75rem", color: "#1A1A1A" }}>
                    {p.award.startsWith("✦") ? p.award : `✦ ${p.award}`}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* 커서를 따라오는 썸네일 (데스크톱만) */}
      {src && (
        <div
          ref={thumbRef}
          aria-hidden="true"
          style={{
            position: "fixed", left: 0, top: 0, zIndex: 50, width: `${THUMB_W}px`, pointerEvents: "none",
            border: "1px solid #D4D4D4", backgroundColor: "#F7F7F7", lineHeight: 0,
            opacity: shown ? 1 : 0, transition: "opacity 150ms ease", willChange: "transform, opacity",
            transform: `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`,
          }}
        >
          <img src={src} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
      )}
    </>
  );
}
