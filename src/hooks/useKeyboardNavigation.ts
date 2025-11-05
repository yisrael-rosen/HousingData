import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onSpace?: () => void;
  enabled?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const {
    onArrowLeft,
    onArrowRight,
    onArrowUp,
    onArrowDown,
    onEnter,
    onEscape,
    onSpace,
    enabled = true,
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't interfere with input elements
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        onArrowLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        onArrowRight?.();
        break;
      case 'ArrowUp':
        event.preventDefault();
        onArrowUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        onArrowDown?.();
        break;
      case 'Enter':
        event.preventDefault();
        onEnter?.();
        break;
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;
      case ' ':
        event.preventDefault();
        onSpace?.();
        break;
    }
  }, [enabled, onArrowLeft, onArrowRight, onArrowUp, onArrowDown, onEnter, onEscape, onSpace]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);
};

// Keyboard shortcuts registry
export const KEYBOARD_SHORTCUTS = {
  TOGGLE_THEME: { key: 'd', ctrlKey: true, description: 'Toggle dark mode' },
  TOGGLE_LANGUAGE: { key: 'l', ctrlKey: true, description: 'Toggle language' },
  EXPORT_PNG: { key: 'e', ctrlKey: true, shiftKey: true, description: 'Export as PNG' },
  EXPORT_CSV: { key: 'e', ctrlKey: true, description: 'Export as CSV' },
  HELP: { key: '?', description: 'Show keyboard shortcuts' },
  FOCUS_CHART: { key: '1', altKey: true, description: 'Focus chart' },
  FOCUS_SETTINGS: { key: '2', altKey: true, description: 'Focus settings' },
} as const;

export const useGlobalShortcuts = (callbacks: {
  onToggleTheme?: () => void;
  onToggleLanguage?: () => void;
  onExportPNG?: () => void;
  onExportCSV?: () => void;
  onShowHelp?: () => void;
  onFocusChart?: () => void;
  onFocusSettings?: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle theme: Ctrl+D
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        callbacks.onToggleTheme?.();
      }

      // Toggle language: Ctrl+L
      if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        callbacks.onToggleLanguage?.();
      }

      // Export PNG: Ctrl+Shift+E
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        callbacks.onExportPNG?.();
      }

      // Export CSV: Ctrl+E
      if (event.ctrlKey && !event.shiftKey && event.key === 'e') {
        event.preventDefault();
        callbacks.onExportCSV?.();
      }

      // Help: ?
      if (event.key === '?') {
        event.preventDefault();
        callbacks.onShowHelp?.();
      }

      // Focus chart: Alt+1
      if (event.altKey && event.key === '1') {
        event.preventDefault();
        callbacks.onFocusChart?.();
      }

      // Focus settings: Alt+2
      if (event.altKey && event.key === '2') {
        event.preventDefault();
        callbacks.onFocusSettings?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
};
