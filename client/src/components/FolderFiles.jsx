// 닫힌 작업 파일이 열리면서 작품들이 파일철처럼 나열되는 섹션
// 사용법: <FolderFiles projects={projects} />
// 파일(작품)을 누르면 주소가 #work/작품id 로 바뀌고 작업 갤러리 쪽으로 이동합니다.
// onSelect(project)를 넘기면 그 함수가 대신 실행됩니다.
import { useState, useRef, useEffect, useCallback } from "react";

const INK = "#1A1A1A";
const LIME = "#AAFF00";
const PAPER = "#FFFFFF";
const CREAM = "#EFECE4";
const LINE = "#D4D4D4";
const MUTED = "#8C8C8C";
const CLOSED_H = 580;
const FLAP_H = 400;
const isVideo = (s) => typeof s === "string" && /\.(mp4|webm|mov)$/i.test(s);
const pad = (n) => String(n).padStart(2, "0");

const css = `
.ff{position:relative;padding:clamp(56px,8vw,96px) clamp(16px,4vw,48px) 0;max-width:1200px;margin:0 auto;box-sizing:border-box}
.ff *{box-sizing:border-box}
.ff-folder{position:relative;perspective:1800px;perspective-origin:50% 0%}
.ff-tab{position:relative;z-index:1;width:min(420px,70%);height:52px;background:${INK};border-radius:14px 14px 0 0;
  padding:10px 20px 0;color:${PAPER};font-size:.68rem;line-height:1.45;display:flex;gap:28px;transition:background-color .5s ease,color .5s ease}
.ff-tab span{opacity:.75}
.ff-tab b{font-weight:600;opacity:1;margin-left:6px}
.ff.is-open .ff-tab{background:${LIME};color:${INK}}
.ff-body{position:relative;background:${INK};border-radius:0 18px 18px 18px;overflow:hidden;
  transition:background-color .5s ease .15s,height .7s cubic-bezier(.65,0,.35,1)}
.ff.is-open .ff-body{background:${LIME}}
.ff-foot{position:absolute;left:0;right:0;bottom:0;height:96px;display:flex;align-items:center;justify-content:space-between;
  padding:0 28px;color:rgba(255,255,255,.72);font-size:.72rem;transition:opacity .3s ease}
.ff.is-open .ff-foot{opacity:0;pointer-events:none}

/* 앞 덮개 */
.ff-flap{position:absolute;left:0;right:0;top:0;height:${FLAP_H}px;z-index:5;background-color:${PAPER};
  background-image:linear-gradient(${LINE}55 1px,transparent 1px),linear-gradient(90deg,${LINE}55 1px,transparent 1px);
  background-size:28px 28px;border-radius:0 18px 28px 28px;transform-origin:50% 0%;transform-style:preserve-3d;
  transition:transform .8s cubic-bezier(.6,0,.3,1) .35s,opacity .25s ease .9s;box-shadow:0 18px 30px -18px rgba(0,0,0,.45)}
.ff.is-open .ff-flap{transform:rotateX(-104deg);opacity:0;pointer-events:none}
.ff-meta{display:flex;justify-content:space-between;padding:22px 28px 0;font-size:.72rem;color:${INK}}
.ff-title{position:absolute;left:0;right:0;top:47%;transform:translateY(-50%);text-align:center}
.ff-title h2{margin:0;font-size:clamp(2.4rem,7vw,4.6rem);font-weight:800;letter-spacing:-.05em;line-height:1;color:${INK}}
.ff-tapes{display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:18px}
.ff-tape{display:inline-block;padding:4px 14px;font-size:clamp(.78rem,1.6vw,.95rem);font-weight:700}
.ff-tape.l{background:${LIME};color:${INK};transform:rotate(-2.5deg)}
.ff-tape.d{background:${INK};color:${PAPER};transform:rotate(1.5deg)}

/* 끈 단추 */
.ff-tie{position:absolute;left:50%;top:${FLAP_H - 41}px;z-index:8;transform:translateX(-50%);width:80px;height:170px;
  background:none;border:0;padding:0;cursor:pointer;color:${INK};font:inherit}
.ff-tie:focus-visible{outline:2px solid ${LIME};outline-offset:6px;border-radius:8px}
.ff-btn{position:absolute;left:50%;width:46px;height:46px;margin-left:-23px;border-radius:50%;background:${LIME};
  box-shadow:0 4px 10px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;transition:transform .45s ease}
.ff-btn::after{content:"";width:14px;height:14px;border-radius:50%;background:${PAPER};box-shadow:inset 0 0 0 4px ${INK}}
.ff-btn.t{top:18px}
.ff-btn.b{top:88px}
.ff-string{position:absolute;left:0;top:0;pointer-events:none}
.ff-string path{fill:none;stroke:${CREAM};stroke-width:1.8;stroke-dasharray:190;stroke-dashoffset:0;transition:stroke-dashoffset .35s ease}
.ff-tie-label{position:absolute;left:50%;top:142px;transform:translateX(-50%);white-space:nowrap;font-size:.8rem;font-weight:600;color:${PAPER}}
.ff-tie:hover .ff-btn.t{transform:rotate(-40deg)}
.ff.is-open .ff-tie{pointer-events:none}
.ff.is-open .ff-btn.t{transform:rotate(-360deg) scale(.6);opacity:0;transition:transform .45s ease,opacity .2s ease .35s}
.ff.is-open .ff-btn.b{transform:scale(.6);opacity:0;transition:transform .4s ease .2s,opacity .2s ease .35s}
.ff.is-open .ff-string path{stroke-dashoffset:190}
.ff.is-open .ff-tie-label{opacity:0;transition:opacity .2s ease}

/* 안쪽 파일철 */
.ff-inner{padding:26px clamp(18px,3vw,32px) 34px;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility 0s linear .3s}
.ff.is-open .ff-inner{opacity:1;visibility:visible;transition:opacity .3s ease .5s}
.ff-head{display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-bottom:26px;color:${INK}}
.ff-head h3{margin:0;font-size:1.25rem;font-weight:800;letter-spacing:-.03em}
.ff-close{background:none;border:1px solid ${INK};border-radius:999px;padding:6px 14px;font:inherit;font-size:.78rem;font-weight:600;color:${INK};cursor:pointer}
.ff-close:hover{background:${INK};color:${LIME}}
.ff-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(176px,1fr));gap:30px 16px}
.ff-file{position:relative;display:block;width:100%;background:none;border:0;padding:0;text-align:left;cursor:pointer;font:inherit;
  opacity:0;transform:translateY(46px)}
.ff.is-open .ff-file{animation:ff-in .55s cubic-bezier(.2,.7,.2,1) forwards;animation-delay:calc(.75s + var(--i) * 70ms)}
@keyframes ff-in{to{opacity:1;transform:translateY(0)}}
.ff-file-tab{display:inline-flex;align-items:center;gap:8px;height:24px;padding:0 12px;border-radius:9px 9px 0 0;font-size:.64rem;font-weight:700}
.ff-file-card{position:relative;border-radius:0 12px 12px 12px;padding:12px 12px 14px;height:236px;display:flex;flex-direction:column;
  transition:transform .25s ease,box-shadow .25s ease}
.ff-file.dark .ff-file-tab,.ff-file.dark .ff-file-card{background:${INK};color:${PAPER}}
.ff-file.cream .ff-file-tab,.ff-file.cream .ff-file-card{background:${CREAM};color:${INK}}
.ff-file:hover .ff-file-card,.ff-file:focus-visible .ff-file-card{transform:translateY(-10px) rotate(-1deg);box-shadow:0 16px 24px -14px rgba(0,0,0,.5)}
.ff-file:focus-visible{outline:none}
.ff-file:focus-visible .ff-file-card{outline:2px solid ${INK};outline-offset:3px}
.ff-thumb{position:relative;flex:1;min-height:0;border-radius:6px;overflow:hidden;background:rgba(127,127,127,.25)}
.ff-thumb img,.ff-thumb video{width:100%;height:100%;object-fit:cover;object-position:top;display:block;transform:rotate(-2deg) scale(1.06)}
.ff-clip{position:absolute;top:-8px;right:14px;width:12px;height:34px;border:2px solid ${MUTED};border-radius:6px;z-index:2}
.ff-file-title{margin:10px 0 2px;font-size:.92rem;font-weight:800;letter-spacing:-.02em;line-height:1.3;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ff-file-sub{font-size:.68rem;opacity:.7}
.ff-award{position:absolute;left:10px;top:10px;z-index:2;background:${LIME};color:${INK};font-size:.6rem;font-weight:800;padding:2px 7px;border-radius:3px}

@media (max-width:640px){
  .ff-tab{gap:14px;width:86%}
  .ff-meta{padding:18px 18px 0;font-size:.62rem}
  .ff-foot{padding:0 18px;font-size:.62rem}
  .ff-grid{grid-template-columns:repeat(2,1fr);gap:24px 12px}
  .ff-file-card{height:210px}
}
@media (prefers-reduced-motion:reduce){
  .ff *,.ff{transition:none !important;animation:none !important}
  .ff.is-open .ff-file{opacity:1;transform:none}
}
`;

export default function FolderFiles({ projects = [], id = "files", onSelect, ownerName = "박채빈", email = "" }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const innerRef = useRef(null);
  const [height, setHeight] = useState(CLOSED_H);

  const measure = useCallback(() => {
    if (!open) { setHeight(CLOSED_H); return; }
    const h = innerRef.current ? innerRef.current.scrollHeight : CLOSED_H;
    setHeight(Math.max(CLOSED_H, h));
  }, [open]);

  useEffect(() => {
    if (!open) { setHeight(CLOSED_H); return; }
    const t = setTimeout(measure, 450); // 덮개가 열리기 시작할 때 몸통을 늘림
    const ro = new ResizeObserver(() => { if (open) measure(); });
    if (innerRef.current) ro.observe(innerRef.current);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [open, measure]);

  const pick = (p) => {
    if (onSelect) { onSelect(p); return; }
    window.location.hash = `#work/${p.id}`;
    const target = document.getElementById("work");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id={id} className={`ff${open ? " is-open" : ""}`} aria-label="작업 파일">
      <style>{css}</style>
      <div className="ff-folder">
        <div className="ff-tab" aria-hidden="true">
          <div><span>NAME</span><b>{ownerName}</b><br /><span>FILE</span><b>{pad(projects.length)}건</b></div>
          <div><span>DATE</span><b>2026</b></div>
        </div>

        <div className="ff-body" ref={bodyRef} style={{ height }}>
          {/* 앞 덮개 */}
          <div className="ff-flap" aria-hidden={open}>
            <div className="ff-meta">
              <span>(작업 파일)</span>
              <span>(2026)</span>
              <span>(홍보·아카이빙 · 디자인)</span>
            </div>
            <div className="ff-title">
              <h2>{ownerName}의 작업 파일</h2>
              <div className="ff-tapes">
                <span className="ff-tape l">알리고 기록한 것들을 모았어요</span>
                <span className="ff-tape d">작업 {projects.length}건이 들어 있어요</span>
              </div>
            </div>
          </div>

          <button className="ff-tie" onClick={() => setOpen(true)} aria-expanded={open} aria-controls={`${id}-inner`}>
            <svg className="ff-string" width="80" height="130" viewBox="0 0 80 130" aria-hidden="true">
              <path d="M40 41 C 8 56, 72 66, 40 78 S 12 98, 40 111" />
            </svg>
            <span className="ff-btn t" />
            <span className="ff-btn b" />
            <span className="ff-tie-label">(파일 열기)</span>
          </button>

          <div className="ff-foot" aria-hidden="true">
            <span>{email}</span>
            <span>© 2026 {ownerName}</span>
          </div>

          {/* 안쪽 파일철 */}
          <div className="ff-inner" id={`${id}-inner`} ref={innerRef}>
            <div className="ff-head">
              <h3>작업 파일 {projects.length}건</h3>
              <button className="ff-close" onClick={() => setOpen(false)}>파일 닫기</button>
            </div>
            <div className="ff-grid">
              {projects.map((p, i) => {
                const src = p.images?.[0];
                const tone = i % 2 === 0 ? "dark" : "cream";
                return (
                  <button
                    key={p.id}
                    className={`ff-file ${tone}`}
                    style={{ "--i": i }}
                    onClick={() => pick(p)}
                    tabIndex={open ? 0 : -1}
                  >
                    <span className="ff-file-tab">
                      <span>FILE {pad(i + 1)}</span>
                      <span style={{ opacity: 0.7, fontWeight: 500 }}>{p.year}</span>
                    </span>
                    <span className="ff-file-card">
                      <span className="ff-clip" aria-hidden="true" />
                      <span className="ff-thumb">
                        {p.award && <span className="ff-award">수상</span>}
                        {src && (isVideo(src)
                          ? <video src={src} muted playsInline preload="metadata" />
                          : <img src={src} alt="" loading="lazy" />)}
                      </span>
                      <span className="ff-file-title">{p.title}</span>
                      <span className="ff-file-sub">{p.category}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
