// 홍보·기획 작업 데이터. images의 첫 번째 항목이 카드 썸네일입니다.
// 값이 빈 문자열("")이거나 빈 배열인 필드는 화면에 표시되지 않습니다.

const TM = '/images/planning/town-mice'

export const planning = [
  {
    id: 'town-mice-ideathon',
    title: '화천 지역상생 영수증',
    subtitle: '영수증 플랫폼 기반 Town MICE 아이디어톤',
    group: 'planning',
    category: '앱 개발',
    year: '2026',
    period: '', // TODO: 기간
    team: '팀', // TODO: 인원 확인 후 "팀 (n명)"
    role: '앱 개발',
    tools: ['React', 'Vite', 'Firebase', '카카오맵 API', 'Vercel'],
    toolsLabel: '사용 기술',
    award: '대상',
    series: '',
    seriesDescription: '',
    summary: '영수증 한 장이 화천의 소비를 잇는 지역상생 캐시백 서비스',
    description:
      '한림대학교 Town MICE 연구소가 주최하고 (주)더픽트의 영수증 플랫폼을 활용해 화천군 관광 문제를 해결하는 아이디어톤에서 대상을 받았습니다. 팀에서 앱 개발을 맡아, 화천에서 쓴 영수증을 인증하면 캐시백과 스탬프가 쌓이고 그 캐시백을 다시 화천의 온라인 상점과 가맹점에서 쓰는 흐름을 실제로 동작하는 웹앱으로 구현했습니다.',
    features: [
      '영수증 촬영·앨범 업로드로 인증, 인증할수록 캐시백률 10→15→20%',
      '누적·현재·사용 캐시백 구분, 군 장병 인증 시 캐시백 1.5배',
      '화천 명소 9곳 스탬프 투어, 5개 모으면 쿠폰·9개면 완주 배지',
      '캐시백으로 화천 농가 스마트스토어 상품 결제(체험)',
      '카카오맵 기반 가맹점·자전거 대여소 지도',
      '구글·이메일 로그인, 게스트로 바로 둘러보기',
    ],
    note: '영수증 인증과 캐시백 결제는 시연용 화면입니다.',
    process: '', // TODO: 작업 과정
    // 첫 번째가 카드 썸네일, 상세 화면에서는 순서대로 넘겨보기
    images: [
      `${TM}/02-start.webp`,
      `${TM}/03-receipt.webp`,
      `${TM}/04-cashback.webp`,
      `${TM}/05-store.webp`,
      `${TM}/06-map.webp`,
      `${TM}/01-screens.webp`,
    ],
    // 가로 이미지를 세로 카드에 맞출 때 폰 화면(시작·홈)이 온전히 보이도록 자르는 위치
    thumbPosition: '60% 50%',
    // 세로로 긴 서비스 소개 보드 — 슬라이드 대신 새 탭 링크로
    board: { href: `${TM}/00-board.webp`, label: '서비스 소개 보드 전체 보기' },
    items: [],
    link: 'https://hwacheon-receipt.vercel.app/',
    linkLabel: '화천 지역상생 영수증',
    featured: true,
  },
]
