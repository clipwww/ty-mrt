import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

// @ts-expect-error vuetify/styles is CSS-only, no type declarations
import 'vuetify/styles'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#7B1FA2',
          secondary: '#4A148C',
          surface: '#FFFFFF',
          background: '#FFFFFF',
        },
      },
    },
  },
})
