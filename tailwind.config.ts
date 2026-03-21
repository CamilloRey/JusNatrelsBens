import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - Natural green palette
        brand: {
          25: '#f7fdf6',
          50: '#f0fae8',
          100: '#e0f5d0',
          200: '#c2eca1',
          300: '#a3e372',
          400: '#7dd443',
          500: '#5ab937', // Main brand color
          600: '#439a2e',
          700: '#2d7a25',
          800: '#1f5c1c',
          900: '#143d13',
        },
        // Accent colors - Vibrant orange
        accent: {
          25: '#fffaf5',
          50: '#fff4eb',
          100: '#ffe6cf',
          200: '#ffd4a3',
          300: '#ffbd76',
          400: '#ffa34d',
          500: '#ff8a1a', // Accent color
          600: '#f27a0f',
          700: '#d86b0a',
          800: '#b85507',
          900: '#7d3804',
        },
        // Neutral colors - Professional grays
        neutral: {
          0: '#ffffff',
          50: '#f9fafb',
          100: '#f3f4f6',
          150: '#efefef',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        xs: '6px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'card': '0 12px 24px rgba(90, 185, 55, 0.08)',
        'card-hover': '0 20px 40px rgba(90, 185, 55, 0.12)',
      },
      spacing: {
        'safe-top': 'max(16px, env(safe-area-inset-top))',
        'safe-bottom': 'max(16px, env(safe-area-inset-bottom))',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
