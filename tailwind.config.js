/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7', // Light green
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#166534', // Primary green
          800: '#15803D',
          900: '#14532D', // Dark green
          950: '#052E16',
        },
        cream: {
          50: '#FEFDF8',
          100: '#FFFBEB', // Warm cream
          200: '#FEF3C7',
          300: '#FDE68A',
        },
        dark: {
          text: '#17231B', // Dark text
          secondary: '#647067', // Secondary text
          muted: '#8F9E93',
          border: '#E2E8E4',
        },
        status: {
          warning: '#F59E0B', // Warning orange
          expired: '#DC2626', // Expired red
          success: '#16A34A',
          info: '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(22, 101, 52, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'soft': '0 10px 25px -5px rgba(22, 101, 52, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 20px 35px -10px rgba(22, 101, 52, 0.12), 0 10px 15px -8px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
