import React from 'react';
import { TooltipProps } from 'recharts';
import { TrendingUp, TrendingDown, Percent, Target, Calendar, Activity } from 'lucide-react';
import { ChartConfig, DataPoint } from '../types/ChartTypes';
import { calculateChange, formatNumber, calculateTotal } from '../utils/chartUtils';

interface CustomTooltipProps extends TooltipProps<number, string> {
  config: ChartConfig;
  data: DataPoint[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label,
  config,
  data
}) => {
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!tooltipRef.current || !active) return;

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get chart container
    const chartContainer = tooltip.closest('.recharts-wrapper');
    if (!chartContainer) return;

    const chartRect = chartContainer.getBoundingClientRect();

    // Calculate available space
    const availableHeight = viewportHeight - 40; // 20px margin top and bottom
    const maxTooltipHeight = Math.min(availableHeight, 600); // Max 600px or available space

    // Set max height to prevent overflow
    tooltip.style.maxHeight = `${maxTooltipHeight}px`;

    // Default positioning - use current position
    let left = tooltipRect.left;
    let top = tooltipRect.top;

    // Adjust horizontal position if tooltip overflows
    if (left + tooltipRect.width > viewportWidth - 20) {
      // Move tooltip to the left
      left = viewportWidth - tooltipRect.width - 20;
    }

    if (left < 20) {
      // Ensure minimum left margin
      left = 20;
    }

    // Adjust vertical position if tooltip overflows
    if (top + tooltipRect.height > viewportHeight - 20) {
      // Move tooltip up
      top = Math.max(20, viewportHeight - tooltipRect.height - 20);
    }

    if (top < 20) {
      // Ensure minimum top margin
      top = 20;
    }

    // Keep tooltip within chart bounds when possible
    if (left < chartRect.left && chartRect.left + tooltipRect.width < viewportWidth - 20) {
      left = Math.max(20, chartRect.left + 10);
    }

    if (left + tooltipRect.width > chartRect.right && chartRect.right - tooltipRect.width > 20) {
      left = Math.max(20, chartRect.right - tooltipRect.width - 10);
    }

    // Apply positioning
    tooltip.style.position = 'fixed';
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.zIndex = '1000';
    tooltip.style.maxWidth = `${Math.min(360, viewportWidth - 40)}px`;
  }, [active, payload, label]);

  if (!active || !payload || !payload.length) return null;

  const { metadata, seriesTypes } = config;
  const currentData = data.find(d => d.year === label);
  const prevData = data.find(d => d.year === label - 1);
  const direction = metadata.direction || 'rtl';
  const language = metadata.language || 'he';

  if (!currentData) return null;

  const totalValue = calculateTotal(currentData, seriesTypes);

  return (
    <div
      ref={tooltipRef}
      className={`bg-white dark:bg-gray-800 p-0 border border-gray-300 dark:border-gray-600 shadow-2xl rounded-lg min-w-[260px] sm:min-w-[300px] max-w-[90vw] sm:max-w-[360px] overflow-hidden`}
      dir={direction}
      style={{
        direction,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        pointerEvents: 'none'
      }}
      role="tooltip"
      aria-live="polite"
    >
      {/* Simple Header */}
      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-300 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {language === 'he' ? 'שנה' : 'Year'}
            </span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {label}
          </span>
        </div>
      </div>

      {/* Content - Scrollable if needed */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[500px]">
      
      {payload.map((entry, index) => {
        const seriesConfig = seriesTypes[entry.dataKey as string];
        if (!seriesConfig || seriesConfig.visible === false) return null;

        const value = entry.value as number;
        const change = calculateChange(
          value, 
          prevData ? prevData[entry.dataKey as keyof DataPoint] as number : undefined
        );
        const percentOfTotal = seriesConfig.type === 'bar' ? 
          (value / totalValue) * 100 : null;

        return (
          <div
            key={index}
            className={`pb-3 ${index !== payload.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
          >
            {/* Series Name and Value - Main Info */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0 mt-1"
                  style={{ backgroundColor: seriesConfig.color }}
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <div className="font-semibold text-base text-gray-900 dark:text-gray-100">
                    {seriesConfig.name}
                  </div>
                  {seriesConfig.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {seriesConfig.description}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0 mr-1">
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {formatNumber(value, seriesConfig.tooltipConfig, language === 'he' ? 'he-IL' : 'en-US')}
                </div>
              </div>
            </div>

            {/* Secondary Info - Compact */}
            <div className="space-y-1.5 mr-5">
              {/* Change from Previous */}
              {seriesConfig.tooltipConfig.showChangeFromPrevious && change !== undefined && change !== null && (
                <div className="flex items-center gap-1.5 text-sm">
                  {change > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  ) : change < 0 ? (
                    <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  ) : (
                    <Activity className="w-3.5 h-3.5 text-gray-400" />
                  )}
                  <span className={`${
                    change > 0
                      ? 'text-green-700 dark:text-green-400'
                      : change < 0
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {change > 0 ? '+' : ''}{formatNumber(change, seriesConfig.tooltipConfig)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {language === 'he' ? 'משנה קודמת' : 'vs previous'}
                  </span>
                </div>
              )}

              {/* Percent of Total */}
              {seriesConfig.tooltipConfig.showPercentOfTotal && percentOfTotal !== null && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Percent className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {percentOfTotal.toFixed(1)}%
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {language === 'he' ? 'מהסך הכל' : 'of total'}
                  </span>
                  {/* Simple bar indicator */}
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-1">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(percentOfTotal, 100)}%`,
                        backgroundColor: seriesConfig.color
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Gap from Target */}
              {seriesConfig.tooltipConfig.showGapFromActual && seriesConfig.type === 'line' && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Target className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400 text-xs">
                    {language === 'he' ? 'פער:' : 'Gap:'}
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {formatNumber(Math.abs(totalValue - value), seriesConfig.tooltipConfig)}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default React.memo(CustomTooltip);
