import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'he' | 'en';
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const shortcuts = language === 'he' ? {
    title: 'קיצורי מקלדת',
    close: 'סגור',
    sections: [
      {
        title: 'ניווט',
        items: [
          { keys: ['Tab'], description: 'עבור בין אלמנטים' },
          { keys: ['Shift', 'Tab'], description: 'עבור אחורה' },
          { keys: ['↑', '↓', '←', '→'], description: 'ניווט בגרף' },
          { keys: ['Enter'], description: 'בחירה' },
          { keys: ['Escape'], description: 'סגירה' },
        ]
      },
      {
        title: 'פעולות',
        items: [
          { keys: ['Ctrl', 'D'], description: 'החלף מצב בהיר/כהה' },
          { keys: ['Ctrl', 'L'], description: 'החלף שפה' },
          { keys: ['Ctrl', 'E'], description: 'ייצא ל-CSV' },
          { keys: ['Ctrl', 'Shift', 'E'], description: 'ייצא כתמונה' },
          { keys: ['?'], description: 'הצג עזרה זו' },
        ]
      },
      {
        title: 'מיקוד',
        items: [
          { keys: ['Alt', '1'], description: 'מיקוד על הגרף' },
          { keys: ['Alt', '2'], description: 'מיקוד על ההגדרות' },
        ]
      }
    ]
  } : {
    title: 'Keyboard Shortcuts',
    close: 'Close',
    sections: [
      {
        title: 'Navigation',
        items: [
          { keys: ['Tab'], description: 'Move between elements' },
          { keys: ['Shift', 'Tab'], description: 'Move backwards' },
          { keys: ['↑', '↓', '←', '→'], description: 'Navigate chart' },
          { keys: ['Enter'], description: 'Select' },
          { keys: ['Escape'], description: 'Close' },
        ]
      },
      {
        title: 'Actions',
        items: [
          { keys: ['Ctrl', 'D'], description: 'Toggle dark mode' },
          { keys: ['Ctrl', 'L'], description: 'Toggle language' },
          { keys: ['Ctrl', 'E'], description: 'Export as CSV' },
          { keys: ['Ctrl', 'Shift', 'E'], description: 'Export as PNG' },
          { keys: ['?'], description: 'Show this help' },
        ]
      },
      {
        title: 'Focus',
        items: [
          { keys: ['Alt', '1'], description: 'Focus chart' },
          { keys: ['Alt', '2'], description: 'Focus settings' },
        ]
      }
    ]
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 id="shortcuts-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {shortcuts.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={shortcuts.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {shortcuts.sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.description}
                    </span>
                    <div className="flex gap-1">
                      {item.keys.map((key, keyIdx) => (
                        <kbd
                          key={keyIdx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {language === 'he'
              ? 'לחץ על Escape או לחץ מחוץ לחלון כדי לסגור'
              : 'Press Escape or click outside to close'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
