import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import {
  ComposedChart,
  BarChart,
  LineChart as RechartsLineChart,
  AreaChart as RechartsAreaChart,
  PieChart as RechartsPieChart,
  Line,
  Bar,
  Area,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MouseEvent } from 'react';
import { Payload } from 'recharts/types/component/DefaultLegendContent';

import { ChartProps } from '../types/ChartTypes';
import { generateXAxisTicks, generateYAxisTicks } from '../utils/chartUtils';
import CustomTooltip from './CustomTooltip';
import ZoomControls from './ZoomControls';
import ChartTypeSwitcher, { ChartType } from './ChartTypeSwitcher';
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

  // Chart type state
  const [chartType, setChartType] = useState<ChartType>('composed');

  // Zoom and Pan state
  const [xDomain, setXDomain] = useState<[number, number]>([
    metadata.yearRange.start,
    metadata.yearRange.end,
  ]);
  const [yDomain, setYDomain] = useState<[number, number] | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Reset domains when data changes
  useEffect(() => {
    setXDomain([metadata.yearRange.start, metadata.yearRange.end]);
    setYDomain(null);
  }, [metadata.yearRange, chartData]);

  // Sort series by stack order
  const sortedSeries = useMemo(() => {
    return Object.entries(seriesTypes)
      .filter(([, config]) => config.visible !== false)
      .sort(([, a], [, b]) => (a.stackOrder ?? Infinity) - (b.stackOrder ?? Infinity));
  }, [seriesTypes]);

  // Generate axis ticks based on current zoom
  const xAxisTicks = useMemo(() =>
    generateXAxisTicks(xDomain[0], xDomain[1]),
    [xDomain]
  );

  const yAxisTicks = useMemo(() =>
    generateYAxisTicks(chartData, seriesTypes),
    [chartData, seriesTypes]
  );

  // Calculate if currently zoomed
  const isZoomed = useMemo(() => {
    return (
      xDomain[0] !== metadata.yearRange.start ||
      xDomain[1] !== metadata.yearRange.end ||
      yDomain !== null
    );
  }, [xDomain, yDomain, metadata.yearRange]);

  const handleSeriesClick = (entry: Payload) => {
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

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    const range = xDomain[1] - xDomain[0];
    const center = (xDomain[0] + xDomain[1]) / 2;
    const newRange = range * 0.7; // 30% zoom in
    setXDomain([
      Math.max(metadata.yearRange.start, center - newRange / 2),
      Math.min(metadata.yearRange.end, center + newRange / 2),
    ]);
  }, [xDomain, metadata.yearRange]);

  const handleZoomOut = useCallback(() => {
    const range = xDomain[1] - xDomain[0];
    const center = (xDomain[0] + xDomain[1]) / 2;
    const newRange = range * 1.3; // 30% zoom out
    setXDomain([
      Math.max(metadata.yearRange.start, center - newRange / 2),
      Math.min(metadata.yearRange.end, center + newRange / 2),
    ]);
  }, [xDomain, metadata.yearRange]);

  const handleReset = useCallback(() => {
    setXDomain([metadata.yearRange.start, metadata.yearRange.end]);
    setYDomain(null);
  }, [metadata.yearRange]);

  const handleFitToScreen = useCallback(() => {
    // Filter data within current x range
    const visibleData = chartData.filter(
      (d) => d.year >= xDomain[0] && d.year <= xDomain[1]
    );

    // Calculate min/max values for visible series
    const values: number[] = [];
    visibleData.forEach((point) => {
      sortedSeries.forEach(([key]) => {
        const value = point[key];
        if (typeof value === 'number') {
          values.push(value);
        }
      });
    });

    if (values.length > 0) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const padding = (max - min) * 0.1;
      setYDomain([Math.max(0, min - padding), max + padding]);
    }
  }, [chartData, xDomain, sortedSeries]);

  // Wheel zoom handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    },
    [handleZoomIn, handleZoomOut]
  );

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && e.shiftKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning && panStart && chartContainerRef.current) {
        const deltaX = e.clientX - panStart.x;
        const containerWidth = chartContainerRef.current.offsetWidth;
        const xRange = xDomain[1] - xDomain[0];
        const xShift = (-deltaX / containerWidth) * xRange;

        const newXMin = xDomain[0] + xShift;
        const newXMax = xDomain[1] + xShift;

        // Keep within bounds
        if (newXMin >= metadata.yearRange.start && newXMax <= metadata.yearRange.end) {
          setXDomain([newXMin, newXMax]);
          setPanStart({ x: e.clientX, y: e.clientY });
        }
      }
    },
    [isPanning, panStart, xDomain, metadata.yearRange]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setPanStart(null);
  }, []);

  // Add wheel event listener
  useEffect(() => {
    const container = chartContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Prepare data for pie chart
  const pieData = useMemo(() => {
    if (chartType !== 'pie') return [];

    // Get the latest year or middle year data
    const middleIndex = Math.floor(chartData.length / 2);
    const dataPoint = chartData[middleIndex];

    return sortedSeries.map(([key, config]) => ({
      name: config.name,
      value: dataPoint[key] as number || 0,
      color: config.color,
    }));
  }, [chartType, chartData, sortedSeries]);

  // Render the appropriate chart type
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 30, bottom: 10 },
    };

    const commonAxisProps = (
      <>
        <XAxis
          dataKey="year"
          type="number"
          domain={xDomain}
          ticks={xAxisTicks}
          onClick={handleYearClick}
          tickFormatter={(value) => value.toString()}
          allowDataOverflow
        />
        <YAxis
          domain={yDomain || [0, Math.max(...yAxisTicks)]}
          ticks={yAxisTicks}
          tickFormatter={(value) => new Intl.NumberFormat(
            language === 'he' ? 'he-IL' : 'en-US',
            { notation: 'compact', maximumFractionDigits: 0 }
          ).format(value)}
          allowDataOverflow
        />
      </>
    );

    const commonElements = (
      <>
        {appearance?.gridLines !== false && (
          <CartesianGrid strokeDasharray="3 3" />
        )}
        {commonAxisProps}
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
      </>
    );

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {commonElements}
            {sortedSeries.map(([key, config]) => (
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
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <RechartsLineChart {...commonProps}>
            {commonElements}
            {sortedSeries.map(([key, config]) => (
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
            ))}
          </RechartsLineChart>
        );

      case 'area':
        return (
          <RechartsAreaChart {...commonProps}>
            {commonElements}
            {sortedSeries.map(([key, config]) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={config.color}
                fill={config.color}
                fillOpacity={0.6}
                name={key}
                opacity={config.opacity}
                isAnimationActive={appearance?.animation !== false}
                className="transition-opacity duration-200 hover:opacity-80"
              />
            ))}
          </RechartsAreaChart>
        );

      case 'pie':
        return (
          <RechartsPieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={appearance?.animation !== false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
              formatter={(value) => value}
            />
          </RechartsPieChart>
        );

      case 'composed':
      default:
        return (
          <ComposedChart {...commonProps}>
            {commonElements}
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
        );
    }
  };

  return (
    <div
      dir={direction}
      className={`w-full p-4 sm:p-6 ${className} ${loading ? 'opacity-50' : ''} transition-all duration-300`}
      role="region"
      aria-label={metadata.title}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors" id="chart-title">{metadata.title}</h2>

        <div className="flex flex-wrap items-center gap-3">
          <ChartTypeSwitcher
            currentType={chartType}
            onTypeChange={setChartType}
            language={language}
          />

          {chartType !== 'pie' && (
            <ZoomControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onReset={handleReset}
              onFitToScreen={handleFitToScreen}
              language={language}
              isZoomed={isZoomed}
            />
          )}
        </div>
      </div>

      <div
        ref={chartContainerRef}
        className={`w-full ${isPanning ? 'cursor-grabbing' : 'cursor-default'}`}
        style={{ height: appearance?.height ? `${appearance.height * 0.25}rem` : 'clamp(20rem, 60vh, 30rem)' }}
        role="img"
        aria-labelledby="chart-title"
        aria-describedby={metadata.footnote ? "chart-footnote" : undefined}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {metadata.footnote && (
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mt-4 transition-colors" id="chart-footnote">
          {metadata.footnote}
        </div>
      )}
    </div>
  );
};

export default React.memo(EnhancedHousingChart);
