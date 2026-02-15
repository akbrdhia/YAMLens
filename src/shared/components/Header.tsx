import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/features/theme"
import { ExportDropdown } from "@/features/export"

export const Header = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-3 border-b border-border transition-colors",
        isDark ? "bg-background text-foreground" : "bg-primary text-primary-foreground"
      )}
    >
      <object data="logo.svg" className="w-12 h-12" type="image/svg+xml"></object>
      <h1 className="text-lg font-semibold tracking-tight">YAMLens</h1>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <ExportDropdown />
      </div>
    </header>
  )
}
