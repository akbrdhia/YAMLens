import { useCallback } from 'react';
import { toast } from 'sonner';
import { compressCode } from '../utils/compression';

export const useShare = () => {
  const shareCode = useCallback((code: string) => {
    try {
      const compressed = compressCode(code);
      const url = new URL(window.location.href);
      url.searchParams.set('code', compressed);

      const shareUrl = url.toString();

      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success('Share link copied to clipboard!');
      }).catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy share link');
      });
    } catch (error) {
      console.error('Error sharing code:', error);
      toast.error('Failed to generate share link');
    }
  }, []);

  return { shareCode };
};
