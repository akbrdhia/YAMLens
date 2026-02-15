# Theme Toggle Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement Light/Dark mode switching using `next-themes`.

**Architecture:** `ThemeProvider` wraps the app, `ModeToggle` component changes the context.

**Tech Stack:** `next-themes`.

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install next-themes**

Run:
```bash
npm install next-themes
```

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(theme): install next-themes"
```

---

### Task 2: Implement Theme Provider

**Files:**
- Create: `src/shared/providers/theme-provider.tsx`

**Step 1: Create Provider**

Create `src/shared/providers/theme-provider.tsx`.

```typescript
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
```

Wait, `next-themes` provides its own provider. I should use that instead of a custom one if I installed it. But Shadcn documentation recommends a custom one for Vite since `next-themes` is Next.js optimized (though it works for React too). Let's stick to the Shadcn Vite recommendation (Manual Provider) to be safe and dependency-light, OR use `next-themes` properly.

Actually, `next-themes` works fine with Vite. Let's use `next-themes` for simplicity.

**Revised Step 1: Create Provider wrapping next-themes**

```typescript
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**Step 2: Commit**

```bash
git add src/shared/providers/theme-provider.tsx
git commit -m "feat(theme): create theme provider"
```

---

### Task 3: Implement Mode Toggle

**Files:**
- Create: `src/features/theme/components/ModeToggle.tsx`
- Create: `src/features/theme/index.ts`

**Step 1: Create ModeToggle**

```typescript
import { Moon, Sun } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

**Step 2: Export**

```typescript
export { ModeToggle } from './components/ModeToggle'
```

**Step 3: Commit**

```bash
git add src/features/theme/components/ModeToggle.tsx src/features/theme/index.ts
git commit -m "feat(theme): implement mode toggle component"
```

---

### Task 4: Integrate

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

**Step 1: Wrap App**

Update `src/main.tsx` to wrap `<App />` with `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`.

**Step 2: Add Toggle to Header**

Update `src/App.tsx` to add `<ModeToggle />` next to `<ExportDropdown />`.

**Step 3: Commit**

```bash
git add src/main.tsx src/App.tsx
git commit -m "feat(theme): integrate theme provider and toggle"
```
