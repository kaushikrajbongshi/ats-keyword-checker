import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EFEDE3",
        "paper-line": "#DCD8C8",
        ink: "#1E2A2E",
        "ink-soft": "#52605F",
        stamp: "#B23B2E",
        "stamp-dark": "#8C2D22",
        highlight: "#F4C84B",
        "highlight-soft": "#FBE6A8",
        moss: "#3F6B52",
      },
      fontFamily: {
        mono: [
          "ui-monospace", "SFMono-Regular", "'IBM Plex Mono'", "'JetBrains Mono'",
          "Menlo", "Consolas", "monospace",
        ],
        sans: [
          "'Inter'", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI",
          "Roboto", "Helvetica Neue", "Arial", "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 0 rgba(30,42,46,0.06), 0 8px 24px -12px rgba(30,42,46,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
