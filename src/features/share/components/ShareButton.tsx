import { Share2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useShare } from '@/features/share/hooks/useShare';
import { useCodeStore } from '@/shared/store/useCodeStore';

export const ShareButton = () => {
  const { shareCode } = useShare();
  const code = useCodeStore((state) => state.code);

  return (
    <Button
      variant="default"
      size="sm"
      className="gap-2 shadow-sm font-medium bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/50"
      onClick={() => shareCode(code)}
      title="Share Configuration"
    >
      <Share2 className="h-4 w-4" />
      <span>Share</span>
    </Button>
  );
};
