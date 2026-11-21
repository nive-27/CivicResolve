import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc5fa",
          400: "#36a5f5",
          500: "#0b89e6",
          600: "#026cc3",
          700: "#03569e",
          800: "#074981",
          900: "#0c3e6c",
          950: "#082747",
        },
        priority: {
          low: {
            bg: "#ecfdf5",
            text: "#065f46",
            border: "#a7f3d0",
          },
          medium: {
            bg: "#fefce8",
            text: "#854d0e",
            border: "#fde047",
          },
          high: {
            bg: "#fff7ed",
            text: "#9a3412",
            border: "#fdba74",
          },
          critical: {
            bg: "#fef2f2",
            text: "#991b1b",
            border: "#fca5a5",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
