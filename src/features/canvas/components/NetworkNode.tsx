import { memo } from "react";
import { type Node, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

type NetworkNodeData = {
  label: string;
};

type NetworkNodeProps = NodeProps<Node<NetworkNodeData, "networkNode">>;

export const NetworkNode = memo(({ data, selected }: NetworkNodeProps) => {
  return (
    <div
      className={cn(
        "w-full h-full rounded-xl border-2 border-dashed transition-all duration-300",
        "bg-muted/5 backdrop-blur-[2px]",
        selected
          ? "border-primary/50 bg-primary/5 ring-4 ring-primary/10"
          : "border-muted-foreground/20 hover:border-muted-foreground/40",
      )}
    >
      {/* Network Label */}
      <div className="absolute -top-7 left-2 flex items-center gap-2 px-2 py-1 bg-background/80 backdrop-blur-sm border border-border/50 rounded-t-lg shadow-sm">
        <div className="size-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Network: <span className="text-foreground">{data.label}</span>
        </span>
      </div>
    </div>
  );
});

NetworkNode.displayName = "NetworkNode";
