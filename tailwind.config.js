/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: '#ffffff', // Stark white canvas background
        surface1: '#eeece7', // Warm mineral soft stone
        surface2: '#fcfbf9', // Mineral white off-white surface
        surface3: '#e5e7eb', // High-contrast light grey surface
        border1: '#e5e7eb', // Subtle light grey divider
        border2: '#f2f2f2', // Softest light boundary
        primary: {
          DEFAULT: '#17171c', // Near-Black primary text/accent in light theme
          hover: '#000000',
        },
        secondary: {
          DEFAULT: '#ff7759', // Cohere coral accent
          hover: '#e65f40',
        },
        success: '#10b981', // Emerald green
        textPrimary: '#17171c', // Dark ink text
        textSecondary: '#616161', // Body muted grey/ink
        textMuted: '#93939f', // Muted slate label
        
        // Direct Cohere Color Tokens
        cohereBlack: '#000000',
        deepGreen: '#003c33',
        darkNavy: '#071829',
        softStone: '#eeece7',
        paleGreen: '#edfce9',
        paleBlue: '#f1f5ff',
        actionBlue: '#1863dc',
        coral: '#ff7759',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'mesh-move': 'mesh 20s ease infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        mesh: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      boxShadow: {
        DEFAULT: 'none',
        sm: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        '3xl': 'none',
        inner: 'none',
        none: 'none',
      },
    },
  },
  plugins: [],
}
