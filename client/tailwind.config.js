/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAFA',
        ink: '#1C1C1C',
        muted: '#6B6B6B',
        line: '#E4E4E4',
        accent: '#AAFF00',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        body: '400',
        heading: '700',
      },
      fontSize: {
        body: ['16px', { lineHeight: '1.7' }],
        small: ['14px', { lineHeight: '1.6' }],
        h3: ['18px', { lineHeight: '1.4' }],
        h2: ['24px', { lineHeight: '1.35' }],
        h1: ['36px', { lineHeight: '1.25' }],
      },
      maxWidth: {
        prose: '40em', // 한글 약 40자
        page: '1200px',
      },
      spacing: {
        header: '64px',
        section: '120px',
        gutter: '16px',
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
      },
      textUnderlineOffset: {
        link: '4px',
      },
      textDecorationThickness: {
        link: '2px',
      },
      outlineWidth: {
        focus: '2px',
      },
      outlineOffset: {
        focus: '2px',
      },
      zIndex: {
        header: '40',
        modal: '50',
      },
    },
  },
  plugins: [],
}
