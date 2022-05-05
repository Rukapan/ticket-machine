module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fade: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
      },
      animation: {
        fade: 'fade 0.1s linear forwards'
      }
    },
  },
  daisyui: {
    themes: [
      "cyberpunk"
    ]
  },
  plugins: [
    require("daisyui"),
  ],
}
