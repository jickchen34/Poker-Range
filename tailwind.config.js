/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "mac-bg": "#1C1C1E",
        "mac-panel": "rgba(28, 28, 30, 0.95)",
        "mac-hover": "rgba(255, 255, 255, 0.1)",
        "mac-border": "rgba(255, 255, 255, 0.2)",
        "mac-blue": "#0A84FF",
      },
      backdropBlur: {
        mac: "20px",
      },
    },
  },
  plugins: [],
};
