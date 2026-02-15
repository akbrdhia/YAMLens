import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable'
import { Editor } from '@/features/editor'
import { Canvas } from '@/features/canvas'
import { ExportDropdown } from '@/features/export'
import { ModeToggle } from '@/features/theme'

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border">
        <h1 className="text-lg font-semibold tracking-tight">YAMLens</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <ExportDropdown />
        </div>
      </header>

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
    </div>
  )
}

export default App
