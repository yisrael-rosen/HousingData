import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFitToScreen: () => void;
  language: 'he' | 'en';
  isZoomed: boolean;
}

const ZoomControls: React.FC<ZoomControlsProps> = React.memo(({
  onZoomIn,
  onZoomOut,
  onReset,
  onFitToScreen,
  language,
  isZoomed,
}) => {
  const text = language === 'he' ? {
    zoomIn: 'הגדל',
    zoomOut: 'הקטן',
    fitToScreen: 'התאם למסך',
    reset: 'אפס תצוגה',
  } : {
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    fitToScreen: 'Fit to Screen',
    reset: 'Reset View',
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={text.zoomIn}
        aria-label={text.zoomIn}
      >
        <ZoomIn className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>

      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={text.zoomOut}
        aria-label={text.zoomOut}
      >
        <ZoomOut className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

      <button
        onClick={onFitToScreen}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={text.fitToScreen}
        aria-label={text.fitToScreen}
      >
        <Maximize2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>

      {isZoomed && (
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600 dark:text-blue-400"
          title={text.reset}
          aria-label={text.reset}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

ZoomControls.displayName = 'ZoomControls';

export default ZoomControls;
