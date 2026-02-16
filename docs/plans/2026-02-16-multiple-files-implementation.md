# Multiple Files Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Enable support for multiple Docker Compose files with intelligent merging logic.

**Architecture:**
- Store: `useCodeStore` manages an array of files + active index.
- Logic: `deepmerge` for combining JSON objects parsed from YAML.
- UI: Tabbed interface in Editor.

**Tech Stack:** React, Zustand, deepmerge, uuid.

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install deepmerge and uuid**

```bash
npm install deepmerge uuid
npm install -D @types/uuid
```

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install deepmerge and uuid"
```

---

### Task 2: Implement Merge Logic

**Files:**
- Create: `src/features/editor/utils/merge.ts`
- Test: `src/features/editor/utils/merge.test.ts` (Manual test via console if no runner)

**Step 1: Create merge utility**

```typescript
// src/features/editor/utils/merge.ts
import deepmerge from 'deepmerge';
import jsYaml from 'js-yaml';

export const mergeComposeFiles = (filesContent: string[]): string => {
  try {
    const objects = filesContent
      .map(content => {
        try {
          return jsYaml.load(content);
        } catch {
          return null;
        }
      })
      .filter(obj => obj !== null && typeof obj === 'object');

    if (objects.length === 0) return '';

    const merged = deepmerge.all(objects);
    return jsYaml.dump(merged, { indent: 2, lineWidth: -1 });
  } catch (error) {
    console.error('Merge error:', error);
    return '# Error merging files';
  }
};
```

**Step 2: Commit**

```bash
git add src/features/editor/utils
git commit -m "feat: implement yaml merging utility"
```

---

### Task 3: Refactor Store for Multiple Files

**Files:**
- Modify: `src/shared/store/useCodeStore.ts`

**Step 1: Update Store Interface**

Refactor `useCodeStore` to handle `files: { id: string, name: string, content: string }[]`.
- Add `addFile`, `deleteFile`, `updateFile`, `setActiveFile`.
- `setCode` becomes `updateFile(activeFileId, content)`.
- Trigger merge logic whenever any file changes.

**Step 2: Commit**

```bash
git add src/shared/store/useCodeStore.ts
git commit -m "feat: refactor store to support multiple files"
```

---

### Task 4: Implement Editor Tabs UI

**Files:**
- Create: `src/features/editor/components/FileTabs.tsx`
- Modify: `src/features/editor/components/Editor.tsx`

**Step 1: Create Tabs Component**

Implement horizontal scrollable tabs with:
- Active state styling.
- Close button (x) for non-primary files.
- "+" button to add new file.

**Step 2: Integrate into Editor**

Replace the static header "docker-compose.yml" in `Editor.tsx` with `<FileTabs />`.
Connect `CodeMirror` to `activeFile.content`.

**Step 3: Commit**

```bash
git add src/features/editor/components
git commit -m "feat: implement editor tabs ui"
```

---

### Task 5: Update Share Logic

**Files:**
- Modify: `src/features/share/hooks/useShare.ts`
- Modify: `src/features/share/hooks/useUrlState.ts`

**Step 1: Update Serialization**

Change `compressCode` to handle `JSON.stringify(files)`.

**Step 2: Update Hydration**

Detect if decompressed string is a JSON array or legacy string.
- If Array: Load as multi-file.
- If String: Load as single file (legacy support).

**Step 3: Commit**

```bash
git add src/features/share
git commit -m "feat: update share logic for multiple files"
```
