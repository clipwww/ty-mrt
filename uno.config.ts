import presetIcons from '@unocss/preset-icons'
import presetWind from '@unocss/preset-wind'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    presetWind(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
  ],
})
