// 소개 + 활동을 "이력서 한 장"으로 보여주는 섹션
// 사용법: <ResumeSheet />  (기본값: 기울기 + 형광펜)  (내용은 아래 DATA만 고치면 됩니다)
// motion.tilt  : 마우스를 따라 종이가 기울고, 사진·클립·테이프·도장이 서로 다른 깊이로 떠 보임 (데스크톱만)
// motion.scan  : 이력서가 처음 보일 때 스캔 선이 위에서 아래로 훑으며 내용이 드러남 (한 번만)
// motion.mark  : 활동·수상이 처음 보일 때 진행 중 활동과 수상 이름에 형광펜이 칠해짐 (한 번만)
// motion.flip  : 증명사진에 마우스를 올리거나 누르면 뒤집혀 뒷면 명함이 보임
import { useEffect, useRef, useState } from "react";
const INK = "#1A1A1A";
const LIME = "#AAFF00";
const PAPER = "#FFFFFF";
const CREAM = "#EFECE4";
const LINE = "#D4D4D4";
const MUTED = "#8C8C8C";

const DATA = {
  name: "박채빈",
  photo: "/images/profile.webp",
  info: [
    ["소속", "한림대학교 미래융합스쿨 1학년"],
    ["학번", "20266616"],
    ["이메일", "a01022966356@gmail.com", "mailto:a01022966356@gmail.com"],
  ],
  skills: ["미리캔버스", "Figma", "Illustrator", "Blender", "Claude", "Claude Code", "Antigravity IDE", "GitHub", "Vercel", "Google Gemini", "ChatGPT", "Flow"],
  career: [
    { when: "2026-1학기", what: "한림대학교 입학" },
    { when: "2026-1학기~", what: "I-SO 동아리 활동", now: true },
    { when: "2026-1학기", what: "중앙동아리 하얀도화지 홍보부 운영진", note: "동아리 인스타그램 운영" },
    { when: "2026-2학기~", what: "중앙동아리 하얀도화지 부회장", note: "동아리 활동 아카이빙 담당", now: true },
    { when: "2026-2학기~", what: "과동아리 커넥트 CON:NECT 활동", now: true },
  ],
  awards: [
    { when: "2026", what: "영수증 플랫폼 기반 Town MICE 아이디어톤", stamp: "대상", note: "한림대학교 Town MICE 연구소 주최" },
    { when: "2026", what: "강원과 함께 하는 도서관 장서표 디자인 공모전", stamp: "최우수상" },
    { when: "2026", what: "디지털인문예술전공 전시회", stamp: "우수상" },
    { when: "2026", what: "디지털인문예술전공 기말프로젝트 전시회 홍보 포스터 공모전", stamp: "장려상" },
  ],
};

const css = `
.rs{max-width:1240px;margin:0 auto;padding:clamp(56px,8vw,96px) clamp(16px,4vw,48px);box-sizing:border-box;scroll-margin-top:72px}
.rs *{box-sizing:border-box}
.rs-label{position:relative;display:flex;align-items:flex-end;gap:12px;height:44px}
.rs-label-tab{height:44px;padding:8px 18px 0;background:${CREAM};border-radius:12px 12px 0 0;font-size:.66rem;line-height:1.5;color:${INK};display:flex;gap:22px}
.rs-label-tab i{font-style:normal;opacity:.6;margin-right:6px}
.rs-label-tab span{display:inline-block;min-width:74px;border-bottom:1px solid ${INK}}
.rs-paper{position:relative;background-color:${PAPER};border:1px solid ${LINE};border-radius:0 18px 18px 18px;
  background-image:linear-gradient(${LINE}50 1px,transparent 1px),linear-gradient(90deg,${LINE}50 1px,transparent 1px);background-size:28px 28px;
  padding:clamp(22px,4vw,48px);display:grid;grid-template-columns:minmax(200px,280px) 1fr;gap:clamp(28px,5vw,64px)}
.rs-tools{margin-top:24px;width:100%}
.rs-tools h3{margin:0 0 10px;font-size:.82rem;font-weight:800;color:${INK}}
.rs-skills{display:flex;flex-wrap:wrap;gap:6px}
.rs-skills span{background:${PAPER};border:1.5px solid ${INK};border-radius:4px;padding:4px 10px;font-size:.74rem;font-weight:700;color:${INK};white-space:nowrap}

.rs-left{display:flex;flex-direction:column;align-items:flex-start;padding-top:clamp(40px,6vw,64px)}
.rs-photo{position:relative;width:min(100%,160px);background:${INK};padding:10px 10px 30px;transform:rotate(-2deg);box-shadow:0 14px 24px -16px rgba(0,0,0,.55)}
.rs-photo img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;object-position:top}
.rs-photo figcaption{position:absolute;left:10px;right:10px;bottom:8px;color:${PAPER};font-size:.66rem;text-align:center}
.rs-clip{position:absolute;top:-16px;left:28px;width:16px;height:52px;border:3px solid #9A9A9A;border-radius:8px;z-index:2}
.rs-clip::after{content:"";position:absolute;left:2px;right:2px;top:8px;bottom:8px;border:2px solid #9A9A9A;border-radius:5px}
.rs-tab-tape{position:absolute;top:22px;right:-30px;background:${LIME};color:${INK};font-size:.72rem;font-weight:800;padding:4px 12px;transform:rotate(18deg);z-index:2}
.rs-name{margin:34px 0 0;font-size:clamp(3rem,7vw,4.6rem);font-weight:800;letter-spacing:-.06em;line-height:1;color:${INK}}
.rs-tape{display:inline-block;margin-top:14px;background:${INK};color:${PAPER};font-size:.95rem;font-weight:700;padding:5px 14px;transform:rotate(-1.5deg)}

.rs-right{display:flex;flex-direction:column;padding-top:clamp(40px,6vw,64px)}
.rs-block{display:grid;grid-template-columns:5.5em 1fr;gap:0 22px;padding:20px 0;border-top:1px solid ${INK}}
.rs-block:first-child{border-top:0;padding-top:0}
.rs-block h3{margin:0;font-size:.82rem;font-weight:800;color:${INK};padding-top:2px}
.rs-rows{border-left:1px solid ${LINE};padding-left:22px;display:flex;flex-direction:column;gap:12px}
.rs-row{display:grid;grid-template-columns:7.2em 1fr auto;gap:12px;align-items:start;font-size:.88rem;color:${INK}}
.rs-row.info{grid-template-columns:4em 1fr}
.rs-when{color:${MUTED};font-size:.8rem;font-variant-numeric:tabular-nums;padding-top:1px}
.rs-what{font-weight:700;line-height:1.5}
.rs-what small{display:block;font-weight:400;font-size:.78rem;color:${MUTED};margin-top:2px}
.rs-what a{color:inherit;text-decoration:underline;text-decoration-color:${LIME};text-decoration-thickness:2px;text-underline-offset:4px}
.rs-now{align-self:center;display:inline-flex;align-items:center;gap:5px;background:${LIME};color:${INK};font-size:.66rem;font-weight:800;padding:3px 9px;border-radius:999px;white-space:nowrap}
.rs-now::before{content:"";width:6px;height:6px;border-radius:50%;background:${INK}}
.rs-stamp{align-self:center;display:inline-block;border:2px solid ${INK};border-radius:6px;padding:3px 10px;font-size:.8rem;font-weight:800;color:${INK};
  white-space:nowrap;transform:rotate(-7deg);opacity:.9;background:${PAPER}}
.rs-stamp.top{background:${LIME};border-color:${INK}}

/* 1. 기울기 + 깊이 */
.rs.m-tilt .rs-stage{perspective:1400px}
.rs.m-tilt .rs-doc,.rs.m-tilt .rs-paper,.rs.m-tilt .rs-left,.rs.m-tilt .rs-tools,.rs.m-tilt .rs-skills{transform-style:preserve-3d}
.rs.m-tilt .rs-right{transform:translateZ(8px)}
.rs.m-tilt .rs-doc{transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transform-origin:50% 55%;will-change:transform}
.rs.m-tilt .rs-photo{transform:translateZ(46px) rotate(-2deg);box-shadow:calc(var(--sx,0) * 1px) calc(18px + var(--sy,0) * 1px) 28px -14px rgba(0,0,0,.55)}
.rs.m-tilt .rs-clip{transform:translateZ(18px)}
.rs.m-tilt .rs-tab-tape{transform:translateZ(30px) rotate(18deg)}
.rs.m-tilt .rs-name{transform:translateZ(22px)}
.rs.m-tilt .rs-tape{transform:translateZ(34px) rotate(-1.5deg)}
.rs.m-tilt .rs-skills span{transform:translateZ(16px)}

/* 스캔 */
.rs-scan{display:none}
.rs.m-scan .rs-scan{display:block;position:absolute;inset:0;z-index:20;pointer-events:none;border-radius:inherit;overflow:hidden}
.rs-scan-cover{position:absolute;inset:0;background-color:${PAPER};
  background-image:linear-gradient(${LINE}50 1px,transparent 1px),linear-gradient(90deg,${LINE}50 1px,transparent 1px);background-size:28px 28px}
.rs-scan-line{position:absolute;left:0;right:0;top:0;height:3px;background:${LIME};box-shadow:0 0 0 1px ${LIME},0 0 22px 6px rgba(170,255,0,.55);opacity:0}
.rs.m-scan.scanned .rs-scan-cover{animation:rs-scan-cover 1.5s cubic-bezier(.45,0,.25,1) .15s forwards}
.rs.m-scan.scanned .rs-scan-line{animation:rs-scan-line 1.5s cubic-bezier(.45,0,.25,1) .15s forwards}
@keyframes rs-scan-cover{from{clip-path:inset(0 0 0 0)}to{clip-path:inset(100% 0 0 0)}}
@keyframes rs-scan-line{0%{top:0;opacity:1}92%{opacity:1}100%{top:100%;opacity:0}}

/* 형광펜 */
.rs-mk{background-image:linear-gradient(transparent 55%,${LIME} 55%,${LIME} 92%,transparent 92%);background-repeat:no-repeat;background-size:100% 100%;
  -webkit-box-decoration-break:clone;box-decoration-break:clone}
.rs.m-mark .rs-mk{background-size:0% 100%;transition:background-size .7s cubic-bezier(.6,0,.3,1);transition-delay:calc(.1s + var(--k,0) * 160ms)}
.rs.m-mark .rs-block.marked .rs-mk{background-size:100% 100%}

/* 사진 뒤집기 */
.rs-flip{position:relative;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.3,.7,.2,1)}
.rs.m-flip .rs-photo{cursor:pointer;perspective:900px}
.rs.m-flip .rs-photo.flipped .rs-flip{transform:rotateY(180deg)}
.rs-face{backface-visibility:hidden;-webkit-backface-visibility:hidden}
.rs-back{position:absolute;inset:0;transform:rotateY(180deg);background:${CREAM};color:${INK};padding:16px 14px;display:flex;flex-direction:column;justify-content:space-between;
  background-image:linear-gradient(${LINE}60 1px,transparent 1px),linear-gradient(90deg,${LINE}60 1px,transparent 1px);background-size:18px 18px}
.rs-back b{font-size:1.3rem;font-weight:800;letter-spacing:-.04em;display:block}
.rs-back small{display:block;font-size:.62rem;line-height:1.6;margin-top:6px}
.rs-back em{font-style:normal;align-self:flex-start;background:${LIME};font-size:.62rem;font-weight:800;padding:2px 7px}
.rs:not(.m-flip) .rs-back{display:none}

@media (prefers-reduced-motion:reduce){
  .rs.m-tilt .rs-doc{transform:none !important}
  .rs.m-scan .rs-scan{display:none}
  .rs.m-mark .rs-mk{transition:none;background-size:100% 100%}
  .rs-flip{transition:none}
}

@media (max-width:820px){
  .rs-paper{grid-template-columns:1fr}
  .rs-left{padding-top:12px}
  .rs-right{padding-top:0}
  .rs-block{grid-template-columns:1fr;gap:12px}
  .rs-rows{border-left:0;padding-left:0}
  .rs-row{grid-template-columns:1fr auto}
  .rs-row .rs-when{grid-column:1 / -1}
  .rs-row.info{grid-template-columns:4em 1fr}
  .rs-row.info .rs-when{grid-column:auto}
  .rs-label-tab{gap:12px}
}
`;

export default function ResumeSheet({ id = "about", data = DATA, motion = { tilt: true, scan: false, mark: true, flip: false } }) {
  const secRef = useRef(null);
  const paperRef = useRef(null);
  const docRef = useRef(null);
  const awardsRef = useRef(null);
  const careerRef = useRef(null);
  const [scanned, setScanned] = useState(false);
  const [marked, setMarked] = useState({ career: false, awards: false });
  const [flipped, setFlipped] = useState(false);
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const fine = typeof window !== "undefined" && window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
  const tiltOn = motion.tilt && fine && !reduce;

  // 2·3. 화면에 처음 들어올 때 한 번
  useEffect(() => {
    const obs = [];
    const once = (el, ratio, fn) => {
      if (!el) return;
      const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { fn(); io.disconnect(); } }, { threshold: ratio });
      io.observe(el); obs.push(io);
    };
    if (motion.scan && !reduce) once(paperRef.current, 0.3, () => setScanned(true));
    if (motion.mark) {
      once(careerRef.current, 0.6, () => setMarked((m) => ({ ...m, career: true })));
      once(awardsRef.current, 0.6, () => setMarked((m) => ({ ...m, awards: true })));
    }
    return () => obs.forEach((o) => o.disconnect());
  }, [motion.scan, motion.mark]);

  // 1. 마우스를 따라 기울기
  useEffect(() => {
    if (!tiltOn) return;
    const el = docRef.current; if (!el) return;
    let raf = 0, tx = 0, ty = 0, x = 0, y = 0, running = false;
    const step = () => {
      x += (tx - x) * 0.09; y += (ty - y) * 0.09;
      el.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
      el.style.setProperty("--sx", (-x * 14).toFixed(1));
      el.style.setProperty("--sy", (-y * 10).toFixed(1));
      if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) raf = requestAnimationFrame(step); else running = false;
    };
    const kick = () => { if (!running) { running = true; raf = requestAnimationFrame(step); } };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      kick();
    };
    const leave = () => { tx = 0; ty = 0; kick(); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [tiltOn]);

  const cls = ["rs", tiltOn && "m-tilt", motion.scan && !reduce && "m-scan", scanned && "scanned", motion.mark && "m-mark", motion.flip && "m-flip"].filter(Boolean).join(" ");
  const mk = (text, on, k) => (on ? <span className="rs-mk" style={{ "--k": k }}>{text}</span> : text);

  return (
    <section id={id} ref={secRef} className={cls} aria-label="이력서">
      <style>{css}</style>
      <div className="rs-stage">
      <div className="rs-doc" ref={docRef}>
      <div className="rs-label" aria-hidden="true">
        <div className="rs-label-tab">
          <div><i>NAME</i><span>{data.name}</span></div>
          <div><i>FILE</i><span>이력서</span></div>
          <div><i>DATE</i><span>2026</span></div>
        </div>
      </div>
      <div className="rs-paper" ref={paperRef}>
        <div className="rs-scan" aria-hidden="true"><div className="rs-scan-cover" /><div className="rs-scan-line" /></div>
        <div className="rs-left">
          <figure
            className={`rs-photo${flipped ? " flipped" : ""}`}
            style={{ margin: 0 }}
            onMouseEnter={motion.flip ? () => setFlipped(true) : undefined}
            onMouseLeave={motion.flip ? () => setFlipped(false) : undefined}
            onClick={motion.flip ? () => setFlipped((f) => !f) : undefined}
          >
            <span className="rs-clip" aria-hidden="true" />
            <span className="rs-tab-tape" aria-hidden="true">(이력서)</span>
            <div className="rs-flip">
              <div className="rs-face">
                <img src={data.photo} alt={`${data.name} 프로필 사진`} />
              </div>
              <div className="rs-back rs-face" aria-hidden={!flipped}>
                <div>
                  <b>{data.name}</b>
                  {data.info.map(([k, v]) => <small key={k}>{v}</small>)}
                </div>
                {data.tape && <em>{data.tape}</em>}
              </div>
            </div>
            <figcaption>{data.name} · 2026</figcaption>
          </figure>
          <h2 className="rs-name">{data.name}</h2>
          <div className="rs-tools">
            <h3>사용 도구</h3>
            <div className="rs-skills" aria-label="사용 도구">
              {data.skills.map((s) => <span key={s}>{s}</span>)}
            </div>
          </div>
        </div>

        <div className="rs-right">
          <div className="rs-block">
            <h3>기본 정보</h3>
            <div className="rs-rows">
              {data.info.map(([k, v, href]) => (
                <div className="rs-row info" key={k}>
                  <span className="rs-when">{k}</span>
                  <span className="rs-what">{href ? <a href={href}>{v}</a> : v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`rs-block${marked.career ? " marked" : ""}`} ref={careerRef}>
            <h3>활동</h3>
            <div className="rs-rows">
              {data.career.map((c, i) => (
                <div className="rs-row" key={c.what}>
                  <span className="rs-when">{c.when}</span>
                  <span className="rs-what">{mk(c.what, motion.mark && c.now, i)}{c.note && <small>{c.note}</small>}</span>
                  {c.now ? <span className="rs-now">진행 중</span> : <span />}
                </div>
              ))}
            </div>
          </div>

          <div className={`rs-block${marked.awards ? " marked" : ""}`} ref={awardsRef}>
            <h3>수상</h3>
            <div className="rs-rows">
              {data.awards.map((a, i) => (
                <div className="rs-row" key={a.what}>
                  <span className="rs-when">{a.when}</span>
                  <span className="rs-what">{mk(a.what, motion.mark && i < 2, i)}{a.note && <small>{a.note}</small>}</span>
                  <span className={`rs-stamp${i < 2 ? " top" : ""}`}>{a.stamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </section>
  );
}
