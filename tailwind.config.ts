import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          teal: '#0b4f4a',
          navy: '#0A1A2F',
          green: '#A3E635',
          coral: '#FF796C',
          white: '#FFFFFF',
          sand: '#F4EDE4',
        },
      },
    },
  },
  plugins: [],
};

export default config;
