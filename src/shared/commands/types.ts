import type { LucideIcon } from "lucide-react";

export interface Command {
  id: string;
  title: string;
  icon: LucideIcon;
  shortcut?: string; // e.g. "mod+k"
  section: "Navigation" | "Editor" | "General" | "Services";
  action: () => void;
}

export interface CommandGroup {
  section: string;
  commands: Command[];
}
