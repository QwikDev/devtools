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
        'primary-foreground': 'var(--color-primary-foreground)', // e.g., text on primary button
        secondary: 'var(--color-secondary)',                   // e.g., muted button background or text
        'secondary-foreground': 'var(--color-secondary-foreground)',
        muted: 'var(--color-muted)',                         // e.g., placeholder text or very subtle borders
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)',                       // e.g., for highlights, icons, or active states
        'accent-foreground': 'var(--color-accent-foreground)',
        border: 'var(--color-border)',                       // default border color
        input: 'var(--color-input)',                         // specific for input borders if different from general border
        ring: 'var(--color-ring)',                           // for focus rings
        card: 'var(--color-card)',                           // card backgrounds
        'card-foreground': 'var(--color-card-foreground)',       // text on cards
      },
    },
  },
  plugins: [],
};
