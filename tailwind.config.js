/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          50: '#EEF1F6',
          100: '#D7DEE9',
          400: '#3D5277',
          600: '#16294A',
          700: '#0F2440',
          900: '#081427',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FBF6E7',
          100: '#F3E6BC',
          400: '#DCBC54',
          600: '#B8912A',
          700: '#8F701F',
        },
        ink: '#1E293B',
        success: '#22C55E',
        accent: '#2563EB',
        canvas: '#F8FAFC',
        sand: '#FCFBF7',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,31,58,0.04), 0 8px 24px -8px rgba(11,31,58,0.10)',
        cardHover: '0 4px 8px rgba(11,31,58,0.06), 0 16px 32px -8px rgba(11,31,58,0.16)',
        gold: '0 8px 24px -6px rgba(212,175,55,0.45)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
