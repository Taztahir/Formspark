/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A0F1E',
          card: '#131929',
          border: '#1E2A45'
        },
        spark: {
          DEFAULT: '#FF5C00',
          hover: '#E05000'
        },
        gray: {
          muted: '#8B8FA8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    }
  },
  plugins: [],
}
