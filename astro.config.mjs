import { defineConfig, fontProviders } from "astro/config"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  site: "https://davidmcampbell.net",
  integrations: [react()],
  fonts: [{
    name: "Timeless Serif",
    cssVariable: "--font-timeless-serif",
    provider: fontProviders.local(),
    fallbacks: ["Georgia", "serif"],
    options: {
      variants: [
        { src: ["./src/fonts/TimelessSerifVF.woff2"], weight: "100 900", style: "normal" },
        { src: ["./src/fonts/TimelessSerifItalicVF.woff2"], weight: "100 900", style: "italic" },
      ],
    },
  }],
  vite: { plugins: [tailwindcss()] },
})
