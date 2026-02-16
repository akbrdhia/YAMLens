import { useState } from 'react';
import { toPng, toSvg } from 'html-to-image';
import download from 'downloadjs';
import { toast } from 'sonner';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);

  const getElement = () => document.getElementById('react-flow-canvas');

  const exportImage = async (format: 'png' | 'svg' | 'clipboard') => {
    const element = getElement();
    if (!element) return;

    setIsExporting(true);
    try {
      await document.fonts.ready; // Wait for fonts to load

      const computedStyle = window.getComputedStyle(document.body);
      const bgColor = computedStyle.backgroundColor || '#1a1a1a';

      const options = {
        backgroundColor: bgColor,
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        fontEmbedCSS: '', // Skip font embedding to prevent "font is undefined" error
        filter: (node: HTMLElement) => {
          return !node.classList?.contains('react-flow__controls') && !node.classList?.contains('react-flow__minimap');
        }
      };

      if (format === 'clipboard') {
        const blob = await toPng(element, { ...options, pixelRatio: 2 });
        const data = await fetch(blob).then(res => res.blob());
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': data })
        ]);
        toast.success("Image copied to clipboard");
      } else if (format === 'svg') {
        const dataUrl = await toSvg(element, options);
        download(dataUrl, 'compose-viz.svg');
        toast.success("SVG exported successfully");
      } else {
        const dataUrl = await toPng(element, options);
        download(dataUrl, 'compose-viz.png');
        toast.success("PNG exported successfully");
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportImage, isExporting };
}
