/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#ffcb05", // Pokémon yellow
        "primary-focus": "#e6b800",
        "primary-content": "#000000",
        secondary: "#1a1f2e", // Dark blue
        accent: "#3c59ff", // Pokémon blue
        neutral: "#0f1420", // Very dark blue
        "base-100": "#0f1420", // Background
        "base-200": "#1a1f2e", // Slightly lighter background
        "base-300": "#252b3b", // Even lighter background
        "base-content": "#ffffff", // Text color
        info: "#3abff8",
        success: "#36d399",
        warning: "#fbbd23",
        error: "#f87272",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
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
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        pokemon: {
          primary: "#ffcb05", // Pokémon yellow
          "primary-focus": "#e6b800",
          "primary-content": "#000000",
          secondary: "#1a1f2e", // Dark blue
          accent: "#3c59ff", // Pokémon blue
          neutral: "#0f1420", // Very dark blue
          "base-100": "#0f1420", // Background
          "base-200": "#1a1f2e", // Slightly lighter background
          "base-300": "#252b3b", // Even lighter background
          "base-content": "#ffffff", // Text color
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
  },
}