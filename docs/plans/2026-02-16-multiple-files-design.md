# Multiple Files & Merging Support Design

## Overview
Enable users to work with multiple Docker Compose files (e.g., `docker-compose.yml` and `docker-compose.override.yml`), simulating the real-world Docker behavior of merging configurations.

## Architecture

### 1. Data Store Refactoring (`useCodeStore`)
We will transition from a single `code` string to an array of `File` objects.

```typescript
interface ComposeFile {
  id: string; // UUID
  name: string; // "docker-compose.yml", "prod.yml"
  content: string; // YAML content
}

interface CodeState {
  files: ComposeFile[];
  activeFileId: string;
  mergedCode: string | null; // The result of merging all files
  isMergedView: boolean; // UI toggle state
  // Actions
  addFile: (name: string) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  setActiveFile: (id: string) => void;
  toggleMergedView: () => void;
}
```

### 2. Merging Logic
We need a robust merging strategy.
- **Library:** `deepmerge` is a solid, lightweight choice for object merging.
- **Strategy:**
  1. Parse all files from YAML -> JSON.
  2. Filter out invalid/empty files.
  3. Reduce array of objects using `deepmerge`.
  4. Dump merged object back to YAML for display.
  5. Send merged object to `useCanvasStore` for visualization.

### 3. Editor UI Changes
- **Tabs System:** Replace the static filename header with a dynamic tab bar.
- **Add File Button:** A small `+` button next to tabs.
- **Tab Actions:** Double-click to rename (optional v2), 'x' to close.
- **Merged View:** A special, read-only tab/toggle that shows the result. Editor is disabled in this mode.

### 4. Share Feature Updates
- **Backward Compatibility:** If the URL param decodes to a string, treat it as a single file project.
- **New Format:** `lz-string` compress the `JSON.stringify(files)`.
- **Warning:** URLs might get very long. We might hit browser limits (2KB-32KB depending on browser) quickly with multiple files.
- **Mitigation:** Since we are client-side only, we accept the risk or maybe strip comments before compressing if size is an issue. For now, standard compression.

## Implementation Steps

1.  **Dependencies:** Install `deepmerge` and `uuid`.
2.  **Store Migration:** Refactor `useCodeStore` to support `files` array. Update existing logic to handle the migration.
3.  **Merge Utility:** Implement `mergeComposeFiles` utility.
4.  **UI - Tabs:** Create `FileTabs` component.
5.  **UI - Editor:** Update `Editor.tsx` to handle `activeFileId` and `isMergedView`.
6.  **Share Logic:** Update hydration/serialization to support array format.

## Edge Cases
- **Duplicate Services:** Docker merges them (override keys). Our logic should match.
- **Deleting Active File:** Must switch to another available file.
- **Empty Project:** Should always keep at least one file.

