import { useState, useEffect } from 'react';
import { parseDockerCompose } from '@/features/parser';
import { useCanvasStore } from '@/features/canvas';
import { cn } from '@/lib/utils';
import { DEFAULT_YAML } from '../data/default-yaml';

export function Editor() {
  const setGraph = useCanvasStore((state) => state.setGraph);
  const [code, setCode] = useState(DEFAULT_YAML);
  const [error, setError] = useState<string | null>(null);

  // Parse on code change (debounced in real app, immediate for now)
  useEffect(() => {
    if (!code.trim()) return;

    const result = parseDockerCompose(code);
    if (result.success && result.data) {
      setGraph(result.data);
      setError(null);
    } else {
      setError(result.error || 'Unknown error');
    }
  }, [code, setGraph]);

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/40">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          docker-compose.yml
        </span>
      </div>
      <div className="flex-1 relative flex flex-col">
        {error && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-xs text-destructive flex items-center gap-2 animate-in slide-in-from-top-1">
            <span className="font-bold">Error:</span>
            <span className="font-mono">{error.split('\n')[0]}</span>
          </div>
        )}
        <textarea
          className={cn(
            "w-full h-full p-4 font-mono text-sm bg-background resize-none focus:outline-none",
            "text-foreground placeholder:text-muted-foreground/50"
          )}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="version: '3'&#10;services:&#10;  web:&#10;    image: nginx&#10;    ports:&#10;      - '80:80'"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
