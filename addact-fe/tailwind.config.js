/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "16px",
      screens: {
        sm: "720px",
        md: "960px",
        lg: "1152px",
        xl: "1248px",
        "2xl": "1600px",
      },
    },

    colors: {
      grayCustom: "#2e2e2e",
    },
    extend: {
      screens: {
        "max-1900": { max: "1900px" },
        "max-1800": { max: "1800px" },
        "max-1700": { max: "1700px" },
        "max-1600": { max: "1600px" },
        "max-1500": { max: "1500px" },
        "max-1400": { max: "1400px" },
        "max-1300": { max: "1300px" },
        "max-1200": { max: "1200px" },
        "max-1100": { max: "1100px" },
        "max-1000": { max: "1000px" },
        "max-900": { max: "900px" },
        "max-800": { max: "800px" },
        "max-767": { max: "767px" },
        "max-700": { max: "700px" },
        "max-600": { max: "600px" },
        "max-500": { max: "500px" },
        "max-400": { max: "400px" },
      },
      colors: {
        border: {
          grayCustom: "#2e2e2e",
        },
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)"],
      },
      animation: {
        marquee: "scroll-marquee 20s linear infinite",
        fadeWord: "fadeWord 1.3s ease forwards",
        fadeIn: "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        "scroll-marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeWord: {
          from: { opacity: "0.5" },
          to: { opacity: "1" },
        },
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwind-scrollbar")],
};
