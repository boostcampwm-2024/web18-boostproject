/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#00FF99',
        point: '#E02020',
        grayscale: {
          50: '#FAFAFA',
          100: '#F3F3F3',
          150: '#E8E8E8',
          200: '#D0D0D0',
          300: '#B8B8B8',
          400: '#898989',
          500: '#5A5A5A',
          600: '#414141',
          700: '#2A2A2A',
          800: '#1E1E1E',
          900: '#121212',
        },
      },
    },
  },
  plugins: [],
};
