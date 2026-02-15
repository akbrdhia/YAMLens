import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ServiceNode as ServiceNodeType } from '@/features/parser/types';
import { getServiceIcon } from '@/features/parser'; // Import new matcher
import { cn } from '@/lib/utils';
import { HardDrive, Settings, Box } from 'lucide-react'; // Icons for details

export const ServiceNode = memo(({ data }: NodeProps<ServiceNodeType>) => {
  const Icon = getServiceIcon(data.image);

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground w-3 h-3" />

      <Card className="w-[240px] shadow-sm hover:shadow-md transition-shadow border-border/50 bg-card/95 backdrop-blur-sm">
        {/* Header */}
        <CardHeader className="p-3 pb-2 flex flex-row items-center gap-2 space-y-0 border-b border-border/50 bg-muted/20">
          <div className="p-1.5 bg-background border border-border rounded-md text-foreground">
            <Icon className="size-5" />
          </div>
          <CardTitle className="text-sm font-semibold truncate flex-1" title={data.id}>
            {data.id}
          </CardTitle>
        </CardHeader>

        {/* Body */}
        <CardContent className="p-3 text-xs text-muted-foreground space-y-2">
          {/* Image Name */}
          {data.image && (
            <div className="flex items-center gap-2" title={data.image}>
              <Box className="size-3 shrink-0" />
              <span className="truncate font-mono opacity-80">{data.image.split(':')[0]}</span>
              {data.image.includes(':') && (
                 <span className="px-1 py-0.5 bg-muted rounded text-[10px] text-muted-foreground">
                   {data.image.split(':')[1]}
                 </span>
              )}
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {/* Ports */}
            {data.ports && data.ports.length > 0 && (
               <div className="col-span-2 flex flex-wrap gap-1">
                 {data.ports.slice(0, 3).map((p) => (
                   <span key={p} className="px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-mono">
                     {p}
                   </span>
                 ))}
                 {data.ports.length > 3 && (
                   <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] text-muted-foreground">
                     +{data.ports.length - 3}
                   </span>
                 )}
               </div>
            )}

            {/* Volumes */}
            {data.volumes && data.volumes.length > 0 && (
              <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded">
                <HardDrive className="size-3 text-sky-500" />
                <span className="font-medium">{data.volumes.length}</span>
                <span className="text-[10px] opacity-70">vols</span>
              </div>
            )}

            {/* Env Vars */}
            {data.environment && data.environment.length > 0 && (
              <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded">
                <Settings className="size-3 text-orange-500" />
                <span className="font-medium">{data.environment.length}</span>
                <span className="text-[10px] opacity-70">env</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground w-3 h-3" />
    </div>
  );
});

ServiceNode.displayName = 'ServiceNode';
