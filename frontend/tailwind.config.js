/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        mainPink: '#ff82b2',
        mainOrange: '#ffb347',
        bgSoft: '#f9fafb'
      },
      fontFamily: {
        bangla: ['Noto Sans Bengali', 'sans-serif']
      },
      boxShadow: {
        soft: '0 6px 18px rgba(255, 130, 178, 0.25)'
      }
    }
  },
  plugins: []
}


