import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cascadia-code/index.css'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/shared/providers/theme-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
