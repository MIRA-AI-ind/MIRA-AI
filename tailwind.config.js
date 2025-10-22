/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#2563eb',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          neutral: '#1f2937',
          'base-100': '#ffffff',
          'base-200': '#f3f4f6',
          'base-300': '#e5e7eb',
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#3b82f6',
          secondary: '#a78bfa',
          accent: '#06b6d4',
          neutral: '#1f2937',
          'base-100': '#0f172a',
          'base-200': '#1e293b',
          'base-300': '#334155',
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        }
      }
    ],
  },
} 