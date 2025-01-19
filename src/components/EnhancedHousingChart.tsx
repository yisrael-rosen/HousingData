import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MouseEvent } from 'react';

import { ChartProps } from '../types/ChartTypes';
import { generateXAxisTicks, generateYAxisTicks } from '../utils/chartUtils';
import CustomTooltip from './CustomTooltip';
import { defaultConfig, defaultData } from '../data/defaultData';

const EnhancedHousingChart: React.FC<ChartProps> = ({
  configData = defaultConfig,
  chartData = defaultData,
  className = '',
  onSeriesClick,
  onYearClick,
  loading = false,
}) => {
  const { metadata, seriesTypes, appearance } = configData;
  const direction = metadata.direction || 'rtl';
  const language = metadata.language || 'he';

  // Sort series by stack order
  const sortedSeries = useMemo(() => {
    return Object.entries(seriesTypes)
      .filter(([, config]) => config.visible !== false)
      .sort(([, a], [, b]) => (a.stackOrder ?? Infinity) - (b.stackOrder ?? Infinity));
  }, [seriesTypes]);

  // Generate axis ticks
  const xAxisTicks = useMemo(() => 
    generateXAxisTicks(metadata.yearRange.start, metadata.yearRange.end),
    [metadata.yearRange]
  );

  const yAxisTicks = useMemo(() => 
    generateYAxisTicks(chartData, seriesTypes),
    [chartData, seriesTypes]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSeriesClick = (entry: any) => {
    if (onSeriesClick && entry?.dataKey) {
      onSeriesClick(String(entry.dataKey));
    }
  };

  const handleYearClick = (event: MouseEvent<Element>) => {
    const target = event.target as SVGElement;
    const value = target.getAttribute('data-value');
    if (onYearClick && value) {
      onYearClick(Number(value));
    }
  };

  return (
    <div 
      dir={direction}
      className={`w-full p-6 ${className} ${loading ? 'opacity-50' : ''}`}
    >
      <h2 className="text-2xl font-bold text-center mb-8">{metadata.title}</h2>
      
      <div style={{ height: appearance?.height ? `${appearance.height * 0.25}rem` : '24rem' }}>
        <ResponsiveContainer>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 30, bottom: 10 }}
          >
            {appearance?.gridLines !== false && (
              <CartesianGrid strokeDasharray="3 3" />
            )}
            
            <XAxis
              dataKey="year"
              type="number"
              domain={[metadata.yearRange.start, metadata.yearRange.end]}
              ticks={xAxisTicks}
              onClick={handleYearClick}
              tickFormatter={(value) => value.toString()}
            />
            
            <YAxis
              domain={[0, Math.max(...yAxisTicks)]}
              ticks={yAxisTicks}
              tickFormatter={(value) => new Intl.NumberFormat(
                language === 'he' ? 'he-IL' : 'en-US', 
                { notation: 'compact', maximumFractionDigits: 0 }
              ).format(value)}
            />
            
            <Tooltip
              content={
                <CustomTooltip 
                  config={configData}
                  data={chartData}
                />
              }
            />
            
            <Legend
              verticalAlign="bottom"
              height={60}
              onClick={handleSeriesClick}
              formatter={(value) => seriesTypes[value as string]?.name || value}
              wrapperStyle={{
                paddingTop: '20px',
                borderTop: '1px solid #eee'
              }}
              iconSize={12}
              iconType="circle"
            />
            
            {sortedSeries.map(([key, config]) => 
              config.type === 'bar' ? (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={config.color}
                  stackId={config.stack || undefined}
                  name={key}
                  barSize={appearance?.barSize || 20}
                  opacity={config.opacity}
                  isAnimationActive={appearance?.animation !== false}
                  cursor="pointer"
                  className="transition-opacity duration-200 hover:opacity-80"
                />
              ) : (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={config.color}
                  strokeWidth={2}
                  dot={{ fill: config.color }}
                  name={key}
                  strokeDasharray={config.dashArray}
                  opacity={config.opacity}
                  isAnimationActive={appearance?.animation !== false}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  className="transition-opacity duration-200 hover:opacity-80"
                />
              )
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {metadata.footnote && (
        <div className="text-sm text-gray-600 text-center mt-4">
          {metadata.footnote}
        </div>
      )}
    </div>
  );
};

export default EnhancedHousingChart;
