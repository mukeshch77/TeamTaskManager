/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        ink: "#0f172a",
        mist: "#eff6ff",
        coral: "#f97316",
        sky: "#0284c7",
        mint: "#10b981",
        ember: "#dc2626",
      },
      boxShadow: {
        panel: "0 18px 40px -20px rgba(15, 23, 42, 0.35)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 500ms ease forwards",
      },
    },
  },
  plugins: [],
};
