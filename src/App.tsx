import React, { useState, useCallback } from 'react';
import EnhancedHousingChart from './components/EnhancedHousingChart';
import ErrorBoundary from './components/ErrorBoundary';
import { defaultConfig, defaultData } from './data/defaultData';
import { ChartConfig } from './types/ChartTypes';

const App: React.FC = () => {
  const [config, setConfig] = useState<ChartConfig>(defaultConfig);

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
        <ErrorBoundary>
          <EnhancedHousingChart
            configData={config}
            chartData={defaultData}
            onSeriesClick={handleSeriesClick}
            onYearClick={handleYearClick}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
