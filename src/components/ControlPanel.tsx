import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Globe, Download, Settings, FileText, Image, Filter, GitCompare } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { exportToPNG, exportToCSV } from '../utils/exportUtils';
import { ChartConfig, DataPoint } from '../types/ChartTypes';

interface ControlPanelProps {
  language: 'he' | 'en';
  onLanguageChange: (lang: 'he' | 'en') => void;
  chartRef?: React.RefObject<HTMLDivElement>;
  chartData?: DataPoint[];
  chartConfig?: ChartConfig;
  settingsRef?: React.RefObject<HTMLButtonElement>;
  onOpenFilters?: () => void;
  onOpenComparison?: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  language,
  onLanguageChange,
  chartRef,
  chartData,
  chartConfig,
  settingsRef,
  onOpenFilters,
  onOpenComparison
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExportPNG = async () => {
    if (chartRef?.current) {
      await exportToPNG(chartRef.current, chartConfig?.metadata.title || 'chart');
      setShowExportMenu(false);
    }
  };

  const handleExportCSV = () => {
    if (chartData && chartConfig) {
      exportToCSV(chartData, chartConfig, chartConfig.metadata.title || 'data');
      setShowExportMenu(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      {/* Settings Menu */}
      <div className="relative" ref={settingsMenuRef}>
        <button
          ref={settingsRef}
          onClick={() => setShowSettingsMenu(!showSettingsMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={language === 'he' ? 'תפריט הגדרות' : 'Settings menu'}
          aria-expanded={showSettingsMenu}
          aria-haspopup="true"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {language === 'he' ? 'הגדרות' : 'Settings'}
          </span>
        </button>

        {showSettingsMenu && (
          <div
            className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {language === 'he' ? 'הגדרות מערכת' : 'System Settings'}
              </h3>
            </div>

            {/* Theme Setting */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {language === 'he' ? 'מצב תצוגה' : 'Display Mode'}
                </span>
              </div>
              <button
                onClick={() => {
                  toggleTheme();
                  setShowSettingsMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                role="menuitem"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm">{language === 'he' ? 'עבור למצב כהה' : 'Switch to Dark Mode'}</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm">{language === 'he' ? 'עבור למצב בהיר' : 'Switch to Light Mode'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Language Setting */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {language === 'he' ? 'שפה' : 'Language'}
                </span>
              </div>
              <button
                onClick={() => {
                  onLanguageChange(language === 'he' ? 'en' : 'he');
                  setShowSettingsMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                role="menuitem"
              >
                <Globe className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">{language === 'he' ? 'Switch to English' : 'עבור לעברית'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Filters Button */}
        {onOpenFilters && (
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label={language === 'he' ? 'פתח סינונים' : 'Open filters'}
          >
            <Filter className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm hidden sm:inline">{language === 'he' ? 'סינונים' : 'Filters'}</span>
          </button>
        )}

        {/* Comparison Button */}
        {onOpenComparison && (
          <button
            onClick={onOpenComparison}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label={language === 'he' ? 'השוואת שנים' : 'Compare years'}
          >
            <GitCompare className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm hidden sm:inline">{language === 'he' ? 'השוואה' : 'Compare'}</span>
          </button>
        )}

        {/* Export Menu */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={language === 'he' ? 'ייצא נתונים' : 'Export data'}
            aria-expanded={showExportMenu}
            aria-haspopup="true"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm hidden sm:inline">{language === 'he' ? 'ייצוא' : 'Export'}</span>
          </button>

          {showExportMenu && (
            <div
              className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
              role="menu"
              aria-orientation="vertical"
            >
              <button
                onClick={handleExportPNG}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors text-right"
                role="menuitem"
              >
                <Image className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">{language === 'he' ? 'ייצא כתמונה (PNG)' : 'Export as PNG'}</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors text-right"
                role="menuitem"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">{language === 'he' ? 'ייצא ל-CSV' : 'Export as CSV'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
