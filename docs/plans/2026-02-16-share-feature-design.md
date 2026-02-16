# Share Feature Design

## Overview
Implement a "Share" feature that allows users to share their current Docker Compose configuration via a URL. The state will be stored directly in the URL query parameters using `lz-string` compression to ensure URLs remain reasonably short.

## Architecture

### 1. State Management (URL-based)
- **Library:** `lz-string` for compression/decompression.
- **Mechanism:**
  - **Encoding:** `lz-string.compressToEncodedURIComponent(yamlCode)`
  - **Decoding:** `lz-string.decompressFromEncodedURIComponent(encodedCode)`
- **URL Structure:** `https://yamlens.app/?code=<compressed_string>`

### 2. User Interface
- **Button:** Add a "Share" button to the `Header` component (next to Export/Theme).
- **Icon:** Use `Share2` from `lucide-react`.
- **Feedback:** Use a Toast notification to inform the user that the link has been copied to the clipboard.

### 3. Data Flow
1. **User clicks Share:**
   - App reads current YAML from `useCanvasStore` or `Editor` state.
   - Compresses YAML string.
   - Constructs URL with `?code=...`.
   - Copies URL to clipboard.
   - Triggers "Link copied" toast.

2. **User opens Shared Link:**
   - `App.tsx` (or a new `useUrlState` hook) checks for `?code` param on mount.
   - If present, decompresses the string.
   - Updates the Editor/Store with the decompressed YAML.
   - Visualizer automatically renders the new graph.

## Components

### New Components/Hooks
- `src/features/share/hooks/useShare.ts`: Hook to handle compression, decompression, and clipboard actions.
- `src/features/share/components/ShareButton.tsx`: Button component for the header.

### Modified Components
- `src/shared/components/Header.tsx`: Integrate `ShareButton`.
- `src/App.tsx`: Integrate `useShare` to handle initial load from URL.

## Dependencies
- `lz-string`: For efficient string compression.
- `sonner` (or existing toast lib if any, otherwise standard `alert` or simple UI feedback): For toast notifications. *Self-correction: The project uses `shadcn` but I haven't seen a toast component installed yet. I will install `sonner` via shadcn or just a simple custom toast for now to keep it lightweight, or check if `ui/toast` exists.*

## Plan
1. Install `lz-string`.
2. Create `useShare` hook for logic.
3. Create `ShareButton` component.
4. Add `ShareButton` to Header.
5. Implement URL loading logic in `App.tsx`.
