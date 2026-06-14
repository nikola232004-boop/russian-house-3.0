import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hse-blue': '#0033A0',
        'hse-gold': '#C8A951',
        'hse-red': '#E31837',
        'paper-white': '#FAF9F6',
        'ink-black': '#1A1A1A',
        'legal-gray': '#5C5C5C',
      },
      fontFamily: {
        'times': ['Times New Roman', 'Times', 'serif'],
      },
      borderRadius: {
        'official': '2px',
      },
    },
  },
  plugins: [],
};
export default config;
