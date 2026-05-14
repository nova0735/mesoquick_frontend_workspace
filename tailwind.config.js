/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // Texto
        text: 'var(--text)',
        'text-heading': 'var(--text-h)',

        // Fondos
        bg: 'var(--bg)',
        'code-bg': 'var(--code-bg)',
        'social-bg': 'var(--social-bg)',

        // Bordes
        border: 'var(--border)',

        // Acento (paleta morada del proyecto)
        accent: 'var(--accent)',
        'accent-bg': 'var(--accent-bg)',
        'accent-border': 'var(--accent-border)',
      },
      fontFamily: {
        sans: 'var(--sans)',
        heading: 'var(--heading)',
        mono: 'var(--mono)',
      },
      boxShadow: {
        soft: 'var(--shadow)',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
};