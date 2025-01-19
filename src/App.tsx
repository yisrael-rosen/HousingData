import React, { useState } from 'react';
import EnhancedHousingChart from './components/EnhancedHousingChart';
import { defaultConfig, defaultData } from './data/defaultData';
import { ChartConfig } from './types/ChartTypes';

const App: React.FC = () => {
  const [config, setConfig] = useState<ChartConfig>(defaultConfig);

  const handleSeriesClick = (seriesKey: string) => {
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
  };

  const handleYearClick = (year: number) => {
    console.log(`Selected year: ${year}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
        <EnhancedHousingChart
          configData={config}
          chartData={defaultData}
          onSeriesClick={handleSeriesClick}
          onYearClick={handleYearClick}
        />
      </div>
      
      <div className="mt-8 max-w-7xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">Features:</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Interactive legend - click series to toggle visibility</li>
          <li>Responsive design with automatic resizing</li>
          <li>RTL support for Hebrew text</li>
          <li>Stacked bar chart with line overlay</li>
          <li>Custom tooltips with detailed information</li>
          <li>Change indicators showing trends</li>
          <li>Configurable appearance and behavior</li>
          <li>TypeScript support with full type safety</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
