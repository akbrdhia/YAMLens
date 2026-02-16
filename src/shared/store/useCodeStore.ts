import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_YAML } from '@/features/editor/data/default-yaml';
import { parseDockerCompose } from '@/features/parser';
import { useCanvasStore } from '@/features/canvas';
import { mergeComposeFiles } from '@/features/editor/utils/merge';

export interface FileItem {
  id: string;
  name: string;
  content: string;
}

interface CodeState {
  files: FileItem[];
  activeFileId: string;
  mergedCode: string;
  error: string | null;

  // Actions
  addFile: (name?: string, content?: string) => void;
  deleteFile: (id: string) => void;
  updateFile: (id: string, content: string) => void;
  renameFile: (id: string, name: string) => void;
  setActiveFile: (id: string) => void;

  // Legacy support & calculated state trigger
  setCode: (code: string) => void; // Now updates active file
}

const initialFileId = uuidv4();
const initialFiles: FileItem[] = [
  { id: initialFileId, name: 'docker-compose.yml', content: DEFAULT_YAML }
];

const updateGraphAndMerge = (files: FileItem[]) => {
  const mergedCode = mergeComposeFiles(files.map(f => f.content));
  const result = parseDockerCompose(mergedCode);

  if (result.success && result.data) {
    useCanvasStore.getState().setGraph(result.data);
    return { mergedCode, error: null };
  } else {
    return { mergedCode, error: result.error || 'Parsing error' };
  }
};

export const useCodeStore = create<CodeState>((set, get) => {
  // Initial parse for setup
  const { error } = updateGraphAndMerge(initialFiles);

  return {
    files: initialFiles,
    activeFileId: initialFileId,
    mergedCode: DEFAULT_YAML,
    error,

    addFile: (name = 'new-file.yml', content = '') => {
      const newFile = { id: uuidv4(), name, content };
      const newFiles = [...get().files, newFile];
      const { mergedCode, error } = updateGraphAndMerge(newFiles);

      set({
        files: newFiles,
        activeFileId: newFile.id,
        mergedCode,
        error
      });
    },

    deleteFile: (id: string) => {
      const { files, activeFileId } = get();
      if (files.length <= 1) return; // Keep at least one file

      const newFiles = files.filter(f => f.id !== id);
      let newActiveId = activeFileId;

      if (activeFileId === id) {
        newActiveId = newFiles[0].id;
      }

      const { mergedCode, error } = updateGraphAndMerge(newFiles);
      set({
        files: newFiles,
        activeFileId: newActiveId,
        mergedCode,
        error
      });
    },

    updateFile: (id: string, content: string) => {
      const newFiles = get().files.map(f =>
        f.id === id ? { ...f, content } : f
      );

      const { mergedCode, error } = updateGraphAndMerge(newFiles);
      set({
        files: newFiles,
        mergedCode,
        error
      });
    },

    renameFile: (id: string, name: string) => {
      set({
        files: get().files.map(f => f.id === id ? { ...f, name } : f)
      });
    },

    setActiveFile: (id: string) => {
      set({ activeFileId: id });
    },

    // Legacy support: updates the active file
    setCode: (content: string) => {
      const { activeFileId, updateFile } = get();
      updateFile(activeFileId, content);
    },
  };
});
