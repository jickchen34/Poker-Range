/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "mac-bg": "#0F0F10",
        "mac-panel": "rgba(15, 15, 16, 0.98)",
        "mac-hover": "rgba(255, 255, 255, 0.15)",
        "mac-border": "rgba(255, 255, 255, 0.35)",
        "mac-blue": "#0A84FF",
      },
      backdropBlur: {
        mac: "20px",
      },
    },
  },
  plugins: [],
};
