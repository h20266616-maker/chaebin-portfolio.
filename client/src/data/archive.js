import { awards } from './experience'

export const ARCHIVE_TYPES = ['활동', '전시·수상']

const entries = []

// 전시·수상은 활동(Experience)의 수상 데이터를 그대로 가져옵니다.
const awardEntries = awards.map((a, i) => ({
  id: `award-${i}`,
  date: a.year,
  type: '전시·수상',
  title: a.title,
  body: a.description,
  images: [],
}))

// 날짜 역순(최신 먼저). "2026.09" → 202609, "2026" / "2026-1학기" → 202600
function sortKey(date) {
  const m = String(date).match(/(\d{4})(?:\.(\d{1,2}))?/)
  if (!m) return 0
  return Number(m[1]) * 100 + Number(m[2] ?? 0)
}

export const archive = [...entries, ...awardEntries]
  .map((e, i) => ({ ...e, _i: i }))
  .sort((a, b) => sortKey(b.date) - sortKey(a.date) || a._i - b._i)
