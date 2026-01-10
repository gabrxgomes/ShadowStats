import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#14F195',
          500: '#00D18C',
          600: '#00B377',
        },
        secondary: {
          400: '#9945FF',
          500: '#7B2FE8',
          600: '#5E1FBF',
        },
        accent: {
          400: '#00C2FF',
          500: '#00A3D9',
        },
        bg: {
          primary: '#0D0D0D',
          secondary: '#141414',
          tertiary: '#1A1A1A',
          hover: '#242424',
        },
        border: {
          DEFAULT: '#2A2A2A',
          hover: '#3A3A3A',
          focus: '#14F195',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0A0',
          tertiary: '#666666',
        },
        success: '#14F195',
        warning: '#FFB800',
        error: '#FF4D4D',
        info: '#00C2FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(20, 241, 149, 0.3)',
        'glow-purple': '0 0 20px rgba(153, 69, 255, 0.3)',
      },
      backgroundImage: {
        'gradient-solana': 'linear-gradient(135deg, #14F195 0%, #9945FF 100%)',
        'gradient-solana-subtle': 'linear-gradient(135deg, rgba(20, 241, 149, 0.1) 0%, rgba(153, 69, 255, 0.1) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
