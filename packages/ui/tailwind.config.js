/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-active': 'var(--color-primary-active)', // e.g., text on primary buttons
        secondary: 'var(--color-secondary)', // e.g., muted button background or text 2
        muted: 'var(--color-muted)', // e.g., placeholder text or very subtle borders 2
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)', // e.g., for highlights, icons, or active states
        border: 'var(--color-border)', // default border color
        input: 'var(--color-input)', // specific for input borders if different from general border 2
        ring: 'var(--color-ring)', // for focus rings 2
        'card-item-bg': 'var(--color-card-item-bg)', // 1
        'card-item-hover-bg': 'var(--color-card-item-hover-bg)', // 1
      },
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
    animation: {
      fadeIn: 'fadeIn 0.5s ease-out forwards',
    },
  },
  plugins: [],
};
