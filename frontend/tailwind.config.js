/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  theme: {
    extend: {
      boxShadow: {
        'outline': '0 0 0 3px rgba(66, 153, 225, 0.5)', // Culoarea albastră implicită
      },
    },
  },
  plugins: [],
}

