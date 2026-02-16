import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { useCanvasStore } from "@/features/canvas";
import { ServiceIcon } from "./ServiceIcon";
import { useEditor } from "@/features/editor";
import { HardDrive, Network, Globe, Code, Copy, Check } from "lucide-react";
import type { ServiceNode as ServiceNodeType } from "@/features/parser/types";

export const DetailsPanel = () => {
  const { nodes, detailsNodeId, setDetailsNodeId } = useCanvasStore();
  const { scrollToService } = useEditor();
  const [copiedEnv, setCopiedEnv] = useState<number | null>(null);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === detailsNodeId);
  }, [nodes, detailsNodeId]);

  const data = selectedNode?.data as ServiceNodeType | undefined;

  const isOpen = !!detailsNodeId;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDetailsNodeId(null);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedEnv(index);
    setTimeout(() => setCopiedEnv(null), 2000);
  };

  if (!data) return null;

  const hasEnv = data.environment && data.environment.length > 0;
  const hasVolumes = data.volumes && data.volumes.length > 0;
  const hasNetworks = data.networks && data.networks.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px] flex flex-col pt-6 gap-0">
        {/* Header */}
        <SheetHeader className="p-6 pb-2 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-muted rounded-lg border border-border">
                <ServiceIcon image={data.image} className="size-8 text-foreground" />
              </div>
              <div>
                <SheetTitle className="text-xl truncate">{data.id}</SheetTitle>
                <SheetDescription className="font-mono text-xs mt-1">
                  {data.image || "no image"}
                </SheetDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                scrollToService(data.id);
                setDetailsNodeId(null);
              }}
              title="Jump to Code"
            >
              <Code className="size-4 mr-2" />
              Code
            </Button>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="w-full justify-start h-auto p-1 bg-muted/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {hasEnv && <TabsTrigger value="env">Env Vars</TabsTrigger>}
                {hasVolumes && <TabsTrigger value="volumes">Volumes</TabsTrigger>}
                {hasNetworks && <TabsTrigger value="networks">Networks</TabsTrigger>}
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6 mt-0">
              {/* Ports */}
              {data.ports && data.ports.length > 0 ? (
                <section>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Globe className="size-4 text-sky-500" />
                    Exposed Ports
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {data.ports.map((port) => (
                      <div key={port} className="flex items-center justify-between p-2 bg-muted/50 rounded border text-sm font-mono">
                        <span>{port}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="text-sm text-muted-foreground italic">No exposed ports</div>
              )}
            </TabsContent>

            {/* Environment Tab */}
            <TabsContent value="env" className="p-0 mt-0">
              <div className="divide-y divide-border">
                {data.environment?.map((env, idx) => {
                  const [key, ...rest] = env.split("=");
                  const value = rest.join("=");
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group">
                      <div className="min-w-0 flex-1 mr-4">
                        <div className="text-xs font-medium text-muted-foreground mb-0.5">{key}</div>
                        <div className="text-sm font-mono truncate text-foreground" title={value}>
                          {value || "unset"}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(value, idx)}
                      >
                        {copiedEnv === idx ? (
                          <Check className="size-3.5 text-green-500" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Volumes Tab */}
            <TabsContent value="volumes" className="p-6 mt-0 space-y-2">
              {data.volumes?.map((volume, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded border border-border/50">
                  <HardDrive className="size-4 text-emerald-500 shrink-0" />
                  <span className="text-sm font-mono break-all">{volume}</span>
                </div>
              ))}
            </TabsContent>

            {/* Networks Tab */}
            <TabsContent value="networks" className="p-6 mt-0 space-y-2">
              {data.networks?.map((network, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded border border-border/50">
                  <Network className="size-4 text-indigo-500 shrink-0" />
                  <span className="text-sm font-medium">{network}</span>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
