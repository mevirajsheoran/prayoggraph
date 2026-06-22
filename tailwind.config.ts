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
        // Background palette
        "bg-primary": "#030712",
        "bg-secondary": "#0a0f1e",
        "bg-card": "#111827",
        "bg-elevated": "#1f2937",

        // Neon accents
        "neon-cyan": "#00ffff",
        "neon-purple": "#a855f7",
        "neon-green": "#22c55e",
        "neon-red": "#ef4444",
        "neon-yellow": "#eab308",

        // Text
        "text-primary": "#e5e7eb",
        "text-secondary": "#9ca3af",
        "text-muted": "#4b5563",

        // Borders
        "border-default": "rgba(0, 255, 255, 0.2)",
        "border-cyan": "rgba(0, 255, 255, 0.4)",
        "border-purple": "rgba(168, 85, 247, 0.4)",
      },
      fontFamily: {
        mono: ["Courier New", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "2xs": "0.625rem", // 10px
        "3xs": "0.5625rem", // 9px
      },
      letterSpacing: {
        widest: "0.2em",
        ultra: "0.3em",
      },
      boxShadow: {
        "neon-cyan": "0 0 12px rgba(0, 255, 255, 0.5), 0 0 24px rgba(0, 255, 255, 0.2)",
        "neon-cyan-lg": "0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)",
        "neon-purple": "0 0 12px rgba(168, 85, 247, 0.5), 0 0 24px rgba(168, 85, 247, 0.2)",
        "neon-green": "0 0 12px rgba(34, 197, 94, 0.6), 0 0 24px rgba(34, 197, 94, 0.3)",
        "neon-green-lg": "0 0 20px rgba(34, 197, 94, 0.9), 0 0 40px rgba(34, 197, 94, 0.4)",
        "neon-red": "0 0 12px rgba(239, 68, 68, 0.6), 0 0 24px rgba(239, 68, 68, 0.3)",
        "neon-red-lg": "0 0 20px rgba(239, 68, 68, 0.9), 0 0 40px rgba(239, 68, 68, 0.4)",
        "glass": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-fast": "pulse 0.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bulb-on": "bulbOn 1.5s ease-in-out infinite",
        "bulb-short": "bulbShort 0.2s ease-in-out infinite",
        "current-flow": "currentFlow 1.5s linear infinite",
        "ambient-pulse": "ambientPulse 8s ease-in-out infinite",
        "fade-in-scale": "fadeInScale 0.3s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        bulbOn: {
          "0%, 100%": {
            filter: "drop-shadow(0 0 4px rgba(34, 197, 94, 0.8)) drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))",
          },
          "50%": {
            filter: "drop-shadow(0 0 12px rgba(34, 197, 94, 1)) drop-shadow(0 0 24px rgba(34, 197, 94, 0.6)) drop-shadow(0 0 36px rgba(34, 197, 94, 0.3))",
          },
        },
        bulbShort: {
          "0%, 100%": {
            filter: "drop-shadow(0 0 4px rgba(239, 68, 68, 0.8))",
            opacity: "1",
          },
          "50%": {
            filter: "drop-shadow(0 0 16px rgba(239, 68, 68, 1)) drop-shadow(0 0 32px rgba(239, 68, 68, 0.6))",
            opacity: "0.6",
          },
        },
        currentFlow: {
          "0%": { strokeDashoffset: "20" },
          "100%": { strokeDashoffset: "0" },
        },
        ambientPulse: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.1)" },
        },
        fadeInScale: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0, 255, 255, 0.4)" },
          "50%": { boxShadow: "0 0 16px rgba(0, 255, 255, 0.8)" },
        },
      },
      backgroundImage: {
        "gradient-cyan-purple": "linear-gradient(135deg, #00ffff 0%, #a855f7 100%)",
        "gradient-radial-cyan": "radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, transparent 70%)",
        "gradient-radial-purple": "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
        "gradient-nav-line": "linear-gradient(90deg, transparent 0%, #00ffff 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
};

export default config;