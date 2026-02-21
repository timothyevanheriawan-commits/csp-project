/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/admin/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E8F5EE",
          100: "#B8E1CE",
          200: "#88CDAE",
          300: "#58B98E",
          400: "#43A273",
          500: "#2E8B57",
          600: "#267148",
          700: "#1E5739",
          800: "#163D2A",
          900: "#0E231B",
        },
        secondary: {
          50: "#F5FDFB",
          100: "#E6F9F3",
          200: "#D7F5EB",
          300: "#C3EDE0",
          400: "#9ED5C5",
          500: "#7FC4B0",
          600: "#60B39B",
          700: "#4A8F7B",
          800: "#366B5B",
          900: "#22473B",
        },
        accent: {
          50: "#FFF9EB",
          100: "#FFEFC7",
          200: "#FFE5A3",
          300: "#FFD67F",
          400: "#FFC145",
          500: "#FFB01A",
          600: "#E69A00",
          700: "#B37800",
          800: "#805600",
          900: "#4D3400",
        },
        background: "#F6FFF9",
        text: {
          DEFAULT: "#1F1F1F",
          light: "#4A4A4A",
          lighter: "#6B6B6B",
        },
      },
      fontFamily: {
        // Menghubungkan variabel CSS dari layout.tsx ke class Tailwind
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(46, 139, 87, 0.08)",
        medium: "0 4px 12px rgba(46, 139, 87, 0.12)",
        strong: "0 8px 24px rgba(46, 139, 87, 0.16)",
      },
    },
  },
  plugins: [],
};
