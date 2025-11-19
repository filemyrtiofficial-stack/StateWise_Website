/** @type {import('tailwindcss').Config} */
export default {
  // Aggressive content scanning to reduce CSS size
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Safelist only essential dynamic classes
  safelist: [
    'animate-spin',
    'bg-primary-600',
    'text-primary-600',
  ],
  theme: {
    extend: {
      maxWidth: {
        '7xl': '84rem', // 1344px
      },
      colors: {
        primary: {
          50: '#e6f2fa',
          100: '#cce5f5',
          200: '#99cbeb',
          300: '#66b1e1',
          400: '#3397d7',
          500: '#017dcd',
          600: '#026CB6', // Brand color: rgb(2,108,182)
          700: '#015a9a',
          800: '#01487d',
          900: '#003661',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'slideUp': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
  // Optimize for production
  corePlugins: {
    // Disable unused features to reduce CSS size
    preflight: true,
  },
  // Remove unused CSS more aggressively
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
      'animate-spin',
      'bg-primary-600',
      'text-primary-600',
      'h-16',
      'bg-white',
    ],
    // Remove unused keyframes and animations
    defaultExtractor: (content) => {
      const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
      const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
      return broadMatches.concat(innerMatches);
    },
  },
}

