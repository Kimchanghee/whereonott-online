import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
