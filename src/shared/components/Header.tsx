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
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="YAMLens Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold tracking-tight font-['Virgil']">YAMLens</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={isDark ? "ghost" : "secondary"}
          size="icon"
          onClick={undo}
          title="Undo"
        >
          <Undo2 className="w-5 h-5" />
          <span className="sr-only">Undo</span>
        </Button>
        <Button
          variant={isDark ? "ghost" : "secondary"}
          size="icon"
          onClick={redo}
          title="Redo"
        >
          <Redo2 className="w-5 h-5" />
          <span className="sr-only">Redo</span>
        </Button>
        <Button variant={isDark ? "ghost" : "secondary"} size="icon" asChild>
          <a href="https://github.com/akbrdhia/YAMLens" target="_blank" rel="noreferrer">
            <SiGithub className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
        <ModeToggle />
        <ShareButton />
        <ExportDropdown />
      </div>
    </header>
  )
}
