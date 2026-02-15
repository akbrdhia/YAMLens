import { useState } from 'react';
import { toPng, toSvg } from 'html-to-image';
import download from 'downloadjs';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);

  const getElement = () => document.getElementById('react-flow-canvas');

  const exportImage = async (format: 'png' | 'svg' | 'clipboard') => {
    const element = getElement();
    if (!element) return;

    setIsExporting(true);
    try {
      const options = {
        backgroundColor: '#1a1a1a', // Match theme background
        quality: 1,
        pixelRatio: 2, // Better quality
        filter: (node: HTMLElement) => {
          // Exclude controls/minimap from screenshot if needed
          // For now, keep them or exclude based on class
          return !node.classList?.contains('react-flow__controls') && !node.classList?.contains('react-flow__minimap');
        }
      };

      if (format === 'clipboard') {
        const blob = await toPng(element, { ...options, pixelRatio: 2 });
        // Convert dataUrl to Blob for ClipboardItem
        const data = await fetch(blob).then(res => res.blob());
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': data })
        ]);
        // Toast success (optional)
      } else if (format === 'svg') {
        const dataUrl = await toSvg(element, options);
        download(dataUrl, 'compose-viz.svg');
      } else {
        const dataUrl = await toPng(element, options);
        download(dataUrl, 'compose-viz.png');
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportImage, isExporting };
}
