import React, { useState, useCallback, useRef, useEffect } from 'react';
import EnhancedHousingChart from './components/EnhancedHousingChart';
import ErrorBoundary from './components/ErrorBoundary';
import ControlPanel from './components/ControlPanel';
import SkeletonLoader from './components/SkeletonLoader';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import { defaultConfig, defaultData } from './data/defaultData';
import { ChartConfig } from './types/ChartTypes';
import { useTheme } from './contexts/ThemeContext';
import { useGlobalShortcuts } from './hooks/useKeyboardNavigation';
import { exportToPNG, exportToCSV } from './utils/exportUtils';

const App: React.FC = () => {
  const [config, setConfig] = useState<ChartConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLButtonElement>(null);
  const { toggleTheme } = useTheme();

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSeriesClick = useCallback((seriesKey: string) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      seriesTypes: {
        ...prevConfig.seriesTypes,
        [seriesKey]: {
          ...prevConfig.seriesTypes[seriesKey],
          visible: !prevConfig.seriesTypes[seriesKey].visible
        }
      }
    }));
  }, []);

  const handleYearClick = useCallback((year: number) => {
    console.log(`Selected year: ${year}`);
  }, []);

  const handleLanguageChange = useCallback((lang: 'he' | 'en') => {
    setConfig(prevConfig => ({
      ...prevConfig,
      metadata: {
        ...prevConfig.metadata,
        language: lang,
        direction: lang === 'he' ? 'rtl' : 'ltr'
      }
    }));
  }, []);

  const handleExportPNG = useCallback(async () => {
    if (chartRef?.current) {
      await exportToPNG(chartRef.current, config.metadata.title || 'chart');
    }
  }, [config.metadata.title]);

  const handleExportCSV = useCallback(() => {
    exportToCSV(defaultData, config, config.metadata.title || 'data');
  }, [config]);

  const handleFocusChart = useCallback(() => {
    chartRef.current?.focus();
  }, []);

  const handleFocusSettings = useCallback(() => {
    settingsRef.current?.focus();
  }, []);

  // Global keyboard shortcuts
  useGlobalShortcuts({
    onToggleTheme: toggleTheme,
    onToggleLanguage: () => handleLanguageChange(config.metadata.language === 'he' ? 'en' : 'he'),
    onExportPNG: handleExportPNG,
    onExportCSV: handleExportCSV,
    onShowHelp: () => setShowKeyboardHelp(true),
    onFocusChart: handleFocusChart,
    onFocusSettings: handleFocusSettings,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 animate-fadeIn" ref={chartRef} tabIndex={-1}>
          <ControlPanel
            language={config.metadata.language || 'he'}
            onLanguageChange={handleLanguageChange}
            chartRef={chartRef}
            chartData={defaultData}
            chartConfig={config}
            settingsRef={settingsRef}
          />

          <ErrorBoundary>
            {loading ? (
              <SkeletonLoader />
            ) : (
              <EnhancedHousingChart
                configData={config}
                chartData={defaultData}
                onSeriesClick={handleSeriesClick}
                onYearClick={handleYearClick}
                loading={loading}
              />
            )}
          </ErrorBoundary>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
          {config.metadata.language === 'he' ? (
            <>מערכת ויזואליזציה לנתוני דיור • עודכן {new Date().getFullYear()} • לחץ <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">?</kbd> לקיצורי מקלדת</>
          ) : (
            <>Housing Data Visualization System • Updated {new Date().getFullYear()} • Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">?</kbd> for shortcuts</>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
        language={config.metadata.language || 'he'}
      />
    </div>
  );
};

export default App;
