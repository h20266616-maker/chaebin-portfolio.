// 디자인 작업(링 갤러리) 데이터.
// 원본 작품 데이터는 ./projects.js 그대로 두고, 여기서 카드 단위로 묶기만 합니다(삭제 없음).
// 값이 빈 문자열("")이거나 빈 배열인 필드는 화면에 표시되지 않습니다.
import { projects } from './projects'

const byId = (id) => projects.find((p) => p.id === id)
const clean = (award = '') => award.replace(/^✦\s*/, '')

// 원본 작품 → 공통 상세 화면 스키마
function single(id, slug, extra = {}) {
  const p = byId(id)
  return {
    id: slug,
    title: p.title,
    group: 'design',
    category: p.category,
    year: p.year,
    period: '', // TODO: 기간
    team: '', // TODO: 개인 / 팀 (n명)
    role: '', // TODO: 내 역할
    tools: p.tools ?? [],
    award: clean(p.award),
    series: p.series ?? '',
    seriesDescription: p.seriesDescription ?? '',
    summary: '',
    description: p.description ?? '',
    process: p.process ?? '',
    images: p.images ?? [],
    items: [],
    link: p.link ?? '',
    linkLabel: p.linkLabel ?? '',
    featured: false,
    ...extra,
  }
}

// 여러 작품 → 묶음 카드 1개
function bundle(ids, slug, extra) {
  const items = ids.map(byId)
  return {
    id: slug,
    group: 'design',
    category: items[0].category,
    year: items[0].year,
    period: '', // TODO: 기간
    team: '', // TODO: 개인 / 팀 (n명)
    role: '', // TODO: 내 역할
    tools: [...new Set(items.flatMap((p) => p.tools ?? []))],
    award: '',
    series: '',
    seriesDescription: '',
    summary: '',
    description: '',
    process: '',
    images: items.map((p) => p.images[0]),
    items: items.map((p) => ({
      title: p.title,
      description: p.description,
      process: p.process ?? '',
      images: p.images,
    })),
    link: '',
    linkLabel: '',
    featured: false,
    ...extra,
  }
}

const inje = byId(7)

export const designWorks = [
  single(4, 'quiet-miracle', { featured: true }), // 고요한 기적 (최우수상)
  bundle([7, 8], 'inje-series', {
    title: '인제의 것들',
    award: clean(inje.award),
    series: inje.series,
    seriesDescription: inje.seriesDescription,
  }),
  bundle([2, 3, 5, 6], 'ex-libris-entries', {
    title: '장서표 공모전 출품작',
    award: clean(byId(2).award),
  }),
  single(1, 'heunyeol'), // 흔열
  single(9, 'hadong-chuncheon-summer', {
    team: '', // TODO: I-SO 동아리 활동 — 팀 인원 확인 후 "팀 (n명)"
  }),
  single(10, 'synk', {
    team: '팀', // TODO: 인원 확인 후 "팀 (n명)"
  }),
]
