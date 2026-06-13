import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        // Warm slate — basis surfaces
        surface: {
          DEFAULT: '#FAFAF9',
          raised: '#FFFFFF',
          subtle: '#F5F4F2',
          overlay: '#EDEBE8',
        },
        // Warm dark sidebar
        canvas: {
          DEFAULT: '#1C1917',
          muted: '#292524',
          subtle: '#44403C',
        },
        // Primary text
        ink: {
          DEFAULT: '#1C1917',
          muted: '#57534E',
          faint: '#A8A29E',
        },
        // Indigo accent
        accent: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#EEF2FF',
          muted: '#C7D2FE',
        },
        // Status
        success: {
          DEFAULT: '#059669',
          light: '#ECFDF5',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FFFBEB',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEF2F2',
        },
        // Borders
        border: {
          DEFAULT: '#E7E5E4',
          strong: '#D6D3D1',
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '6px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        sidebar: '1px 0 0 rgba(0,0,0,0.08)',
        modal: '0 20px 60px rgba(0,0,0,0.18)',
      },
      letterSpacing: {
        tight: '-0.02em',
        tighter: '-0.03em',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};

export default config;
