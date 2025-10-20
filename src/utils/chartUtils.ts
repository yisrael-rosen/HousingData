import { DataPoint, SeriesConfig, TooltipConfig } from "../types/ChartTypes";

// Constants for chart calculations
const DEFAULT_TICK_COUNT = 6;
const DEFAULT_YEAR_INTERVAL = 2;
const Y_AXIS_ROUNDING_FACTOR = 50000;
const DEFAULT_MAX_FRACTION_DIGITS = 1;

/**
 * Calculates the change between current and previous values
 * @param currentValue - The current value
 * @param previousValue - The previous value to compare against
 * @returns The difference between current and previous, or null if previous is undefined
 */
export const calculateChange = (
  currentValue: number,
  previousValue: number | undefined
): number | null => {
  if (typeof previousValue === 'undefined') return null;
  return currentValue - previousValue;
};

/**
 * Formats a number according to the provided configuration and locale
 * @param value - The number to format
 * @param config - Tooltip configuration containing formatting rules
 * @param locale - The locale to use for formatting (default: 'he-IL')
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  config: TooltipConfig,
  locale: string = 'he-IL'
): string => {
  if (config.customFormatter) {
    return config.customFormatter(value);
  }

  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: DEFAULT_MAX_FRACTION_DIGITS,
    notation: config.numberFormat === 'thousands' ? 'compact' : 'standard',
    compactDisplay: 'short',
    style: config.numberFormat === 'percentage' ? 'percent' : 'decimal',
  });

  return formatter.format(
    config.numberFormat === 'percentage' ? value / 100 : value
  );
};

/**
 * Calculates the total of all visible bar series in a data point
 * @param data - The data point to calculate total from
 * @param seriesTypes - Configuration for all series
 * @returns Total sum of all visible bar values
 */
export const calculateTotal = (data: DataPoint, seriesTypes: Record<string, SeriesConfig>): number => {
  return Object.keys(seriesTypes).reduce((total, key) => {
    if (seriesTypes[key].type === 'bar' && seriesTypes[key].visible !== false) {
      return total + (data[key] || 0);
    }
    return total;
  }, 0);
};

/**
 * Generates evenly spaced ticks for the Y-axis based on data range
 * @param data - Array of data points
 * @param seriesTypes - Configuration for all series
 * @param tickCount - Number of ticks to generate (default: 6)
 * @returns Array of tick values for Y-axis
 */
export const generateYAxisTicks = (
  data: DataPoint[],
  seriesTypes: Record<string, SeriesConfig>,
  tickCount: number = DEFAULT_TICK_COUNT
): number[] => {
  const maxValue = Math.max(
    ...data.map(point =>
      Object.entries(point)
        .filter(([key]) => key !== 'year' && seriesTypes[key]?.type === 'bar')
        .reduce((sum, entry) => sum + entry[1], 0)
    )
  );

  const roundedMax = Math.ceil(maxValue / Y_AXIS_ROUNDING_FACTOR) * Y_AXIS_ROUNDING_FACTOR;
  const interval = roundedMax / (tickCount - 1);
  
  return Array.from({ length: tickCount }, (_, i) => Math.round(i * interval));
};

/**
 * Determines the color class for a change indicator based on value and thresholds
 * @param value - The change value to evaluate
 * @param thresholds - Threshold values for significant and major changes
 * @param colors - Optional custom color classes (uses default Tailwind classes if not provided)
 * @returns CSS class string for the indicator color
 */
export const getChangeIndicatorColor = (
  value: number,
  thresholds: { significant: number; major: number },
  colors?: { positive: string; negative: string; neutral: string }
): string => {
  const defaultColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-400'
  };

  const finalColors = colors || defaultColors;
  const absValue = Math.abs(value);

  if (absValue >= thresholds.major) {
    return value > 0 ? finalColors.positive : finalColors.negative;
  }
  if (absValue >= thresholds.significant) {
    return value > 0 ? 
      finalColors.positive.replace('600', '400') : 
      finalColors.negative.replace('600', '400');
  }
  return finalColors.neutral;
};

/**
 * Generates evenly spaced ticks for the X-axis (years)
 * @param start - Starting year
 * @param end - Ending year
 * @param interval - Interval between ticks (default: 2)
 * @returns Array of year values for X-axis ticks
 */
export const generateXAxisTicks = (start: number, end: number, interval: number = DEFAULT_YEAR_INTERVAL): number[] => {
  const ticks: number[] = [];
  for (let year = start; year <= end; year += interval) {
    ticks.push(year);
  }
  return ticks;
};
