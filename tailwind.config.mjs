/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        "insta-start": "#F56040",
        "insta-end": "#E1306C",
        primary: {
          50: "#a7b0c2",
          100: "#919db3",
          200: "#7b89a3",
          300: "#657594",
          400: "#394e75",
          500: "#233a66",
          600: "#20345c",
          700: "#1c2e52",
          800: "#192947",
          900: "#15233d",
          950: "#0e1729",
        },
        darkBlue: "#233A66",
        darkBlue2: "#1E3353",
      },
      screens: {
        "2xl": "1320px",
      },
    },
  },
  plugins: [],
};


