/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Galactic theme colors
        space: {
          50: '#f0fdfa',   // Very light cyan
          100: '#ccfbf1',  // Light cyan
          200: '#99f6e4',  // Medium light cyan
          300: '#5eead4',  // Medium cyan
          400: '#2dd4bf',  // Medium dark cyan
          500: '#14b8a6',  // Base cyan
          600: '#0d9488',  // Dark cyan
          700: '#0f766e',  // Darker cyan
          800: '#115e59',  // Very dark cyan
          900: '#134e4a',  // Darkest cyan
        },
        // NASA-inspired colors
        nasa: {
          cyan: '#50f7d1',     // Your specified RGB(80, 247, 209)
          blue: '#0066cc',     // NASA blue
          dark: '#0a0a0a',     // Deep space black
          gray: '#1a1a1a',     // Space gray
          silver: '#c0c0c0',   // Metallic silver
          gold: '#ffd700',     // Gold accent
          red: '#ff4444',      // Vibrant red for errors and warnings
        },
        // Galactic gradients
        galaxy: {
          primary: '#50f7d1',   // Main cyan
          secondary: '#0066cc', // NASA blue
          accent: '#ffd700',    // Gold
          dark: '#0a0a0a',      // Deep space
          nebula: '#4c1d95',    // Purple nebula
        }
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(80, 247, 209, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(80, 247, 209, 0.8)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow": {
          "0%, 100%": { 
            boxShadow: "0 0 5px rgba(80, 247, 209, 0.3), 0 0 10px rgba(80, 247, 209, 0.2)" 
          },
          "50%": { 
            boxShadow: "0 0 20px rgba(80, 247, 209, 0.6), 0 0 30px rgba(80, 247, 209, 0.4)" 
          },
        },
        "nebula": {
          "0%": { 
            background: "linear-gradient(45deg, #0a0a0a, #4c1d95, #0066cc, #50f7d1)",
            backgroundSize: "400% 400%"
          },
          "50%": { 
            background: "linear-gradient(45deg, #4c1d95, #0066cc, #50f7d1, #0a0a0a)",
            backgroundSize: "400% 400%"
          },
          "100%": { 
            background: "linear-gradient(45deg, #0a0a0a, #4c1d95, #0066cc, #50f7d1)",
            backgroundSize: "400% 400%"
          },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "nebula": "nebula 8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
