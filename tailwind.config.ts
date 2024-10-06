import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx,scss,sass}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'tg-header-color': 'var(--tg-theme-section-header-text-color)',
        'tg-subtitle-color': 'var(--tg-theme-subtitle-text-color)',
        'tg-accent-color': 'var(--tg-theme-accent-text-color)',
        'tg-text-color': 'var(--tg-theme-text-color)',
        'tg-button-color': 'var(--tg-theme-button-color)',
        'tg-button-text-color': 'var(--tg-theme-button-text-color)',
        'tg-hint-color': 'var(--tg-theme-hint-color)',
        'tg-section-color': 'var(--tg-theme-section-bg-color)',
        'tg-section-second-color': 'var(--tg-second-section-color)',
        'tg-background-color': 'var(--tg-theme-bg-color)',
        'tg-header-background-color': 'var(--tg-theme-header-bg-color)',
        'tg-section-separator-color': 'var(--tg-theme-section-separator-color)',
        'tg-secondary-background-color': 'var(--tg-theme-secondary-bg-color)',
        'tg-bottom_background-color': 'var(--tg-theme-bottom-bar-bg-color)',
        'tg-destructive-text-color': 'var(--tg-theme-destructive-text-color)',
      },
    },
  },
  plugins: [],
}
export default config
