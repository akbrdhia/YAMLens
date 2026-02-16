import { useUIStore } from "@/shared/store/useUIStore";
import { useCommandRegistry } from "@/shared/commands";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/shared/components/ui/command";

export function CommandPalette() {
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const commands = useCommandRegistry();

  // Group commands by section
  const groups = commands.reduce((acc, command) => {
    if (!acc[command.section]) {
      acc[command.section] = [];
    }
    acc[command.section].push(command);
    return acc;
  }, {} as Record<string, typeof commands>);

  return (
    <CommandDialog open={isSearchOpen} onOpenChange={setSearchOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(groups).map(([section, sectionCommands]) => (
          <CommandGroup key={section} heading={section}>
            {sectionCommands.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  command.action();
                  setSearchOpen(false);
                }}
              >
                <command.icon className="mr-2 h-4 w-4" />
                <span>{command.title}</span>
                {command.shortcut && (
                  <CommandShortcut>
                    {command.shortcut.replace("mod", "⌘").replace("+", " ")}
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
