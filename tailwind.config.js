const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      // synth color palette
      pink: colors.pink,
      purple: colors.purple,
      blue: colors.blue,
      indigo: colors.indigo,
      gray: colors.gray,
      white: colors.white,
      slate: colors.slate,
    },
    extend: {},
  },
  plugins: [],
};
