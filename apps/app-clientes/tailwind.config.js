/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // Texto — formato RGB con alpha para soportar text-text/50, etc.
        text: 'rgb(var(--text) / <alpha-value>)',
        'text-heading': 'rgb(var(--text-h) / <alpha-value>)',

        // Fondos
        bg: 'rgb(var(--bg) / <alpha-value>)',
        'bg-elevated': 'rgb(var(--bg-elevated) / <alpha-value>)',
        'code-bg': 'rgb(var(--code-bg) / <alpha-value>)',
        'social-bg': 'rgb(var(--social-bg) / <alpha-value>)',

        // Bordes
        border: 'rgb(var(--border) / <alpha-value>)',

        // Acento (paleta emerald)
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          dark: 'rgb(var(--accent-dark) / <alpha-value>)',
          light: 'rgb(var(--accent-light) / <alpha-value>)',
        },

        // accent-bg y accent-border son COLORES PRECOMPUTADOS con baja opacidad,
        // NO usan <alpha-value>, ya que reemplazan el comportamiento del sistema
        // anterior (rgba(170, 59, 255, 0.1)). Esto evita que componentes que usan
        // `bg-accent-bg` queden verde sólido (que tapa íconos).
        'accent-bg': 'rgb(16 185 129 / 0.12)',
        'accent-border': 'rgb(16 185 129 / 0.5)',
      },
      fontFamily: {
        sans: 'var(--sans)',
        heading: 'var(--heading)',
        mono: 'var(--mono)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        soft: 'var(--shadow)',
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        accent: 'var(--shadow-accent)',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      backgroundImage: {
        'gradient-brand':
          'linear-gradient(135deg, rgb(5 150 105) 0%, rgb(16 185 129) 50%, rgb(52 211 153) 100%)',
        'gradient-radial':
          'radial-gradient(ellipse at top, rgb(16 185 129 / 0.1), transparent)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};