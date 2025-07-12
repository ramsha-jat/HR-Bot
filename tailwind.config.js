/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#3b82f6', // blue-500
          dark: '#1e40af', // blue-800
        },
        accent: {
          DEFAULT: '#f59e42', // orange-400
          light: '#fbbf24', // orange-300
        },
        background: {
          DEFAULT: '#f8fafc', // slate-50
          dark: '#1e293b', // slate-800
        },
        surface: '#ffffff',
        muted: '#e5e7eb', // gray-200
        border: '#d1d5db', // gray-300
        danger: '#ef4444', // red-500
        success: '#22c55e', // green-500
        warning: '#facc15', // yellow-400
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        md: '0.75rem',
        lg: '1.25rem',
        xl: '2rem',
      },
      boxShadow: {
        soft: '0 2px 8px 0 rgba(0,0,0,0.04)',
        card: '0 4px 24px 0 rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      },
    },
  },
  plugins: [],
} 