import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable'
import { Editor } from '@/features/editor'
import { Canvas, DetailsPanel } from '@/features/canvas'
import { Header } from '@/shared/components/Header'
import { CommandPalette } from '@/features/search'

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground">
      <Header />

      {/* Split-screen panels */}
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        <ResizablePanel defaultSize={40} minSize={25}>
          <Editor />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={30}>
          <Canvas />
        </ResizablePanel>
      </ResizablePanelGroup>

      <CommandPalette />
      <DetailsPanel />
    </div>
  )
}

export default App
