/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '72': '18rem',
        '96': '24rem',
        '120': '30rem',
      }
    },
  },
  safelist: [
    {
      pattern: /^h-/,
    },
    {
      pattern: /^bg-/,
    },
    {
      pattern: /^text-/,
    }
  ],
  plugins: [],
}
