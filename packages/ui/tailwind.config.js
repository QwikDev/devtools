/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)', // e.g., text on primary button 2
        secondary: 'var(--color-secondary)',                   // e.g., muted button background or text 2
        'secondary-foreground': 'var(--color-secondary-foreground)', // 2
        muted: 'var(--color-muted)',                         // e.g., placeholder text or very subtle borders 2
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)',                       // e.g., for highlights, icons, or active states
        'accent-foreground': 'var(--color-accent-foreground)',
        border: 'var(--color-border)',                       // default border color
        input: 'var(--color-input)',                         // specific for input borders if different from general border 2
        ring: 'var(--color-ring)',                           // for focus rings 2
        'card-item-bg': 'var(--color-card-item-bg)', // 1
        'card-item-hover-bg': 'var(--color-card-item-hover-bg)', // 1
        'text-muted': 'var(--color-text-muted)',
      },
    },
  },
  plugins: [],
};
