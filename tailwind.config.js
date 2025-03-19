/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f8ff',
          100: '#e0f0fe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a4f2',
          500: '#0d89e3',
          600: '#006cc3',
          700: '#0057a0',
          800: '#064a84',
          900: '#0c3f6e',
          950: '#082950',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#cafbef',
          200: '#95f5df',
          300: '#58e7ca',
          400: '#2dd2b4',
          500: '#14b397',
          600: '#0a907a',
          700: '#0a7364',
          800: '#0c5c51',
          900: '#0e4d44',
          950: '#042f2a',
        },
        dark: '#121212',
        light: '#fafafa',
        accent: '#FF5722',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'neu': '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
        'neu-dark': '20px 20px 60px #0f0f0f, -20px -20px 60px #171717',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 