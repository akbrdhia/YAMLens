import { Share2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useShare } from '@/features/share/hooks/useShare';
import { useCodeStore } from '@/shared/store/useCodeStore';

export function ShareButton() {
  const { shareCode } = useShare();
  const code = useCodeStore((state) => state.code);

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => shareCode(code)}
    >
      <Share2 className="w-4 h-4" />
      <span>Share</span>
    </Button>
  );
}
