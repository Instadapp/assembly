const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: 'jit',
  purge: [],
  dark: 'class',
  theme: {
    extend: {
      fontSize: {
        9: ['9px', '10px'],
        11: ['11px', '14px'],
        12: ['12px', '14px'],
        14: ['14px', '17px'],
        16: ['16px', '19.5px'],
        18: ['18px', '21px'],
        19: ['19px', '23px'],
        21: ['21px', '25.6px'],
        24: ['24px', '28.8px'],
        32: ['32px', '39.01px'],
      },
      colors: {
        primary: {
          black: "#161E2E",
          gray: "#A5ADC6",
          blue: {
            dark: "#3F75FF",
            hover: "#5E8BFF",
          }
        },
        lightest: '#FEFEFF',
        light: '#FCFCFC',
        background: 'rgb(245, 246, 250)',
        'background-light': '#FBFCFD',
        'background-dark': '#2C3D53',
        selection: '#F8F9FE',
        brand: '#11263F', // dark.600

        dark: {
          300: '#2c50a0',
          400: '#244166',
          500: '#152e4d',
          600: '#12263f',
        },

        purple: {
          pure: '#5242A2',
          light: '#EEECF6',
        },
        turquese: {
          pure: '#2EBDC2',
          light: '#EAF8F9',
        },
        green: {
          pure: '#32C34A',
          light: '#EBF9ED',
        },
        red: {
          pure: '#E63959',
          ...defaultTheme.colors.red,
        },
        blue: {
          pure: '#3997C5',
          light: '#E9F3F8',
        },
        'ocean-blue': {
          pure: '#3F75FF',
          light: '#ECF1FF',
        },
        yellow: {
          pure: '#F3C024',
          light: '#FEF8E7',
        },
        orange: {
          pure: '#F08642',
          light: '#FDF3EC',
        },
        'passion-orange': {
          pure: '#FF6600',
          light: '#FFF0E5',
        },
        'light-brown': {
          pure: '#FFC888',
          light: '#FFF9F3',
        },
        brown: {
          pure: '#CA8700',
          light: '#FAF3E5',
        },
        navi: {
          pure: '#131E40',
          'pure-light': '#2D3755',
          lighter: '#12263F',
          light: 'rgba(19, 30, 64, 0.1)',
        },
        grey: {
          pure: '#A5ADC6',
          light: '#e9ecf2',
          dark: '#556D9C',
        },
      },
      opacity: {
        10: '0.10',
        17: '0.17',
        20: '0.20',
        38: '0.38',
        70: '0.7',
        84: '0.84',
        90: '0.90',
      },
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans]
      },
      animation: {
        'spin-loading': 'spin 1s cubic-bezier(.6,0,.4,1) infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
