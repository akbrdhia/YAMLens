import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/features/theme"
import { ExportDropdown } from "@/features/export"
import { ShareButton } from "@/features/share/components/ShareButton"
import { Button } from "@/shared/components/ui/button"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { Undo2, Redo2 } from "lucide-react"
import { useEditor } from "@/features/editor"

export const Header = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const { undo, redo } = useEditor()

  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-3 border-b border-border transition-colors z-50 relative",
        isDark ? "bg-background/80 backdrop-blur-md text-foreground" : "bg-primary/95 backdrop-blur-md text-primary-foreground border-transparent"
      )}
    >
      <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="/logo.svg" alt="YAMLens Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold tracking-tight font-['Virgil']">YAMLens</h1>
      </a>
      <div className="flex items-center gap-3">
        {/* Editor Actions Group */}
        <div className="flex items-center bg-muted/30 p-0.5 rounded-lg border border-border/40">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-all"
            onClick={undo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
            <span className="sr-only">Undo</span>
          </Button>
          <div className="w-[1px] h-4 bg-border mx-0.5" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-all"
            onClick={redo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
            <span className="sr-only">Redo</span>
          </Button>
        </div>

        <div className="w-[1px] h-6 bg-border mx-1 hidden sm:block" />

        <div className="flex items-center gap-2">
          <ModeToggle />

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-border/60 hover:bg-accent hover:text-accent-foreground"
            asChild
            title="View on GitHub"
          >
            <a href="https://github.com/akbrdhia/YAMLens" target="_blank" rel="noreferrer">
              <SiGithub className="w-4 h-4 text-foreground" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>

          <ExportDropdown />
          <ShareButton />
        </div>
      </div>
    </header>
  )
}
