import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class", // 👈 REQUIRED
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
      },
      screens: {
        xs: '500px',
      },
    }
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}

export default config
