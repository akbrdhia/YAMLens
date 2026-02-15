import { useState, useEffect } from 'react';
import { parseDockerCompose } from '@/features/parser';
import { useCanvasStore } from '@/features/canvas';
import { DEFAULT_YAML } from '../data/default-yaml';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { yaml } from '@codemirror/lang-yaml';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubLight } from '@uiw/codemirror-theme-github';
import { useTheme } from 'next-themes';
import { useEditor } from '@/features/editor';
import { undo, redo } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { useUIStore } from '@/shared/store/useUIStore';
import { Search, Sparkles } from 'lucide-react';
import jsYaml from 'js-yaml';

export function Editor() {
  const setGraph = useCanvasStore((state) => state.setGraph);
  const setSearchOpen = useUIStore((state) => state.setSearchOpen);
  const [code, setCode] = useState(DEFAULT_YAML);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const { registerActions } = useEditor();

  const handleFormat = () => {
    try {
      const obj = jsYaml.load(code);
      const formatted = jsYaml.dump(obj, { indent: 2, lineWidth: -1 });
      setCode(formatted);
    } catch (e) {
      // Ignore format errors if code is invalid
    }
  };

  const handleSearch = () => {
    setSearchOpen(true);
  };

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
        <div className="flex items-center gap-1">
          <button
            onClick={handleFormat}
            className="p-1.5 hover:bg-background/80 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Format YAML"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={handleSearch}
            className="p-1.5 hover:bg-background/80 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Search (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
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
            extensions={[
              yaml(),
              keymap.of([
                {
                  key: "Mod-f",
                  run: () => {
                    setSearchOpen(true);
                    return true;
                  },
                },
              ]),
            ]}
            onChange={(value) => setCode(value)}
            theme={resolvedTheme === 'dark' ? vscodeDark : githubLight}
            className="h-full text-sm font-mono"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: true,
              history: true,
              searchKeymap: false,
            }}
            onCreateEditor={(v) => {
              registerActions({
                undo: () => undo(v),
                redo: () => redo(v),
                scrollToService: (name) => {
                  // We can't use the outer scrollToService directly because 'view' might be stale in closure?
                  // Actually, 'v' here IS the view. So we should define logic here or use ref.
                  // But since I defined scrollToService using 'view' state, it might be null initially.
                  // Better to implement logic inline or use a ref for view.

                  const doc = v.state.doc;
                  const text = doc.toString();
                  const regex = new RegExp(`^\\s*${name}:`, 'm');
                  const match = text.match(regex);

                  if (match && match.index !== undefined) {
                    const pos = match.index;
                    v.dispatch({
                      selection: { anchor: pos },
                      effects: EditorView.scrollIntoView(pos, { y: 'center' }),
                    });
                    v.focus();
                  }
                },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
