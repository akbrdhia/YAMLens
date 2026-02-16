import { useCallback } from 'react';
import { toast } from 'sonner';
import { compressCode } from '../utils/compression';
import { FileItem } from '@/shared/store/useCodeStore';

export const useShare = () => {
  const shareCode = useCallback((files: FileItem[]) => {
    try {
      const dataString = JSON.stringify(files);
      const compressed = compressCode(dataString);
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
