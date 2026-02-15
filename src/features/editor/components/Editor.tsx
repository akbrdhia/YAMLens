import { useState, useEffect } from 'react';
import { parseDockerCompose } from '@/features/parser';
import { useCanvasStore } from '@/features/canvas';
import { DEFAULT_YAML } from '../data/default-yaml';
import CodeMirror from '@uiw/react-codemirror';
import { yaml } from '@codemirror/lang-yaml';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubLight } from '@uiw/codemirror-theme-github';
import { useTheme } from 'next-themes';

export function Editor() {
  const setGraph = useCanvasStore((state) => state.setGraph);
  const [code, setCode] = useState(DEFAULT_YAML);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

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
      <div className="flex-1 relative flex flex-col overflow-hidden">
        {error && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-xs text-destructive flex items-center gap-2 animate-in slide-in-from-top-1 z-10">
            <span className="font-bold">Error:</span>
            <span className="font-mono">{error.split('\n')[0]}</span>
          </div>
        )}
        <div className="flex-1 overflow-auto">
          <CodeMirror
            value={code}
            height="100%"
            extensions={[yaml()]}
            onChange={(value) => setCode(value)}
            theme={resolvedTheme === 'dark' ? vscodeDark : githubLight}
            className="h-full text-sm font-mono"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: true,
              history: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
