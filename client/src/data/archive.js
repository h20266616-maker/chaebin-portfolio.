import { awards } from './experience'

export const ARCHIVE_TYPES = ['제작 기록', '활동', '전시·수상']

const entries = [
  {
    id: 'first-deploy',
    date: '2026', // TODO: 정확한 날짜
    type: '제작 기록',
    title: '포트폴리오 사이트 첫 배포',
    body: '이 포트폴리오 웹사이트는 Claude Code와 Antigravity IDE로 직접 코드를 작성하고 수정하며 만들었습니다. React, Vite, Tailwind CSS로 구축한 뒤 GitHub에 커밋·푸시하고, Vercel로 배포까지 마쳤습니다. 빌드 오류, 파일 용량 문제 같은 시행착오를 거치며 완성한 결과물입니다.',
    images: [],
  },
  {
    id: 'gif-size',
    date: '2026', // TODO: 정확한 날짜
    type: '제작 기록',
    title: '351MB GIF 용량 문제 해결',
    body: '', // TODO: 해결 방법 한두 문장
    images: [],
  },
  {
    id: 'vercel-build',
    date: '2026', // TODO: 정확한 날짜
    type: '제작 기록',
    title: 'Vercel 빌드 오류와 Git 용량 제한',
    body: '', // TODO: 내용
    images: [],
  },
  {
    id: 'rebuild-simple',
    date: '2026.09',
    type: '제작 기록',
    title: '심플 버전으로 다시 만들기',
    body: '애니메이션 위주였던 첫 버전을 정리하고, 기획·홍보 작업이 잘 보이도록 구조를 새로 짰습니다.',
    images: [],
  },
]

// 전시·수상은 활동(Experience)의 수상 데이터를 그대로 가져옵니다.
const awardEntries = awards.map((a, i) => ({
  id: `award-${i}`,
  date: a.year,
  type: '전시·수상',
  title: a.title,
  body: a.description,
  images: [],
}))

// 날짜순(오래된 것부터). "2026.09" → 202609, "2026" / "2026-1학기" → 202600
function sortKey(date) {
  const m = String(date).match(/(\d{4})(?:\.(\d{1,2}))?/)
  if (!m) return 0
  return Number(m[1]) * 100 + Number(m[2] ?? 0)
}

export const archive = [...entries, ...awardEntries]
  .map((e, i) => ({ ...e, _i: i }))
  .sort((a, b) => sortKey(a.date) - sortKey(b.date) || a._i - b._i)
