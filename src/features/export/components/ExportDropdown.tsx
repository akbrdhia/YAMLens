import { Download, Copy, ImageIcon, FileCode } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useExport } from '../hooks/useExport';

export function ExportDropdown() {
  const { exportImage, isExporting } = useExport();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" disabled={isExporting}>
          <Download className="size-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportImage('png')}>
          <ImageIcon className="size-4 mr-2" />
          Download PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportImage('svg')}>
          <FileCode className="size-4 mr-2" />
          Download SVG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportImage('clipboard')}>
          <Copy className="size-4 mr-2" />
          Copy to Clipboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
