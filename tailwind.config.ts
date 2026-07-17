import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glass: "var(--glass-shadow)",
        "glass-sm": "0 4px 16px rgba(0, 0, 0, 0.06)",
        glow: "0 0 40px var(--glow-color)",
        "glow-sm": "0 0 20px var(--glow-color)",
        "glow-lg": "0 0 60px var(--glow-color)",
        "card-hover": "0 20px 40px rgba(0, 0, 0, 0.08)",
        "premium": "0 8px 32px -8px rgba(0, 0, 0, 0.12), 0 0 0 1px var(--glow-color)",
        "premium-lg": "0 16px 48px -12px rgba(0, 0, 0, 0.16), 0 0 0 1px var(--glow-color)",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-hero": "var(--gradient-hero)",
        "gradient-accent": "var(--gradient-accent)",
      },
      keyframes: {
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px var(--glow-color)" },
          "50%": { boxShadow: "0 0 40px var(--glow-color)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
        },
        "border-glow": {
          "0%, 100%": { boxShadow: "0 0 0 1px var(--glow-color)" },
          "50%": { boxShadow: "0 0 0 2px var(--glow-color), 0 0 20px var(--glow-color)" },
        },
        "mobile-menu-slide": {
          "0%": { opacity: "0", transform: "translateX(-100%) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        "mobile-menu-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "stagger-fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 var(--glow-color)" },
          "50%": { boxShadow: "0 0 20px 4px var(--glow-color)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-up": {
          "0%": { opacity: "0", transform: "scale(0.9) translateY(20px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "progress-fill": "progress-fill 1s ease-out forwards",
        "border-glow": "border-glow 3s ease-in-out infinite",
        "mobile-menu-slide": "mobile-menu-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "mobile-menu-fade": "mobile-menu-fade 0.3s ease-out forwards",
        "stagger-fade-in": "stagger-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-up": "scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
