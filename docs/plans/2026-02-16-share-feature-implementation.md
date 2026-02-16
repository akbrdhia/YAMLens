# Share Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Implement URL-based sharing of Docker Compose configurations using lz-string compression.

**Architecture:**
- State is serialized to a compressed string in the URL query parameter `?code=...`.
- `useShare` hook handles compression (write) and decompression (read).
- `ShareButton` component triggers the share action.
- On app load, the URL is checked and state is hydrated if a code parameter exists.

**Tech Stack:** React, lz-string, sonner (for toasts), clipboard API.

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install lz-string and sonner**

```bash
npm install lz-string sonner
npm install -D @types/lz-string
```

**Step 2: Add Toaster to App**

**Files:**
- Modify: `src/App.tsx`

```tsx
// Add import
import { Toaster } from 'sonner';

// Add <Toaster /> inside the return, preferably at the end
// ...
      <DetailsPanel />
      <Toaster />
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add package.json package-lock.json src/App.tsx
git commit -m "chore: install lz-string and sonner"
```

---

### Task 2: Implement useShare Hook

**Files:**
- Create: `src/features/share/hooks/useShare.ts`
- Create: `src/features/share/utils/compression.ts`

**Step 1: Create compression utility**

```typescript
// src/features/share/utils/compression.ts
import LZString from 'lz-string';

export const compressCode = (code: string): string => {
  return LZString.compressToEncodedURIComponent(code);
};

export const decompressCode = (compressed: string): string | null => {
  return LZString.decompressFromEncodedURIComponent(compressed);
};
```

**Step 2: Create useShare hook**

```typescript
// src/features/share/hooks/useShare.ts
import { useCallback } from 'react';
import { toast } from 'sonner';
import { compressCode } from '../utils/compression';

export const useShare = () => {
  const shareCode = useCallback(async (code: string) => {
    try {
      const compressed = compressCode(code);
      const url = new URL(window.location.href);
      url.searchParams.set('code', compressed);

      await navigator.clipboard.writeText(url.toString());
      toast.success('Link copied to clipboard');

      // Optional: update URL without reloading to reflect current state
      window.history.pushState({}, '', url);
    } catch (error) {
      console.error('Failed to share:', error);
      toast.error('Failed to copy link');
    }
  }, []);

  return { shareCode };
};
```

**Step 3: Commit**

```bash
git add src/features/share
git commit -m "feat: implement compression utils and useShare hook"
```

---

### Task 3: Implement Share Button

**Files:**
- Create: `src/features/share/components/ShareButton.tsx`
- Modify: `src/shared/components/Header.tsx`

**Step 1: Create ShareButton component**

```tsx
// src/features/share/components/ShareButton.tsx
import { Share2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useShare } from '../hooks/useShare';
import { useCanvasStore } from '@/features/canvas';
// NOTE: We need the code. Editor state might be local or in store.
// Checking Editor.tsx, it uses local state `code` but syncs to canvas store via `setGraph`.
// We should probably expose the raw code in the store or accept it as a prop.
// For now, let's assume we need to access the code.
// Actually, looking at Editor.tsx again, it doesn't seem to store the raw string in a global store accessible by Header.
// Strategy: The Editor should probably hoist the code state or we create a store for it.
// ALTERNATIVE: Use the existing useCanvasStore graph data? No, we want to preserve comments/formatting.
// REVISION: We need a way to get the code.
// Let's create a useCodeStore or similar if needed.
// Wait, Editor.tsx has `const [code, setCode] = useState(DEFAULT_YAML);`
// It's local state.
// We need to move this state to a store to make it accessible for sharing from the Header.
```

**Refined Step 1: Create Code Store (Prerequisite)**

**Files:**
- Create: `src/shared/store/useCodeStore.ts`
- Modify: `src/features/editor/components/Editor.tsx`

```typescript
// src/shared/store/useCodeStore.ts
import { create } from 'zustand';
import { DEFAULT_YAML } from '@/features/editor/data/default-yaml';

interface CodeState {
  code: string;
  setCode: (code: string) => void;
}

export const useCodeStore = create<CodeState>((set) => ({
  code: DEFAULT_YAML,
  setCode: (code) => set({ code }),
}));
```

**Step 2: Update Editor to use store**

Modify `src/features/editor/components/Editor.tsx` to use `useCodeStore` instead of local state.

**Step 3: Create ShareButton**

```tsx
// src/features/share/components/ShareButton.tsx
import { Share2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useShare } from '../hooks/useShare';
import { useCodeStore } from '@/shared/store/useCodeStore';

export const ShareButton = () => {
  const { shareCode } = useShare();
  const code = useCodeStore((state) => state.code);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => shareCode(code)}
      title="Share Configuration"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
};
```

**Step 4: Add to Header**

Modify `src/shared/components/Header.tsx` to include `<ShareButton />`.

**Step 5: Commit**

```bash
git add src/shared/store/useCodeStore.ts src/features/editor/components/Editor.tsx src/features/share/components/ShareButton.tsx src/shared/components/Header.tsx
git commit -m "feat: add share button and global code store"
```

---

### Task 4: Implement URL Hydration

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/features/share/hooks/useUrlState.ts`

**Step 1: Create hydration hook**

```typescript
// src/features/share/hooks/useUrlState.ts
import { useEffect } from 'react';
import { useCodeStore } from '@/shared/store/useCodeStore';
import { decompressCode } from '../utils/compression';
import { toast } from 'sonner';

export const useUrlState = () => {
  const setCode = useCodeStore((state) => state.setCode);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('code');

    if (encoded) {
      const decoded = decompressCode(encoded);
      if (decoded) {
        setCode(decoded);
        toast.info('Configuration loaded from URL');
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        toast.error('Failed to load configuration from URL');
      }
    }
  }, [setCode]);
};
```

**Step 2: Use hook in App**

Modify `src/App.tsx` to call `useUrlState()`.

**Step 3: Commit**

```bash
git add src/features/share/hooks/useUrlState.ts src/App.tsx
git commit -m "feat: implement URL state hydration"
```
