import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}'],
  darkMode: 'class',
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        halo: {
          primary: '#efefef',
          secondary: '#4B53F2',
          accent: '#FFFFFF',
          neutral: '#4B53F2',
          'base-100': '#01020B',
          info: '#2463eb',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
    ],
  },
};

export default config;
