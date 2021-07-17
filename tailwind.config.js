const defaultTheme = require("tailwindcss/defaultTheme");


module.exports = {
  mode: 'jit',
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          black: "#161E2E",
          gray: "#A5ADC6",
          blue: {
            dark: "#3F75FF",
            hover: "#5E8BFF",
          }
        }
      },
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans]
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
