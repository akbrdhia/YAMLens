import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { ServiceNode as ServiceNodeType } from '@/features/parser/types';
import { Box, Globe, Database } from 'lucide-react'; // Example icons

// Define the Node type for React Flow
export type ServiceReactFlowNode = Node<ServiceNodeType, 'serviceNode'>;

// Helper to guess icon (Day 4 will make this better)
const getIcon = (image?: string) => {
  if (image?.includes('postgres') || image?.includes('mysql') || image?.includes('mongo')) return <Database className="size-4" />;
  if (image?.includes('nginx') || image?.includes('apache') || image?.includes('httpd')) return <Globe className="size-4" />;
  return <Box className="size-4" />;
};

export const ServiceNode = memo(({ data }: NodeProps<ServiceReactFlowNode>) => {
  return (
    <div className="relative group">
      {/* Input Handle (Top) */}
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground w-3 h-3" />

      <Card className="w-[240px] shadow-sm hover:shadow-md transition-shadow border-border/50 bg-card/95 backdrop-blur-sm">
        <CardHeader className="p-3 pb-1 flex flex-row items-center gap-2 space-y-0 border-b border-border/50">
          <div className="p-1.5 bg-primary/10 rounded-md text-primary">
            {getIcon(data.image)}
          </div>
          <CardTitle className="text-sm font-semibold truncate" title={data.id}>
            {data.id}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 text-xs text-muted-foreground space-y-1">
          {data.image && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Image:</span>
              <span className="truncate">{data.image}</span>
            </div>
          )}
          {data.ports && data.ports.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.ports.map((p) => (
                <span key={p} className="px-1.5 py-0.5 bg-accent rounded text-[10px] font-mono text-accent-foreground">
                  {p}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Output Handle (Bottom) */}
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground w-3 h-3" />
    </div>
  );
});

ServiceNode.displayName = 'ServiceNode';
