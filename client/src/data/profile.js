const EMAIL = 'a01022966356@gmail.com'

export const profile = {
  name: '박채빈',
  tagline: ['디지털과 인문, 인간과 AI의 교차점에서', '이제 막 첫 페이지를 씁니다'],
  intro:
    '기획하고, 알리고, 기록하는 일을 합니다. 광고기획서와 캠페인 제안서를 쓰고, 포스터와 장서표를 만들고, 그 과정을 기록으로 남깁니다.',
  photo: '/images/profile.webp',
  info: [
    { label: '이름', value: '박채빈' },
    { label: '소속', value: '한림대학교 미래융합스쿨' },
    { label: '학년', value: '1학년' },
    { label: '학번', value: '20266616' },
    { label: '이메일', value: EMAIL, href: `mailto:${EMAIL}` },
  ],
  skills: [
    'Blender',
    'Figma',
    'Illustrator',
    'Claude',
    'Claude Code',
    'Antigravity IDE',
    'GitHub',
    'Vercel',
    'Google Gemini',
    'ChatGPT',
    'Flow',
  ],
}

export const contacts = [
  { label: '이메일', value: EMAIL, href: `mailto:${EMAIL}` },
  { label: '전화번호', value: '010-2295-6356', href: 'tel:01022956356' },
  { label: 'GitHub', value: 'github.com/h20266616-maker', href: 'https://github.com/h20266616-maker' },
]
