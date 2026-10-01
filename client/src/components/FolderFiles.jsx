// 큰 파일 자체가 작품 파일이 되는 파일철 섹션
// - 큰 파일 윗변에 작품별 이름표 탭이 붙어 있고, 탭을 누르면 그 작품 파일이 앞으로 나옵니다.
// - 처음에는 이름표 하나만 보이는 닫힌 파일이고, 끈 단추를 풀면 표지가 젖혀지며 작품 탭들이 솟아오릅니다.
// 사용법: <FolderFiles projects={projects} email="..." />
// 주소 #file/작품id 로 들어오면 그 파일이 열린 상태로 보입니다.
import { useState, useRef, useEffect, useCallback } from "react";

const INK = "#1A1A1A";
const LIME = "#AAFF00";
const PAPER = "#FFFFFF";
const CREAM = "#EFECE4";
const LINE = "#D4D4D4";
const MIN_H = 600;
const CLOSED_H = 580;
const FLAP_H = 400;
const SWAP_MS = 560;
const HEADER_H = 64; // 사이트 고정 헤더 높이
const TOP_GAP = 28; // 탭 위쪽 여백
const NAV_H = 76; // 아래 '이전/닫기/다음' 줄 (여백 포함)
const TONES = ["dark", "lime", "cream"];
const BG = { dark: INK, lime: LIME, cream: CREAM };
const isVideo = (s) => typeof s === "string" && /\.(mp4|webm|mov)$/i.test(s);
const pad = (n) => String(n).padStart(2, "0");
const toneOf = (i) => TONES[i % TONES.length];

const css = `
.ff{position:relative;overflow-x:clip;padding:${TOP_GAP}px clamp(16px,4vw,48px) 0;max-width:1240px;margin:0 auto;box-sizing:border-box;
  scroll-margin-top:${HEADER_H}px;
  /* 열린 파일 높이: 화면 - 고정 헤더 - 탭 위 여백 - 탭 - 아래 버튼 줄 */
  --ff-h:clamp(420px, calc(100vh - ${HEADER_H}px - ${TOP_GAP}px - 52px - ${NAV_H}px), 860px)}
.ff *{box-sizing:border-box}
.ff-folder{position:relative;perspective:1800px;perspective-origin:50% 0%}

/* 큰 파일 윗변: 닫혔을 때는 이름표 하나, 열리면 작품 탭들이 솟아오름 */
.ff-top{position:relative;z-index:1;height:52px;overflow:hidden}
.ff-nametag{position:absolute;left:0;bottom:0;width:min(420px,70%);height:52px;background:${INK};border-radius:14px 14px 0 0;
  padding:10px 20px 0;color:${PAPER};font-size:.68rem;line-height:1.45;display:flex;gap:28px;transition:transform .45s cubic-bezier(.6,0,.3,1) .3s}
.ff-nametag span{opacity:.75}
.ff-nametag b{font-weight:600;margin-left:6px}
.ff.is-open .ff-nametag{transform:translateY(100%)}
.ff-tabs{position:absolute;inset:0;display:flex;align-items:flex-end;gap:3px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none}
.ff-tabs::-webkit-scrollbar{display:none}
.ff-t{flex:1 0 auto;min-width:72px;height:40px;border:0;border-radius:12px 12px 0 0;padding:6px 12px 0;text-align:left;cursor:pointer;
  font:inherit;font-size:.64rem;line-height:1.35;position:relative;filter:brightness(.86);transform:translateY(105%);
  transition:height .3s ease,filter .3s ease,transform .45s cubic-bezier(.2,.8,.2,1)}
.ff.is-open .ff-t{transform:none;transition-delay:0s,0s,calc(.9s + var(--i) * 55ms)}
.ff.is-open.ready .ff-t{transition-delay:0s}
.ff-t b{display:block;font-size:.72rem;font-weight:800;white-space:nowrap}
.ff-t > span{white-space:nowrap}
.ff-t.dark{background:${INK};color:${PAPER}}
.ff-t.lime{background:${LIME};color:${INK}}
.ff-t.cream{background:${CREAM};color:${INK}}
.ff.is-open.ready .ff-t:hover{transform:translateY(-3px);filter:brightness(.95)}
.ff-t.on{height:52px;filter:none}
.ff-t:focus-visible{outline:2px solid ${INK};outline-offset:-2px}

/* 큰 파일 몸통 */
.ff-wrap{position:relative;z-index:2}
.ff-wrap::before,.ff-wrap::after{content:"";position:absolute;border-radius:0 0 20px 20px;pointer-events:none;z-index:-1;transition:opacity .4s ease .8s;opacity:0}
.ff-wrap::before{left:12px;right:12px;bottom:-12px;height:60px;background:rgba(26,26,26,.22)}
.ff-wrap::after{left:26px;right:26px;bottom:-24px;height:60px;background:rgba(26,26,26,.12)}
.ff.is-open .ff-wrap::before,.ff.is-open .ff-wrap::after{opacity:1}
.ff-body{position:relative;overflow:hidden;border-radius:0 20px 20px 20px;transition:height .7s cubic-bezier(.65,0,.35,1) .35s,background-color .45s ease .35s}
.ff-stack{position:relative;transition:opacity .35s ease}
.ff:not(.is-open) .ff-stack{opacity:0;visibility:hidden}
.ff.is-open .ff-stack{transition:opacity .4s ease .7s}

.ff-sheet{position:relative;height:var(--ff-h);display:grid;grid-template-rows:minmax(0,1fr);
  grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:clamp(18px,3vw,40px);padding:clamp(18px,3vw,36px)}
.ff-sheet.dark{background:${INK};color:${PAPER}}
.ff-sheet.lime{background:${LIME};color:${INK}}
.ff-sheet.cream{background:${CREAM};color:${INK}}
.ff-sheet.is-out{position:absolute;inset:0;z-index:0;animation:ff-out ${SWAP_MS}ms cubic-bezier(.5,0,.75,0) forwards}
.ff-sheet.is-out.back{animation-name:ff-out-back}
.ff-sheet.is-in{z-index:1;animation:ff-in ${SWAP_MS}ms cubic-bezier(.2,.8,.2,1) both}
.ff-sheet.is-in.back{animation-name:ff-in-back}
@keyframes ff-out{to{transform:translateY(90px) rotate(-1.4deg) scale(.96);opacity:0}}
@keyframes ff-out-back{to{transform:translateY(90px) rotate(1.4deg) scale(.96);opacity:0}}
@keyframes ff-in{0%{transform:translateY(-60px) translateX(36px) rotate(1deg);opacity:0}35%{opacity:1}100%{transform:none;opacity:1}}
@keyframes ff-in-back{0%{transform:translateY(-60px) translateX(-36px) rotate(-1deg);opacity:0}35%{opacity:1}100%{transform:none;opacity:1}}

/* 표지 덮개 (처음 장면) */
.ff-flap{position:absolute;left:0;right:0;top:0;height:${FLAP_H}px;z-index:5;background-color:${PAPER};
  background-image:linear-gradient(${LINE}55 1px,transparent 1px),linear-gradient(90deg,${LINE}55 1px,transparent 1px);
  background-size:28px 28px;border-radius:0 20px 28px 28px;transform-origin:50% 0%;cursor:pointer;
  transition:transform .8s cubic-bezier(.6,0,.3,1) .35s,opacity .25s ease .9s;box-shadow:0 18px 30px -18px rgba(0,0,0,.45)}
.ff.is-open .ff-flap{transform:rotateX(-104deg);opacity:0;pointer-events:none}
.ff-meta{display:flex;justify-content:space-between;padding:22px 28px 0;font-size:.72rem;color:${INK}}
.ff-title{position:absolute;left:0;right:0;top:47%;transform:translateY(-50%);text-align:center}
.ff-title h2{margin:0;font-size:clamp(2.4rem,7vw,4.6rem);font-weight:800;letter-spacing:-.05em;line-height:1;color:${INK}}
.ff-tapes{display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:18px}
.ff-tape{display:inline-block;padding:4px 14px;font-size:clamp(.78rem,1.6vw,.95rem);font-weight:700}
.ff-tape.l{background:${LIME};color:${INK};transform:rotate(-2.5deg)}
.ff-tape.d{background:${INK};color:${PAPER};transform:rotate(1.5deg)}
.ff-foot{position:absolute;left:0;right:0;top:${CLOSED_H - 96}px;height:96px;display:flex;align-items:center;justify-content:space-between;
  padding:0 28px;color:rgba(255,255,255,.72);font-size:.72rem;transition:opacity .3s ease}
.ff.is-open .ff-foot{opacity:0;pointer-events:none}

/* 끈 단추 */
.ff-tie{position:absolute;left:50%;top:${FLAP_H - 41}px;z-index:8;transform:translateX(-50%);width:80px;height:170px;
  background:none;border:0;padding:0;cursor:pointer;font:inherit}
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

/* 파일 안쪽 */
.ff-view{position:relative;border-radius:10px;overflow:hidden;background:rgba(127,127,127,.2);height:100%;min-height:0;touch-action:pan-y;user-select:none}
.ff-view img,.ff-view video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block}
.ff-arrow{position:absolute;top:50%;width:40px;height:40px;margin-top:-20px;border-radius:50%;border:0;cursor:pointer;z-index:2;
  background:rgba(28,28,28,.5);color:${PAPER};font-size:1.2rem;line-height:1;display:flex;align-items:center;justify-content:center}
.ff-arrow:hover{background:${LIME};color:${INK}}
.ff-arrow.l{left:10px}.ff-arrow.r{right:10px}
.ff-cap{position:absolute;left:10px;bottom:10px;right:76px;z-index:2;color:${PAPER};font-size:.72rem;font-weight:700}
.ff-cap span{background:rgba(28,28,28,.6);padding:3px 8px;border-radius:3px;display:inline-block;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom}
.ff-count{position:absolute;right:10px;bottom:10px;z-index:2;background:rgba(28,28,28,.6);color:${PAPER};font-size:.68rem;font-weight:700;padding:3px 8px;border-radius:3px;font-variant-numeric:tabular-nums}
.ff-text{display:flex;flex-direction:column;gap:14px;min-width:0;min-height:0;padding-top:4px;padding-right:6px;
  overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
.ff-text > *{flex-shrink:0}
.ff-no{font-size:.72rem;opacity:.65;font-variant-numeric:tabular-nums}
.ff-badges{display:flex;flex-wrap:wrap;gap:6px}
.ff-badge{font-size:.66rem;font-weight:800;padding:3px 9px;border-radius:3px;background:${LIME};color:${INK}}
.ff-sheet.lime .ff-badge{background:${INK};color:${LIME}}
.ff-badge.o,.ff-sheet.lime .ff-badge.o{background:transparent;border:1px solid currentColor;color:inherit;font-weight:600}
.ff-text h4{margin:0;font-size:clamp(1.3rem,1rem + 1.2vw,2rem);font-weight:800;letter-spacing:-.04em;line-height:1.2}
.ff-desc{margin:0;font-size:.9rem;line-height:1.85;max-width:36em}
.ff-dl{display:grid;grid-template-columns:4.5em 1fr;gap:8px 12px;margin:0;font-size:.82rem;border-top:1px solid currentColor;padding-top:14px}
.ff-dl dt{opacity:.6}
.ff-dl dd{margin:0}
.ff-link{align-self:flex-start;display:inline-block;border:1px solid currentColor;border-radius:4px;padding:8px 16px;font-size:.85rem;font-weight:700;color:inherit;text-decoration:none;transition:background-color .15s ease,color .15s ease,border-color .15s ease}
.ff-link:hover{background:${LIME};border-color:${LIME};color:${INK}}
.ff-sheet.lime .ff-link:hover{background:${INK};border-color:${INK};color:${LIME}}

.ff-nav{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:30px;color:${INK};font-size:.8rem;font-weight:700;transition:opacity .3s ease .6s}
.ff:not(.is-open) .ff-nav{opacity:0;pointer-events:none;transition:none}
.ff-pill{background:none;border:1px solid ${INK};border-radius:999px;padding:7px 15px;font:inherit;font-size:.78rem;font-weight:600;color:${INK};cursor:pointer}
.ff-pill:hover{background:${INK};color:${LIME}}
.ff-pill:disabled{opacity:.35;cursor:default;background:none;color:${INK}}

@media (max-width:760px){
  .ff-t{min-width:64px;padding:6px 10px 0}
  .ff-nametag{gap:14px;width:86%}
  .ff-foot{padding:0 18px;font-size:.62rem}
  .ff-meta{padding:18px 18px 0;font-size:.62rem}
  /* 모바일: 세로로 쌓기 (높이 제한·내부 스크롤 없음) */
  .ff-sheet{grid-template-columns:1fr;grid-template-rows:auto;height:auto}
  .ff-view{height:auto;aspect-ratio:4/5}
  .ff-text{overflow:visible;padding-right:0}
  .ff-t-pre{display:none}
}
@media (prefers-reduced-motion:reduce){
  .ff,.ff *{transition:none !important;animation:none !important}
  .ff-sheet.is-out{display:none}
  .ff.is-open .ff-t{transform:none}
}
`;

function Viewer({ project }) {
  const images = project.images || [];
  const [idx, setIdx] = useState(0);
  const start = useRef(null);
  useEffect(() => { setIdx(0); }, [project.id]);
  const go = (d) => setIdx((i) => Math.min(images.length - 1, Math.max(0, i + d)));
  const src = images[idx];
  const caption = project.imageTitles?.[idx];
  return (
    <div
      className="ff-view"
      onPointerDown={(e) => { start.current = e.clientX; }}
      onPointerUp={(e) => {
        if (start.current == null) return;
        const dx = e.clientX - start.current; start.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      {src && (isVideo(src)
        ? <video key={src} src={src} autoPlay loop muted playsInline />
        : <img key={src} src={src} alt={caption || project.title} draggable="false" />)}
      {idx > 0 && <button className="ff-arrow l" onClick={() => go(-1)} aria-label="이전 이미지">‹</button>}
      {idx < images.length - 1 && <button className="ff-arrow r" onClick={() => go(1)} aria-label="다음 이미지">›</button>}
      {caption && <div className="ff-cap"><span>{caption}</span></div>}
      {images.length > 1 && <div className="ff-count">{pad(idx + 1)} / {pad(images.length)}</div>}
    </div>
  );
}

function Sheet({ project, index, total, className = "" }) {
  const tools = project.tools || [];
  return (
    <article className={`ff-sheet ${toneOf(index)}${index === 0 ? " first" : ""} ${className}`} aria-label={project.title}>
      <Viewer project={project} />
      <div className="ff-text">
        <span className="ff-no">파일 {pad(index + 1)} / {pad(total)}</span>
        <div className="ff-badges">
          {project.category && <span className="ff-badge o">{project.category}</span>}
          {project.award && <span className="ff-badge">{project.award.replace(/^✦\s*/, "")}</span>}
        </div>
        <h4>{project.title}</h4>
        {project.description && <p className="ff-desc">{project.description}</p>}
        <dl className="ff-dl">
          {project.year && (<><dt>연도</dt><dd>{project.year}</dd></>)}
          {project.role && (<><dt>역할</dt><dd>{project.role}</dd></>)}
          {project.series && (<><dt>소속</dt><dd>{project.series}</dd></>)}
          {tools.length > 0 && (<><dt>도구</dt><dd>{tools.join(", ")}</dd></>)}
        </dl>
        {project.process && <p className="ff-desc" style={{ opacity: 0.8 }}>{project.process}</p>}
        {project.link && (
          <a className="ff-link" href={project.link} target="_blank" rel="noopener noreferrer">{project.linkLabel || "웹사이트"} ↗</a>
        )}
      </div>
    </article>
  );
}

export default function FolderFiles({ projects = [], id = "files", ownerName = "박채빈", email = "" }) {
  const total = projects.length;
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState("next");
  const [height, setHeight] = useState(MIN_H);
  const curRef = useRef(0);
  const stackRef = useRef(null);
  const sectionRef = useRef(null);
  const timer = useRef(null);

  const measure = useCallback(() => {
    const el = stackRef.current?.querySelector(".ff-sheet:not(.is-out)");
    setHeight(el ? el.offsetHeight : MIN_H);
  }, [open]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (stackRef.current) ro.observe(stackRef.current);
    return () => ro.disconnect();
  }, [measure, cur]);

  const select = useCallback((j) => {
    const i = curRef.current;
    if (j < 0 || j >= total) return;
    setOpen(true);
    if (j === i) return;
    setDir(j > i ? "next" : "back");
    setPrev(i);
    curRef.current = j;
    setCur(j);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPrev(null), SWAP_MS);
    if (projects[j]) history.replaceState(null, "", `#file/${projects[j].id}`);
  }, [total, projects]);

  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#file\/(.+)$/);
      if (!m) return;
      const j = projects.findIndex((p) => String(p.id) === decodeURIComponent(m[1]));
      if (j < 0) return;
      curRef.current = j; setCur(j); setOpen(true);
      setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [projects]);

  useEffect(() => () => clearTimeout(timer.current), []);
  const p = projects[cur];

  // 탭 줄이 넘쳐 가로 스크롤될 때, 선택된 탭이 탭 줄 가운데에 보이도록
  const tabsRef = useRef(null);
  useEffect(() => {
    const box = tabsRef.current;
    const on = box?.querySelector(".ff-t.on");
    if (!box || !on || box.scrollWidth <= box.clientWidth) return;
    const left = on.offsetLeft - (box.clientWidth - on.offsetWidth) / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ left: Math.max(0, left), behavior: reduce ? "auto" : "smooth" });
  }, [cur, open]);

  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!open) { setReady(false); return; }
    const t = setTimeout(() => setReady(true), 1700);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <section id={id} ref={sectionRef} className={`ff${open ? " is-open" : ""}${ready ? " ready" : ""}`} aria-label="작업 파일">
      <style>{css}</style>
      <div className="ff-folder">
        {/* 큰 파일 윗변 */}
        <div className="ff-top">
          <div className="ff-nametag" aria-hidden="true">
            <div><span>NAME</span><b>{ownerName}</b><br /><span>FILE</span><b>{pad(total)}건</b></div>
            <div><span>DATE</span><b>2026</b></div>
          </div>
          <div className="ff-tabs" ref={tabsRef} role="tablist" aria-label="작업 목록" aria-hidden={!open}>
            {projects.map((pr, i) => (
              <button
                key={pr.id}
                role="tab"
                aria-selected={open && i === cur}
                className={`ff-t ${toneOf(i)}${i === cur ? " on" : ""}`}
                style={{ "--i": i }}
                onClick={() => select(i)}
                tabIndex={open ? 0 : -1}
                title={pr.shortTitle || pr.title}
              >
                {(() => {
                  // 탭 이름: shortTitle. 모바일용 mobileShortTitle이 있으면 앞부분(예: "하얀도화지")은
                  // 데스크톱에서만 윗줄에 보이고 모바일에서는 숨김.
                  const full = pr.shortTitle || pr.title;
                  const main = pr.mobileShortTitle || full;
                  const pre = full.endsWith(main) ? full.slice(0, full.length - main.length).trim() : "";
                  return (
                    <>
                      <span>{pad(i + 1)}{pre && <span className="ff-t-pre"> {pre}</span>}</span>
                      <b>{main}</b>
                    </>
                  );
                })()}
              </button>
            ))}
          </div>
        </div>

        {/* 큰 파일 몸통 */}
        <div className="ff-wrap">
          <div className="ff-body" style={{ height: open ? height : CLOSED_H, background: open ? BG[toneOf(cur)] : INK }}>
            <div className="ff-stack" ref={stackRef}>
              {prev != null && projects[prev] && (
                <Sheet key={`out-${prev}`} project={projects[prev]} index={prev} total={total} className={`is-out${dir === "back" ? " back" : ""}`} />
              )}
              {p && (
                <Sheet key={`in-${cur}`} project={p} index={cur} total={total} className={prev != null ? `is-in${dir === "back" ? " back" : ""}` : ""} />
              )}
            </div>

            <div className="ff-flap" onClick={() => setOpen(true)} aria-hidden={open}>
              <div className="ff-meta"><span>(작업 파일)</span><span>(2026)</span><span>(홍보·아카이빙 · 디자인)</span></div>
              <div className="ff-title">
                <h2>{ownerName}의 작업 파일</h2>
                <div className="ff-tapes">
                  <span className="ff-tape l">알리고 기록한 것들을 모았어요</span>
                  <span className="ff-tape d">작업 {total}건이 들어 있어요</span>
                </div>
              </div>
            </div>

            <button className="ff-tie" onClick={() => setOpen(true)} aria-expanded={open} aria-label="파일 열기">
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
          </div>
        </div>

        <div className="ff-nav">
          <button className="ff-pill" onClick={() => select(curRef.current - 1)} disabled={cur === 0}>이전 파일</button>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{pad(cur + 1)} / {pad(total)}</span>
          <span style={{ display: "flex", gap: 8 }}>
            <button className="ff-pill" onClick={() => setOpen(false)}>파일 닫기</button>
            <button className="ff-pill" onClick={() => select(curRef.current + 1)} disabled={cur === total - 1}>다음 파일</button>
          </span>
        </div>
      </div>
    </section>
  );
}
