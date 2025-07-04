/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Background tiers
        'bg-primary':  '#ffffff',  // Grayscale 0
        'bg-secondary':'#f2f4f8',  // Grayscale 100-ish
        'bg-tertiary': '#e0e4e8',  // Grayscale 200-ish

        // Single accent color
        red:           '#c0392b',

        // Grayscale palette
        gray: {
          0:    '#ffffff',
          100:  '#f2f4f8',
          200:  '#e0e4e8',
          300:  '#c6cfd4',
          400:  '#98a1a9',
          500:  '#6b7280',
          600:  '#4d5563',
          700:  '#374151',
          800:  '#1f2937',
          900:  '#0f1724',
          1000: '#000000',
        },
        // Semantic grayscale keys
        sub: {
          300: '#c6cfd4',
          400: '#98a1a9',
          500: '#6b7280',
          600: '#4d5563',
        },
        main: {
          700: '#374151',
          800: '#1f2937',
        },
        accent: {
          900:  '#0f1724',
          1000: '#000000',
        },

        // Green palette
        green: {
          0:    '#ffffff',
          100:  '#e8f6e8',
          200:  '#cdf2ce',
          300:  '#abe3aa',
          400:  '#86d375',
          500:  '#5ac845',
          600:  '#479f37',
          700:  '#316a22',
          800:  '#1c420f',
          900:  '#0b2306',
          1000: '#000000',
        },
        'green-accent': '#5ac845',
      },
    },
  },
  plugins: [],
};