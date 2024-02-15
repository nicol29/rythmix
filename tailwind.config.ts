import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'neutral': {
          750: '#3c3c3c',
          850: '#212121',
        },
        'transparent-orange':'#ff770045',
        'transparent-orange-hv':'#ff770053',
        'transparent-l-black': '#00000055',
        'transparent-d-black': '#00000081',
      }
    },
  },
  plugins: [],
}
export default config
