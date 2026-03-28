import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          background: "#faf9f7",
          primary: "#173124",
          secondary: "#496455",
          accent: "#b0cdbb",
          muted: "#424844",
          surface: "#efeeec",
          "surface-low": "#f4f3f1",
          outline: "#727973",
          "outline-variant": "#c2c8c2",
        },
      },
      fontFamily: {
        headline: ["var(--font-noto-serif)", "Noto Serif", "Georgia", "serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        label: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 25px 45px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(120deg, rgba(249,115,22,0.15), rgba(20,184,166,0.2))",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
          xl: "2rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1152px",
          "2xl": "1152px",
        },
      },
    },
  },
  plugins: [],
};

export default config;
