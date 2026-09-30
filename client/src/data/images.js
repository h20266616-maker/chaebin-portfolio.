// 이미지 원본 크기 (width/height 속성용 — 레이아웃 흔들림 방지)
const sizes = {
  '/images/profile.webp': [900, 1260],
  '/images/planning/town-mice/01-screens.webp': [1200, 2217],
  '/images/planning/town-mice/02-start.webp': [1600, 900],
  '/images/planning/town-mice/03-receipt.webp': [1600, 900],
  '/images/planning/town-mice/04-cashback.webp': [1600, 900],
  '/images/planning/town-mice/05-store.webp': [1600, 900],
  '/images/planning/town-mice/06-map.webp': [1600, 900],
  '/images/work/project-01-1.jpg': [1680, 2376],
  '/images/work/project-02-1.jpg': [1084, 1451],
  '/images/work/project-02-2.jpg': [1084, 1451],
  '/images/work/project-03-1.jpg': [1131, 1391],
  '/images/work/project-04-1.jpg': [1085, 1450],
  '/images/work/project-05-1.jpg': [1054, 1492],
  '/images/work/project-06-1.jpg': [1054, 1492],
  '/images/work/project-07-1.jpg': [1054, 1492],
  '/images/work/project-08-1.jpg': [1054, 1492],
  '/images/work/project-09-1.jpg': [1191, 1684],
  '/images/work/project-10-1.jpg': [1414, 2000],
}

// 등록되지 않은 이미지(기획 커버 등)는 4:5 비율로 가정
export function imageSize(src) {
  const [width, height] = sizes[src] ?? [800, 1000]
  return { width, height }
}

export const isVideo = (src) => /\.(mp4|webm)$/i.test(src)
