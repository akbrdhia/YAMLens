import { useMemo, useEffect } from "react";
import { useTheme } from "next-themes";
import { useReactFlow } from "@xyflow/react";
import {
  Search,
  SunMoon,
  Undo2,
  Redo2,
  Download,
  Server
} from "lucide-react";
import { useUIStore } from "@/shared/store/useUIStore";
import { useCanvasStore } from "@/features/canvas";
import { useEditor } from "@/features/editor";
import { useExport } from "@/features/export";
import type { Command } from "./types";

export function useCommandRegistry() {
  const { setTheme, resolvedTheme } = useTheme();
  const { toggleSearch, setSearchOpen } = useUIStore();
  const { undo, redo, scrollToService } = useEditor();
  const { exportImage } = useExport();
  const nodes = useCanvasStore((s) => s.nodes);
  const { fitView } = useReactFlow();

  const commands = useMemo(() => {
    const list: Command[] = [
      {
        id: "toggle-search",
        title: "Search Services",
        icon: Search,
        shortcut: "mod+k",
        section: "General",
        action: toggleSearch,
      },
      {
        id: "toggle-theme",
        title: "Toggle Theme",
        icon: SunMoon,
        shortcut: "mod+j",
        section: "General",
        action: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        id: "undo",
        title: "Undo",
        icon: Undo2,
        shortcut: "mod+z",
        section: "Editor",
        action: undo,
      },
      {
        id: "redo",
        title: "Redo",
        icon: Redo2,
        shortcut: "mod+y",
        section: "Editor",
        action: redo,
      },
      {
        id: "export-png",
        title: "Export as PNG",
        icon: Download,
        shortcut: "mod+e",
        section: "General",
        action: () => exportImage("png"),
      },
    ];

    // Dynamic commands for services
    nodes.forEach((node) => {
      const serviceName = node.data.id as string;
      list.push({
        id: `jump-to-${node.id}`,
        title: `Jump to ${serviceName}`,
        icon: Server,
        section: "Services",
        action: () => {
          fitView({ nodes: [{ id: node.id }], duration: 1000, padding: 0.5 });
          scrollToService(node.id);
          setSearchOpen(false);
        },
      });
    });

    return list;
  }, [
    toggleSearch,
    setTheme,
    resolvedTheme,
    undo,
    redo,
    exportImage,
    nodes,
    fitView,
    scrollToService,
    setSearchOpen,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      if (isMod && (e.key === "k" || e.key === "f")) {
        e.preventDefault();
        toggleSearch();
      }

      if (isMod && e.key === "j") {
        e.preventDefault();
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }

      if (isMod && e.key === "z") {
        e.preventDefault();
        undo();
      }

      if (isMod && e.key === "y") {
        e.preventDefault();
        redo();
      }

      if (isMod && e.key === "e") {
        e.preventDefault();
        exportImage("png");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearch, setTheme, resolvedTheme, undo, redo, exportImage]);

  return commands;
}
