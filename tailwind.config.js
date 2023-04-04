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
      // Configure your color palette here
      "cc-pink": "#F472B6",
      "cc-purple": "#A855F7",
      "cc-blue": "#3B82F6",
      "cc-indigo": "#4338CA",
    },
    extend: {},
  },
  plugins: [],
};
