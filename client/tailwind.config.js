/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        wire: {
          50: "#f0f4ff",
          100: "#dfe8ff",
          200: "#b9d0ff",
          300: "#7babff",
          400: "#3480ff",
          500: "#0a5cf5",
          600: "#0044d4",
          700: "#0035ab",
          800: "#032e8d",
          900: "#082a74",
          950: "#0a1a47",
        },
        surface: {
          0: "#ffffff",
          50: "#f8f9fc",
          100: "#f1f3f8",
          200: "#e5e8f0",
          300: "#d1d5e0",
          400: "#9ca3b4",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#0b0f1a",
        },
        gain: "#10b981",
        loss: "#ef4444",
        "gain-bg": "#052e16",
        "loss-bg": "#450a0a",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
