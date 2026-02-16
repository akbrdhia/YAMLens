import { create } from 'zustand';
import { DEFAULT_YAML } from '@/features/editor/data/default-yaml';
import { parseDockerCompose } from '@/features/parser';
import { useCanvasStore } from '@/features/canvas';

interface CodeState {
  code: string;
  error: string | null;
  setCode: (code: string) => void;
}

export const useCodeStore = create<CodeState>((set) => {
  // Initial parse
  const initialResult = parseDockerCompose(DEFAULT_YAML);
  if (initialResult.success && initialResult.data) {
    useCanvasStore.getState().setGraph(initialResult.data);
  }

  return {
    code: DEFAULT_YAML,
    error: null,
    setCode: (code: string) => {
      set({ code });
      if (!code.trim()) return;

      const result = parseDockerCompose(code);
      if (result.success && result.data) {
        useCanvasStore.getState().setGraph(result.data);
        set({ error: null });
      } else {
        set({ error: result.error || 'Unknown error' });
      }
    },
  };
});
