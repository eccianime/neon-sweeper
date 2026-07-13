/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        neonCyan: "#00f0ff",
        neonPink: "#ff2a6d",
        neonPurple: "#b026ff",
        neonYellow: "#f9f871",
        bgDeep: "#05010f",
      },
      fontFamily: {
        display: ["Orbitron_700Bold"],
        displayBlack: ["Orbitron_900Black"],
        mono: ["ShareTechMono_400Regular"],
      },
    },
  },
  plugins: [],
};
