import React from 'react';
import { TooltipProps } from 'recharts';
import { TrendingUp, TrendingDown, Percent, Target, Calendar, Activity } from 'lucide-react';
import { ChartConfig, DataPoint } from '../types/ChartTypes';
import { calculateChange, formatNumber, calculateTotal } from '../utils/chartUtils';
import ChangeIndicator from './ChangeIndicator';

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

    // Default positioning - center in viewport
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
      top = viewportHeight - tooltipRect.height - 20;
    }

    if (top < 20) {
      // Ensure minimum top margin
      top = 20;
    }

    // Keep tooltip within chart bounds when possible
    if (left < chartRect.left) {
      left = Math.max(20, chartRect.left + 10);
    }

    if (left + tooltipRect.width > chartRect.right) {
      left = Math.max(20, chartRect.right - tooltipRect.width - 10);
    }

    // Apply positioning
    tooltip.style.position = 'fixed';
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.zIndex = '1000';
    tooltip.style.maxWidth = `${Math.min(320, viewportWidth - 40)}px`;
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
      className={`bg-white/95 dark:bg-gray-900/95 p-0 border-2 border-blue-200 dark:border-blue-800 shadow-2xl rounded-2xl min-w-[240px] sm:min-w-[300px] max-w-[90vw] sm:max-w-[360px] backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
      dir={direction}
      style={{
        direction,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.1)',
        position: 'fixed',
        pointerEvents: 'none',
        animation: 'tooltipFadeIn 0.2s ease-out'
      }}
      role="tooltip"
      aria-live="polite"
    >
      {/* Header with gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 opacity-90"></div>
        <div className="relative px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium opacity-90">
                {language === 'he' ? 'שנה' : 'Year'}
              </div>
              <div className="text-2xl font-bold">
                {label}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-3">
      
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
            className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg"
            style={{
              borderLeftColor: seriesConfig.color,
              borderLeftWidth: '4px'
            }}
          >
            {/* Series Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-md animate-pulse"
                  style={{
                    backgroundColor: seriesConfig.color,
                    boxShadow: `0 0 10px ${seriesConfig.color}40`
                  }}
                  aria-hidden="true"
                />
                <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                  {seriesConfig.name}
                </span>
              </div>
              <Activity className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            </div>

            {/* Description */}
            {seriesConfig.description && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">
                {seriesConfig.description}
              </div>
            )}

            {/* Main Value */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {formatNumber(value, seriesConfig.tooltipConfig, language === 'he' ? 'he-IL' : 'en-US')}
              </span>
              {seriesConfig.showChange && change !== undefined && change !== null && seriesConfig.changeConfig && (
                <ChangeIndicator
                  value={change}
                  config={seriesConfig.changeConfig}
                />
              )}
            </div>

            {/* Change from Previous */}
            {seriesConfig.tooltipConfig.showChangeFromPrevious && change !== undefined && change !== null && (
              <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-2 ${
                change > 0
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : change < 0
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
              }`}>
                {change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : change < 0 ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <Activity className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {language === 'he' ?
                    `${change > 0 ? '+' : ''}${formatNumber(change, seriesConfig.tooltipConfig)} משנה קודמת` :
                    `${change > 0 ? '+' : ''}${formatNumber(change, seriesConfig.tooltipConfig)} from previous`
                  }
                </span>
              </div>
            )}

            {/* Percent of Total with Progress Bar */}
            {seriesConfig.tooltipConfig.showPercentOfTotal && percentOfTotal !== null && (
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Percent className="w-3 h-3" />
                    <span>{language === 'he' ? 'מתוך הסך הכל' : 'of total'}</span>
                  </div>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {percentOfTotal.toFixed(1)}%
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min(percentOfTotal, 100)}%`,
                      boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Gap from Target */}
            {seriesConfig.tooltipConfig.showGapFromActual && seriesConfig.type === 'line' && (
              <div className="flex items-center gap-2 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-3 py-2 rounded-lg">
                <Target className="w-4 h-4" />
                <span>
                  {language === 'he' ?
                    `פער: ${formatNumber(Math.abs(totalValue - value), seriesConfig.tooltipConfig)}` :
                    `Gap: ${formatNumber(Math.abs(totalValue - value), seriesConfig.tooltipConfig)}`
                  }
                </span>
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default React.memo(CustomTooltip);
