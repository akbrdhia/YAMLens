import { useEffect } from "react";
import { useCanvasStore } from "@/features/canvas";
import { useEditor } from "@/features/editor";
import { useReactFlow } from "@xyflow/react";
import { useUIStore } from "@/shared/store/useUIStore";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/shared/components/ui/command";

export function CommandPalette() {
  const { isSearchOpen, setSearchOpen, toggleSearch } = useUIStore();
  const nodes = useCanvasStore((s) => s.nodes);
  const { scrollToService } = useEditor();
  const { fitView } = useReactFlow();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "f") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleSearch]);

  return (
    <CommandDialog open={isSearchOpen} onOpenChange={setSearchOpen}>
      <CommandInput placeholder="Search service..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Services">
          {nodes.map((node) => (
            <CommandItem
              key={node.id}
              onSelect={() => {
                // 1. Zoom to node
                fitView({ nodes: [{ id: node.id }], duration: 1000, padding: 0.5 });
                // 2. Scroll editor
                scrollToService(node.id);
                setSearchOpen(false);
              }}
            >
              <span>{node.data.id as string}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
