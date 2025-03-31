/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideOut: {
          '0%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
          '100%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        fadeOut: 'fadeOut 0.3s ease-out',
        slideIn: 'slideIn 0.3s ease-out',
        slideOut: 'slideOut 0.3s ease-out',
      },
    },
  },
  plugins: [],
} 