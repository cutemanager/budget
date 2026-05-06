import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#fffaf1",
        ink: "#1f1a17",
        accent: "#d97706",
        mint: "#3f8f83",
        rose: "#d25a51",
        sand: "#f4ead8",
        clay: "#8f5f43"
      },
      boxShadow: {
        soft: "0 20px 45px rgba(31, 26, 23, 0.08)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
};

export default config;
