import { create } from 'zustand';
import { DEFAULT_YAML } from '@/features/editor/data/default-yaml';

interface CodeState {
  code: string;
  setCode: (code: string) => void;
}

export const useCodeStore = create<CodeState>((set) => ({
  code: DEFAULT_YAML,
  setCode: (code: string) => set({ code }),
}));
