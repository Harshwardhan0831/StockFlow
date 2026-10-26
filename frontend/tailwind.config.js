/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6D28D9',
          dark: '#4A1D96',
          vibrant: '#7C3AED',
          light: '#8B5CF6',
          subtle: '#F5F3FF',
        },
        success: {
          DEFAULT: '#00D09C',
          light: '#ECFDF5',
        },
        danger: {
          DEFAULT: '#F43F5E',
          light: '#FFF1F2',
        },
        surface: '#FFFFFF',
        background: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
