const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{html,tsx}'],
  theme: {
    colors: {
      ...colors,
      main: colors.gray,
      secondary: colors.amber,
    },
    extend: {
    },
  },
  plugins: [],
};
