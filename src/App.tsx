import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import EnhancedHousingChart from './components/EnhancedHousingChart';
import ErrorBoundary from './components/ErrorBoundary';
import ControlPanel from './components/ControlPanel';
import SkeletonLoader from './components/SkeletonLoader';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import AdvancedFilters from './components/AdvancedFilters';
import { defaultConfig, defaultData } from './data/defaultData';
import { ChartConfig } from './types/ChartTypes';
import { useTheme } from './contexts/ThemeContext';
import { useGlobalShortcuts } from './hooks/useKeyboardNavigation';
import { exportToPNG, exportToCSV } from './utils/exportUtils';

interface FilterConfig {
  yearRange: { min: number; max: number };
  valueFilters: { [key: string]: { min?: number; max?: number; enabled: boolean } };
  changeFilter: { enabled: boolean; minChange?: number; series?: string };
}

const App: React.FC = () => {
  const [config, setConfig] = useState<ChartConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({
    yearRange: {
      min: Math.min(...defaultData.map(d => d.year)),
      max: Math.max(...defaultData.map(d => d.year)),
    },
    valueFilters: {},
    changeFilter: { enabled: false },
  });
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

  // Filter data based on active filters
  const filteredData = useMemo(() => {
    return defaultData.filter(dataPoint => {
      // Year range filter
      if (dataPoint.year < filters.yearRange.min || dataPoint.year > filters.yearRange.max) {
        return false;
      }

      // Value filters
      for (const [seriesKey, filter] of Object.entries(filters.valueFilters)) {
        if (filter.enabled) {
          const value = dataPoint[seriesKey];
          if (typeof value === 'number') {
            if (filter.min !== undefined && value < filter.min) return false;
            if (filter.max !== undefined && value > filter.max) return false;
          }
        }
      }

      return true;
    });
  }, [filters]);

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
    exportToCSV(filteredData, config, config.metadata.title || 'data');
  }, [config, filteredData]);

  const handleApplyFilters = useCallback((newFilters: FilterConfig) => {
    setFilters(newFilters);
  }, []);

  const availableSeries = useMemo(() => {
    return Object.entries(config.seriesTypes)
      .filter(([, seriesConfig]) => seriesConfig.visible !== false)
      .map(([key, seriesConfig]) => ({
        key,
        name: seriesConfig.name,
      }));
  }, [config.seriesTypes]);

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
            chartData={filteredData}
            chartConfig={config}
            settingsRef={settingsRef}
            onOpenFilters={() => setShowFilters(true)}
          />

          <ErrorBoundary>
            {loading ? (
              <SkeletonLoader />
            ) : (
              <EnhancedHousingChart
                configData={config}
                chartData={filteredData}
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

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        language={config.metadata.language || 'he'}
        data={defaultData}
        availableSeries={availableSeries}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default App;
