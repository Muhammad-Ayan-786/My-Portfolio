import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'

// Self-hosted fonts (no Google Fonts round-trip)
import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource-variable/manrope'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './index.css'

import { ThemeProvider } from './context/Theme'
import { SmoothScrollProvider } from './context/SmoothScroll'
import { AppProvider } from './context/App'
import { router } from './router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <SmoothScrollProvider>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </SmoothScrollProvider>
    </ThemeProvider>
  </StrictMode>,
)
