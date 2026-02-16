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
      try {
        const decoded = decompressCode(encoded);
        if (decoded) {
          setCode(decoded);
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
  }, [setCode]);
};
