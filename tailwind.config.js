/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: '#07070d', // Dark canvas background
        surface1: 'rgba(255, 255, 255, 0.05)', // Translucent dark surface
        surface2: 'rgba(255, 255, 255, 0.02)', // Translucent pale dark surface
        surface3: 'rgba(255, 255, 255, 0.08)', // High-contrast translucent surface
        border1: 'rgba(255, 255, 255, 0.1)', // Subtle white divider
        border2: 'rgba(255, 255, 255, 0.06)', // Softest dark boundary
        primary: {
          DEFAULT: '#ffffff', // White primary text/accent in dark theme
          hover: '#f2f2f2',
        },
        secondary: {
          DEFAULT: '#ff7759', // Cohere coral accent
          hover: '#e65f40',
        },
        success: '#10b981', // Glowing emerald green
        textPrimary: '#ffffff', // Light ink text
        textSecondary: 'rgba(255, 255, 255, 0.65)', // Body muted grey
        textMuted: 'rgba(255, 255, 255, 0.4)', // Light muted label
        
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
