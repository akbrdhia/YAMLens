import React, { createContext, useContext, useCallback, useRef } from 'react';

interface EditorActions {
  undo: () => void;
  redo: () => void;
  scrollToService: (name: string) => void;
}

interface EditorContextType {
  undo: () => void;
  redo: () => void;
  scrollToService: (name: string) => void;
  registerActions: (actions: EditorActions) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const actionsRef = useRef<EditorActions | null>(null);

  const registerActions = useCallback((actions: EditorActions) => {
    actionsRef.current = actions;
  }, []);

  const undo = useCallback(() => {
    if (actionsRef.current) {
      actionsRef.current.undo();
    }
  }, []);

  const redo = useCallback(() => {
    if (actionsRef.current) {
      actionsRef.current.redo();
    }
  }, []);

  const scrollToService = useCallback((name: string) => {
    if (actionsRef.current) {
      actionsRef.current.scrollToService(name);
    }
  }, []);

  return (
    <EditorContext.Provider value={{ undo, redo, scrollToService, registerActions }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
