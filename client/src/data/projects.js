// 작업 데이터. images의 첫 번째 항목이 카드 썸네일입니다.
// 값이 빈 문자열("")이거나 빈 배열인 필드는 화면에 표시되지 않습니다.

const EX_LIBRIS_CONTEST = '2026 강원과 함께 하는 도서관 - 장서표 디자인 공모전'

const INJE_SERIES_DESCRIPTION =
  '인제를 대표하는 두 가지 자연 — 두루미와 곰배령 얼레지를 모티프로 한 장서표 시리즈입니다. 목판화 감성의 단색 일러스트와 굵은 타이포그래피로 인제 기적의 도서관의 정체성을 담백하게 담았으며, 등록번호·분류기호·등록일 기입란을 갖춰 실제 장서표로도 기능할 수 있도록 디자인했습니다.'

export const projects = [
  /* ───────────── 기획 ───────────── */
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
  {
    id: 'pyeongchang-music-festival',
    title: '평창대관령음악제 광고기획서',
    group: 'planning',
    category: '기획',
    year: '2026',
    period: '', // TODO: 기간
    team: '', // TODO: 개인 / 팀 (n명)
    role: '', // TODO: 맡은 역할
    tools: [], // TODO: 사용 툴
    award: '',
    series: '',
    seriesDescription: '',
    summary: "공연이 끝난 뒤의 여운을 다시 찾아오게 만드는 '후유증 마케팅'",
    description:
      "평창대관령음악제를 대상으로 '후유증 마케팅'을 핵심 콘셉트로 한 광고기획서입니다. 데이터에 기반한 7단계 전략 구조로 문제를 정의하고, 5개의 IMC 트랙으로 실행안을 설계했습니다. 네 차례 버전을 고쳐가며 논리를 다듬었습니다.",
    process: '', // TODO: 작업 과정
    images: ['/images/planning/pyeongchang-music-festival/cover.webp'],
    items: [],
    link: '',
    linkLabel: '',
    featured: false,
  },
  {
    id: 'dang-chuncheon',
    title: '댕춘천 — 반려견 동반여행 도시 브랜딩',
    group: 'planning',
    category: '기획',
    year: '2026',
    period: '', // TODO: 기간
    team: '', // TODO: 개인 / 팀 (n명)
    role: '', // TODO: 맡은 역할
    tools: [], // TODO: 사용 툴
    award: '',
    series: '',
    seriesDescription: '',
    summary: '춘천을 반려견과 함께 여행하는 도시로 브랜딩하는 IMC 제안',
    description:
      '춘천을 반려견 동반여행 도시로 포지셔닝하는 IMC 제안서입니다. 댕춘천여행코스, 댕댕패스, 도그페스타, SNS 캠페인, 반려문화 캠페인의 다섯 가지 전략을 제안하고, 17장의 발표 자료와 19쪽 분량의 보고서로 정리했습니다. AI 활용 과정과 그 한계에 대한 평가도 함께 담았습니다.',
    process: '', // TODO: 작업 과정
    images: ['/images/planning/dang-chuncheon/cover.webp'],
    items: [],
    link: '',
    linkLabel: '',
    featured: false,
  },
  {
    id: 'hwacheon-sns-strategy',
    title: '화천 관광 SNS·MICE 전략',
    group: 'planning',
    category: '기획',
    year: '2026',
    period: '', // TODO: 기간
    team: '', // TODO: 개인 / 팀 (n명)
    role: '', // TODO: 맡은 역할
    tools: [], // TODO: 사용 툴
    award: '',
    series: '',
    seriesDescription: '',
    summary: '수달 캐릭터 IP와 AI 숏폼으로 설계한 화천 관광 콘텐츠 전략',
    description:
      'SNS 콘텐츠 전략과 MICE·DMO 두 수업에 걸쳐 진행한 화천 관광 프로젝트입니다. 수달 캐릭터 IP를 중심으로 AI 애니메이션 숏폼 전략을 세우고, DMO 거버넌스 분석, SWOT·TOWS, AISAS 모델, 경쟁 사례 벤치마킹을 통해 실행 근거를 쌓았습니다.',
    process: '', // TODO: 작업 과정
    images: ['/images/planning/hwacheon-sns-strategy/cover.webp'],
    items: [],
    link: '',
    linkLabel: '',
    featured: false,
  },

  /* ───────────── 디자인 ───────────── */
  {
    id: 'quiet-miracle',
    title: '고요한 기적',
    group: 'design',
    category: '장서표',
    year: '2026',
    period: '', // TODO: 기간
    team: '', // TODO: 개인 / 팀 (n명)
    role: '', // TODO: 맡은 역할
    tools: ['ChatGPT', 'Illustrator'],
    award: `${EX_LIBRIS_CONTEST} 최우수상`,
    series: '',
    seriesDescription: '',
    summary: '소란스럽지 않게, 그러나 분명하게 — 인제 기적의 도서관은 오늘도 조용히 빛납니다.',
    description:
      '소란스럽지 않게, 그러나 분명하게 — 인제 기적의 도서관은 오늘도 조용히 빛납니다. 산과 숲, 꽃과 별빛 사이에 고요히 자리한 도서관의 풍경을 빈티지 에칭 기법으로 담았습니다. 책 한 권을 펼치는 작고 고요한 순간이 누군가에게 가장 큰 기적이 되기를 바라는 마음을 이 장서표에 새겼습니다.',
    process:
      'ChatGPT 이미지 생성 기능을 활용하여 에칭 스타일 일러스트를 제작하고, 직접 구성 편집·타이포그래피 배치 및 작품 콘셉트 스토리 창작을 진행했습니다.',
    images: ['/images/work/project-04-1.jpg'],
    items: [],
    link: '',
    linkLabel: '',
    featured: true,
  },
  {
    id: 'heunyeol',
    title: '흔열 (痕熱)',
    group: 'design',
    category: '포스터',
    year: '2026',
    period: '', // TODO: 기간
    team: '', // TODO: 개인 / 팀 (n명)
    role: '', // TODO: 맡은 역할
    tools: ['Claude', 'ChatGPT', 'Flow'],
    award: '2026 디지털인문예술전공 기말프로젝트 전시회 홍보 포스터 공모전 장려상',
    series: '',
    seriesDescription: '',
    summary: "본 포스터는 디지털 시스템 속 '휴먼 터치'를 주제로 한 작품입니다.",
    description:
      "본 포스터는 디지털 시스템 속 '휴먼 터치'를 주제로 한 작품입니다. 흔열(痕熱)이란 흔적과 잔열의 합성어로, 손이 떠난 자리에도 남아있는 온기를 의미합니다. 배경을 가득 채운 동심원의 띠들은 인간의 지문 융선에서 착안한 것으로, 기술 이전에 존재하는 인간의 감각과 흔적을 상징합니다. 그 위에 놓인 와이어프레임 찻주전자는 디지털 시스템의 구조물로, HTTP 상태 코드 418 'I'm a Teapot'에서 가져온 오브제입니다. 유기적으로 굽이치는 지문의 결 위에 차갑고 기하학적인 와이어프레임이 겹치는 이 장면은, 디지털 기술이 아무리 정밀해져도 그것을 만지고 움직이는 것은 결국 인간의 손임을 가시화합니다. 시스템은 차갑지만, 거기에 닿았던 손의 온기는 사라지지 않습니다.",
    process:
      'AI 툴은 Claude(Anthropic), ChatGPT(OpenAI), Flow(이미지 생성)를 활용했으며, 학생은 초기 콘셉트 기획과 지문을 모티프로 한 배경 조형 언어 설계, 와이어프레임 오브제 선택, 컬러 팔레트 및 타이포그래피 디렉팅, 포스터 레이아웃 전반을 이끌었습니다.',
    // 영상(mp4)은 모달에서만 불러옵니다.
    images: ['/images/work/project-01-1.jpg', '/images/work/project-01-loop.mp4'],
    items: [],
    link: '',
    linkLabel: '',
    featured: false,
  },
  {
    id: 'inje-series',
    title: '인제의 것들',
    group: 'design',
    category: '장서표',
    year: '2026',
    period: '', // TODO: 기간
    team: '', // TODO: 개인 / 팀 (n명)
    role: '', // TODO: 맡은 역할
    tools: ['ChatGPT', 'Illustrator'],
    award: `${EX_LIBRIS_CONTEST} 출품작`,
    series: '인제의 것들',
    seriesDescription: INJE_SERIES_DESCRIPTION,
    summary: '인제를 대표하는 두 가지 자연 — 두루미와 곰배령 얼레지를 모티프로 한 장서표 시리즈입니다.',
    description: '',
    process: '',
    images: ['/images/work/project-07-1.jpg', '/images/work/project-08-1.jpg'],
    items: [
      {
        title: '여기서 피어납니다',
        description:
          '곰배령 고원에서만 만날 수 있는 얼레지 — 척박한 땅에서도 기어이 꽃을 피우는 그 야생화처럼, 지식도 어디서든 조용히 그러나 반드시 피어납니다. 보랏빛 꽃과 초록 잎을 목판화 기법으로 표현해 인제 자연의 소박하고 귀한 아름다움을 담았습니다. 이 장서표가 붙은 책 한 권이 누군가에게 얼레지처럼 작지만 소중한 기적이 되기를 바랍니다.',
        process:
          'ChatGPT 이미지 생성 기능을 활용하여 목판화 스타일 일러스트를 제작하고, 직접 타이포그래피 배치·레이아웃 구성 및 작품 콘셉트 스토리 창작을 진행했습니다.',
        images: ['/images/work/project-07-1.jpg'],
      },
      {
        title: '더 멀리, 더 높이',
        description:
          '천연기념물 제203호, 두루미 — 인제의 하늘을 유유히 가로지르는 그 존재처럼, 책도 우리를 더 멀리, 더 높이 데려다줍니다. 목판화 감성의 굵고 담백한 선으로 두루미의 고결함을 담았으며, 실용적인 장서표 기능과 함께 인제 기적의 도서관만의 정체성을 한 장에 새겼습니다. 이 책을 펼치는 모든 이가 두루미의 날갯짓처럼 자유롭고 높이 날아오르기를 바랍니다.',
        process:
          'ChatGPT 이미지 생성 기능을 활용하여 목판화 스타일 일러스트를 제작하고, 직접 타이포그래피 배치·레이아웃 구성 및 작품 콘셉트 스토리 창작을 진행했습니다.',
        images: ['/images/work/project-08-1.jpg'],
      },
    ],
    link: '',
    linkLabel: '',
    featured: false,
  },
  {
    id: 'ex-libris-entries',
    title: '강원과 함께 하는 도서관 장서표 공모전 출품작',
    group: 'design',
    category: '장서표',
    year: '2026',
    period: '', // TODO: 기간
    team: '', // TODO: 개인 / 팀 (n명)
    role: '', // TODO: 맡은 역할
    tools: ['Claude', 'ChatGPT', 'Illustrator'],
    award: '',
    series: '',
    seriesDescription: '',
    summary: '', // TODO: 카드 한 줄 요약
    description: '',
    process: '',
    images: [
      '/images/work/project-02-1.jpg',
      '/images/work/project-03-1.jpg',
      '/images/work/project-05-1.jpg',
      '/images/work/project-06-1.jpg',
    ],
    items: [
      {
        title: '빛이 되는 이야기',
        description:
          '강원도 인제의 자연 속에 자리한 기적의 도서관을 아침과 밤, 두 가지 시간의 빛으로 담았습니다. 책에서 피어오르는 별빛 궤적은 독서가 곧 빛이 되어 세상을 비춘다는 메시지를 시각화한 것입니다. 이 장서표를 통해 책 한 권이 누군가에게 기적의 시작이 되기를 바랍니다.',
        process:
          'Claude와 ChatGPT의 이미지 생성 기능을 활용하여 일러스트를 제작하고, 컬러 조정·타이포·전체 구성은 직접 디자인했습니다.',
        images: ['/images/work/project-02-1.jpg', '/images/work/project-02-2.jpg'],
      },
      {
        title: '기적의 비상(飛翔)',
        description:
          '인제의 산맥 위를 가로지르는 두 마리 학이 별을 향해 날아오릅니다. 발아래에는 강원의 야생화가 피어나고, 펼쳐진 책에서는 빛이 솟아오릅니다. 학의 자유로운 비상처럼, 책 속의 지식도 경계 없이 뻗어나가기를 — 인제 기적의 도서관이 그 날갯짓의 출발점이 되기를 바라는 마음을 담았습니다. 빈티지 에칭 기법의 감성으로, 도서관의 고전적 가치와 인제 자연의 아름다움을 한 장에 새겼습니다.',
        process:
          'ChatGPT 이미지 생성 기능을 활용하여 에칭 스타일 일러스트를 제작하고, 직접 구성 편집·타이포그래피 배치 및 작품 콘셉트 스토리 창작을 진행했습니다.',
        images: ['/images/work/project-03-1.jpg'],
      },
      {
        title: '달빛 아래의 서재',
        description:
          '초승달이 뜨는 인제의 밤, 숲과 꽃 사이로 도서관이 조용히 빛납니다. 펼쳐진 책 한 권에서 피어오른 별빛 한 줄기가 달을 향해 고요히 이어지고, 나무들은 그 모든 풍경을 말없이 감쌉니다. 낮의 소란이 가라앉은 밤, 책과 함께하는 시간이 가장 빛나는 기적임을 초록빛 에칭 선각으로 담았습니다.',
        process:
          'ChatGPT 이미지 생성 기능을 활용하여 에칭 스타일 일러스트를 제작하고, 직접 구성 편집·타이포그래피 배치 및 작품 콘셉트 스토리 창작을 진행했습니다.',
        images: ['/images/work/project-05-1.jpg'],
      },
      {
        title: '경계 없는 날갯짓',
        description:
          '자연과 우주, 지식의 세계는 원래 경계가 없습니다. 인제의 산맥과 야생화 위로 두 마리 학이 행성을 향해 거침없이 날아오르듯, 책 한 권을 펼치는 순간 우리의 상상도 어떤 한계도 넘어섭니다. 라임에서 보라로 물드는 생동감 넘치는 색감 속에 인제 기적의 도서관이 품은 무한한 가능성과 자유를 이 장서표에 담았습니다.',
        process:
          'ChatGPT 이미지 생성 기능을 활용하여 에칭 스타일 일러스트 및 그라데이션 배경을 제작하고, 직접 구성 편집·타이포그래피 배치 및 작품 콘셉트 스토리 창작을 진행했습니다.',
        images: ['/images/work/project-06-1.jpg'],
      },
    ],
    link: '',
    linkLabel: '',
    featured: false,
  },
  {
    id: 'hadong-chuncheon-summer',
    title: '하동이와 함께하는 춘천 여름',
    group: 'design',
    category: '캐릭터',
    year: '2026',
    period: '', // TODO: 기간
    team: '', // TODO: I-SO 동아리 활동 — 팀 인원 확인 후 "팀 (n명)"
    role: '', // TODO: 맡은 역할
    tools: [], // TODO: 사용 툴
    award: '26-1 DAH EXHIBITION 우수상',
    series: '춘천 계절연구소',
    seriesDescription:
      '춘천 계절연구소: 하동이와 함께하는 중도 물레길 여행 — I-SO(아이소), 디인예 전공 동아리',
    summary: "춘천의 여름을 상징하는 수달 가이드 '하동이'의 캐릭터 숍입니다.",
    description:
      "춘천의 여름을 상징하는 수달 가이드 '하동이'의 캐릭터 숍입니다. 춘천 명소를 생생한 3D 영상으로 투어하고, 하동이의 개성이 담긴 굿즈를 만나는 입체적인 디지털 경험을 제공합니다.",
    process: '', // TODO: 작업 과정
    images: ['/images/work/project-09-1.jpg'],
    items: [],
    link: 'https://chuncheon-sri.vercel.app/',
    linkLabel: '웹사이트',
    featured: false,
  },
  {
    id: 'synk',
    title: 'SYNK',
    group: 'design',
    category: 'UX·UI',
    year: '2026',
    period: '', // TODO: 기간
    team: '팀', // TODO: 인원 확인 후 "팀 (n명)"
    role: '', // TODO: 맡은 역할
    tools: [], // TODO: 사용 툴
    award: '디지털인문예술입문 팀 프로젝트',
    series: 'Team SYNK',
    seriesDescription: '디지털인문예술입문',
    summary:
      '시각 정보를 음성과 촉각으로 번역해, 누구나 자신의 스타일과 취향을 독립적으로 표현할 수 있도록 돕는 서비스',
    description:
      '시각 정보를 음성과 촉각으로 번역해, 누구나 자신의 스타일과 취향을 독립적으로 표현할 수 있도록 돕는 서비스',
    process: '', // TODO: 작업 과정
    images: ['/images/work/project-10-1.jpg'],
    items: [],
    link: 'https://ffgi-q9r6.vercel.app/',
    linkLabel: '웹사이트',
    featured: false,
  },
]

export const DESIGN_CATEGORIES = ['포스터', '장서표', '캐릭터', 'UX·UI']
