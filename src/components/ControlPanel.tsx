import React, { useState } from 'react';
import { Moon, Sun, Globe, Download, Settings, FileText, Image } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { exportToPNG, exportToCSV } from '../utils/exportUtils';
import { ChartConfig, DataPoint } from '../types/ChartTypes';

interface ControlPanelProps {
  language: 'he' | 'en';
  onLanguageChange: (lang: 'he' | 'en') => void;
  chartRef?: React.RefObject<HTMLDivElement>;
  chartData?: DataPoint[];
  chartConfig?: ChartConfig;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  language,
  onLanguageChange,
  chartRef,
  chartData,
  chartConfig
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showExportMenu, setShowExportMenu] = useState(false);

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
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {language === 'he' ? 'הגדרות' : 'Settings'}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={theme === 'light' ? (language === 'he' ? 'עבור למצב כהה' : 'Switch to dark mode') : (language === 'he' ? 'עבור למצב בהיר' : 'Switch to light mode')}
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm hidden sm:inline">{language === 'he' ? 'מצב כהה' : 'Dark'}</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm hidden sm:inline">{language === 'he' ? 'מצב בהיר' : 'Light'}</span>
            </>
          )}
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => onLanguageChange(language === 'he' ? 'en' : 'he')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={language === 'he' ? 'Switch to English' : 'עבור לעברית'}
        >
          <Globe className="w-4 h-4" aria-hidden="true" />
          <span className="text-sm hidden sm:inline">{language === 'he' ? 'English' : 'עברית'}</span>
        </button>

        {/* Export Menu */}
        <div className="relative">
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
