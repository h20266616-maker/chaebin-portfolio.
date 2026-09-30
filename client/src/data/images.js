// 이미지 원본 크기 (width/height 속성용 — 레이아웃 흔들림 방지)
const sizes = {
  '/images/profile.webp': [900, 1260],
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

// 등록되지 않은 이미지는 4:5 비율로 가정
export function imageSize(src) {
  const [width, height] = sizes[src] ?? [800, 1000]
  return { width, height }
}
