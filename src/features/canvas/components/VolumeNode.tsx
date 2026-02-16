import { memo, useMemo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Database, HardDrive, Info } from "lucide-react";
import { useCanvasStore } from "@/features/canvas";
import { cn } from "@/lib/utils";
import type { VolumeNode as VolumeNodeType } from "@/features/parser/types";

type VolumeNodeProps = NodeProps<Node<VolumeNodeType, "volumeNode">>;

export const VolumeNode = memo(({ data }: VolumeNodeProps) => {
  const hoveredNode = useCanvasStore((s) => s.hoveredNode);
  const edges = useCanvasStore((s) => s.edges);
  const setHoveredNode = useCanvasStore((s) => s.setHoveredNode);
  const setDetailsNodeId = useCanvasStore((s) => s.setDetailsNodeId);

  const isDimmed = useMemo(() => {
    if (!hoveredNode || hoveredNode === data.id) return false;
    const isConnected = edges.some(
      (e) =>
        (e.source === hoveredNode && e.target === data.id) ||
        (e.target === hoveredNode && e.source === data.id),
    );
    return !isConnected;
  }, [hoveredNode, data.id, edges]);

  const Icon = data.type === 'bind' ? HardDrive : Database;

  return (
    <div
      className={cn(
        "relative group transition-all duration-300",
        isDimmed && "opacity-50 grayscale scale-95",
      )}
      onClick={(e) => {
        e.stopPropagation();
        setHoveredNode(data.id);
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-muted-foreground w-3 h-3"
      />

      <Card
        className={cn(
          "w-[200px] shadow-sm hover:shadow-md transition-all border-emerald-500/30 bg-card/95 backdrop-blur-sm",
          hoveredNode === data.id &&
            "ring-2 ring-emerald-500 shadow-2xl scale-110 z-50 bg-card",
        )}
      >
        <CardHeader className="p-3 flex flex-row items-center gap-2 space-y-0 bg-emerald-500/10">
          <div className="p-1.5 bg-background border border-emerald-500/20 rounded-md text-emerald-600">
            <Icon className="size-5" />
          </div>
          <CardTitle
            className="text-sm font-semibold truncate flex-1"
            title={data.id}
          >
            {data.id}
          </CardTitle>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDetailsNodeId(data.id);
            }}
            className="p-1 hover:bg-emerald-500/20 rounded-full text-muted-foreground hover:text-emerald-600 transition-colors"
            title="View Details"
          >
            <Info className="size-4" />
          </button>
        </CardHeader>
      </Card>
    </div>
  );
});

VolumeNode.displayName = "VolumeNode";
