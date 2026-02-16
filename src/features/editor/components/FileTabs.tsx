import { Plus, X, FileText, Edit2, Check, Layers } from 'lucide-react';
import { useCodeStore } from '@/shared/store/useCodeStore';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { useState, useRef, useEffect } from 'react';

export function FileTabs() {
  const {
    files,
    activeFileId,
    setActiveFile,
    addFile,
    deleteFile,
    renameFile,
    isMergedView,
    setIsMergedView
  } = useCodeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleAddFile = () => {
    const name = `file-${files.length + 1}.yml`;
    addFile(name, '');
  };

  const startEditing = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMergedView(false);
    setEditingId(id);
    setEditValue(name);
  };

  const saveRename = () => {
    if (editingId && editValue.trim()) {
      renameFile(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveRename();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-muted/40 overflow-x-auto no-scrollbar flex-1">
      {files.map((file) => {
        const isActive = file.id === activeFileId && !isMergedView;
        const isEditing = editingId === file.id;

        return (
          <div
            key={file.id}
            onClick={() => !isEditing && setActiveFile(file.id)}
            className={cn(
              "group relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap border border-transparent",
              isActive
                ? "bg-background text-foreground border-border shadow-sm"
                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            )}
          >
            <FileText className={cn("w-3.5 h-3.5", isActive ? "text-primary" : "text-muted-foreground")} />

            {isEditing ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={saveRename}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none focus:ring-0 w-24 p-0 h-4 text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="max-w-[120px] truncate">{file.name}</span>
            )}

            <div className="flex items-center gap-1 ml-1">
              {!isEditing && isActive && (
                <button
                  onClick={(e) => startEditing(file.id, file.name, e)}
                  className="p-0.5 rounded-sm hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Rename file"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              )}

              {isEditing && (
                <button
                  onMouseDown={(e) => { e.preventDefault(); saveRename(); }}
                  className="p-0.5 rounded-sm hover:bg-muted"
                >
                  <Check className="w-3 h-3 text-green-500" />
                </button>
              )}

              {files.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file.id);
                  }}
                  className={cn(
                    "p-0.5 rounded-sm hover:bg-destructive/10 hover:text-destructive transition-colors",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                  title="Delete file"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        );
      })}

      <Button
        variant="ghost"
        size="icon"
        onClick={handleAddFile}
        className="h-8 w-8 ml-1 shrink-0"
        title="Add new file"
      >
        <Plus className="w-4 h-4" />
      </Button>

      <div className="h-4 w-[1px] bg-border mx-2 shrink-0" />

      <div
        onClick={() => setIsMergedView(true)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap border border-transparent shrink-0",
          isMergedView
            ? "bg-background text-foreground border-border shadow-sm"
            : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
        )}
        title="View merged configuration"
      >
        <Layers className={cn("w-3.5 h-3.5", isMergedView ? "text-primary" : "text-muted-foreground")} />
        <span>Merged View</span>
      </div>
    </div>
  );
}
