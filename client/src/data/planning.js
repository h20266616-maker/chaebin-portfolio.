// 홍보·기획 작업 데이터. images의 첫 번째 항목이 카드 썸네일입니다.
// 값이 빈 문자열("")이거나 빈 배열인 필드는 화면에 표시되지 않습니다.

export const planning = [
  {
    id: 'town-mice-ideathon',
    title: '영수증 플랫폼 기반 Town MICE 아이디어톤',
    group: 'planning',
    category: '기획',
    year: '2026',
    period: '', // TODO: 기간
    team: '', // TODO: 개인 / 팀 (n명)
    role: '', // TODO: 맡은 역할
    tools: [], // TODO: 사용 툴
    award: '대상',
    series: '',
    seriesDescription: '',
    summary: '영수증 플랫폼을 활용한 화천군 관광 문제 해결 아이디어',
    description:
      '한림대학교 Town MICE 연구소가 주최한 아이디어톤으로, (주)더픽트의 영수증 플랫폼을 활용해 화천군 관광 문제를 해결하는 방안을 제안했습니다.',
    // TODO: 제안한 핵심 아이디어 2~3문장을 description에 추가
    process: '', // TODO: 작업 과정
    images: ['/images/planning/town-mice-ideathon/cover.webp'],
    items: [],
    link: '',
    linkLabel: '',
    featured: true,
  },
]
