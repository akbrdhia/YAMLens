import { useEffect } from 'react';
import { useCodeStore, FileItem } from '@/shared/store/useCodeStore';
import { decompressCode } from '../utils/compression';
import { toast } from 'sonner';

export const useUrlState = () => {
  const setCode = useCodeStore((state) => state.setCode);
  const setFiles = useCodeStore((state) => state.setFiles);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('code');

    if (encoded) {
      try {
        const decoded = decompressCode(encoded);
        if (decoded) {
          try {
            // Try to parse as multi-file JSON
            const parsed = JSON.parse(decoded);
            if (Array.isArray(parsed) && parsed.length > 0 && 'content' in parsed[0]) {
              setFiles(parsed as FileItem[]);
            } else {
              // Not a valid file array, treat as legacy string
              setCode(decoded);
            }
          } catch {
            // Not JSON, treat as legacy string
            setCode(decoded);
          }

          toast.info('Configuration loaded from URL');
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname);
        } else {
          toast.error('Failed to load configuration from URL');
        }
      } catch (error) {
        console.error('Error hydrating state from URL:', error);
        toast.error('Failed to load configuration from URL');
      }
    }
  }, [setCode, setFiles]);
};
