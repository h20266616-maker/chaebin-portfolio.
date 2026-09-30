export const projects = [
  {
    id: 11,
    title: '화천 지역상생 영수증',
    category: 'APP DEVELOPMENT',
    year: '2026',
    award: '✦ 2026 영수증 플랫폼 기반 Town MICE 아이디어톤 대상',
    series: 'Town MICE 아이디어톤',
    seriesDescription:
      '한림대학교 Town MICE 연구소 주최, (주)더픽트 영수증 플랫폼을 활용한 화천군 관광 문제 해결 아이디어톤',
    description:
      '영수증 한 장이 화천의 소비를 잇는 지역상생 캐시백 서비스입니다. 화천에서 쓴 영수증을 찍거나 앨범에서 올리면 캐시백과 스탬프가 쌓이고, 쌓은 캐시백은 화천의 온라인 상점과 가맹점에서 다시 쓸 수 있습니다. 인증할수록 캐시백률이 10%에서 20%까지 오르고, 화천 명소 9곳 스탬프 투어와 카카오맵 기반 가맹점·자전거 대여소 지도를 함께 제공합니다.',
    process:
      '팀에서 앱 개발을 맡아 아이디어를 실제로 동작하는 웹앱으로 구현했습니다. 구글·이메일 로그인과 게스트 둘러보기, 영수증 인증과 캐시백 적립, 스탬프북, 온라인 상점 캐시백 결제(체험), 지도·자전거 화면을 만들었습니다. 영수증 인증과 캐시백 결제는 시연용 화면입니다.',
    tools: ['React', 'Vite', 'Firebase', '카카오맵 API', 'Vercel'],
    link: 'https://hwacheon-receipt.vercel.app/',
    linkLabel: '화천 지역상생 영수증',
    role: '팀 프로젝트 · 앱 개발 담당',
    images: [
      '/images/work/project-11-1.jpg',
      '/images/planning/town-mice/02-start.webp',
      '/images/planning/town-mice/03-receipt.webp',
      '/images/planning/town-mice/04-cashback.webp',
      '/images/planning/town-mice/05-store.webp',
      '/images/planning/town-mice/06-map.webp',
    ],
  },
  {
    id: 1,
    title: '흔열 (痕熱)',
    category: 'POSTER DESIGN',
    year: '2026',
    award: '2026 디지털인문예술전공 기말프로젝트 전시회 홍보 포스터 공모전 장려상',
    description:
      "본 포스터는 디지털 시스템 속 '휴먼 터치'를 주제로 한 작품입니다. 흔열(痕熱)이란 흔적과 잔열의 합성어로, 손이 떠난 자리에도 남아있는 온기를 의미합니다. 배경을 가득 채운 동심원의 띠들은 인간의 지문 융선에서 착안한 것으로, 기술 이전에 존재하는 인간의 감각과 흔적을 상징합니다. 그 위에 놓인 와이어프레임 찻주전자는 디지털 시스템의 구조물로, HTTP 상태 코드 418 'I'm a Teapot'에서 가져온 오브제입니다. 유기적으로 굽이치는 지문의 결 위에 차갑고 기하학적인 와이어프레임이 겹치는 이 장면은, 디지털 기술이 아무리 정밀해져도 그것을 만지고 움직이는 것은 결국 인간의 손임을 가시화합니다. 시스템은 차갑지만, 거기에 닿았던 손의 온기는 사라지지 않습니다.",
    process:
      'AI 툴은 Claude(Anthropic), ChatGPT(OpenAI), Flow(이미지 생성)를 활용했으며, 학생은 초기 콘셉트 기획과 지문을 모티프로 한 배경 조형 언어 설계, 와이어프레임 오브제 선택, 컬러 팔레트 및 타이포그래피 디렉팅, 포스터 레이아웃 전반을 이끌었습니다.',
    tools: ['Claude', 'ChatGPT', 'Flow'],
    images: [
      '/images/work/project-01-1.jpg',
      '/images/work/project-01-loop.mp4',
    ],
  },
  {
    id: 'exlibris-2026',
    title: '인제 기적의 도서관 장서표',
    category: 'EX LIBRIS',
    year: '2026',
    award: '2026 강원과 함께 하는 도서관 - 장서표 디자인 공모전 최우수상 「고요한 기적」',
    description:
      '강원도 인제의 기적의 도서관을 주제로 한 장서표 공모전 출품작 7점입니다. 빈티지 에칭과 목판화 기법으로 인제의 산과 숲, 야생화, 두루미를 담았고, 그중 「고요한 기적」이 최우수상을 받았습니다.',
    process:
      'ChatGPT 이미지 생성 기능으로 에칭·목판화 스타일 일러스트를 제작하고, 구성 편집·타이포그래피 배치와 작품 콘셉트 스토리 창작은 직접 진행했습니다.',
    tools: ['Claude', 'ChatGPT', 'Illustrator'],
    images: [
      '/images/work/project-04-1.jpg',
      '/images/work/project-02-1.jpg',
      '/images/work/project-02-2.jpg',
      '/images/work/project-03-1.jpg',
      '/images/work/project-05-1.jpg',
      '/images/work/project-06-1.jpg',
      '/images/work/project-07-1.jpg',
      '/images/work/project-08-1.jpg',
    ],
    // images와 같은 순서·같은 개수 — 상세 모달에서 이미지별 제목으로 표시
    imageTitles: [
      '고요한 기적 · 최우수상',
      '빛이 되는 이야기 (1/2)',
      '빛이 되는 이야기 (2/2)',
      '기적의 비상(飛翔)',
      '달빛 아래의 서재',
      '경계 없는 날갯짓',
      '여기서 피어납니다 · 인제의 것들',
      '더 멀리, 더 높이 · 인제의 것들',
    ],
  },
  {
    id: 9,
    title: '하동이와 함께하는 춘천 여름',
    role: '팀 프로젝트 · 3D 작업 참여',
    category: 'CHARACTER DESIGN',
    year: '2026',
    award: '✦ 26-1 DAH EXHIBITION 우수상',
    series: '춘천 계절연구소',
    seriesDescription:
      '춘천 계절연구소: 하동이와 함께하는 중도 물레길 여행 — I-SO(아이소), 디인예 전공 동아리',
    description:
      "춘천의 여름을 상징하는 수달 가이드 '하동이'의 캐릭터 숍입니다. 춘천 명소를 생생한 3D 영상으로 투어하고, 하동이의 개성이 담긴 굿즈를 만나는 입체적인 디지털 경험을 제공합니다.",
    tools: [],
    link: 'https://chuncheon-sri.vercel.app/',
    linkLabel: '웹사이트',
    images: [
      '/images/work/project-09-1.jpg',
    ],
  },
  {
    id: 10,
    title: 'SYNK',
    role: '팀 프로젝트 · 발표와 자료 정리 담당',
    category: 'UX/UI DESIGN',
    year: '2026',
    award: '✦ 디지털인문예술입문 팀 프로젝트',
    series: 'Team SYNK',
    seriesDescription: '디지털인문예술입문',
    description:
      '시각 정보를 음성과 촉각으로 번역해, 누구나 자신의 스타일과 취향을 독립적으로 표현할 수 있도록 돕는 서비스',
    tools: [],
    link: 'https://ffgi-q9r6.vercel.app/',
    linkLabel: '웹사이트',
    images: [
      '/images/work/project-10-1.jpg',
    ],
  },
]
