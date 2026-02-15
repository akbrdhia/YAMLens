import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactFlowProvider } from '@xyflow/react'
import '@fontsource/cascadia-code/index.css'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/shared/providers/theme-provider'
import { EditorProvider } from '@/features/editor'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <EditorProvider>
        <ReactFlowProvider>
          <App />
        </ReactFlowProvider>
      </EditorProvider>
    </ThemeProvider>
  </StrictMode>,
)
