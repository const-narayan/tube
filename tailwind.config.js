/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        youtube: ['Roboto', 'Arial', 'sans-serif'],
      },
      colors: {
        'yt-bg': '#0f0f0f',
        'yt-surface': '#212121',
        'yt-surface-hover': '#3d3d3d',
        'yt-text': '#f1f1f1',
        'yt-text-secondary': '#aaaaaa',
        'yt-border': '#3f3f3f',
        'yt-red': '#ff0000',
        'yt-blue': '#3ea6ff',
      },
    },
  },
  plugins: [],
}
