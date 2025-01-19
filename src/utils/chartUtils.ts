import { DataPoint, SeriesConfig, TooltipConfig } from "../types/ChartTypes";

export const calculateChange = (
  currentValue: number,
  previousValue: number | undefined
): number | null => {
  if (typeof previousValue === 'undefined') return null;
  return currentValue - previousValue;
};

export const formatNumber = (
  value: number,
  config: TooltipConfig,
  locale: string = 'he-IL'
): string => {
  if (config.customFormatter) {
    return config.customFormatter(value);
  }

  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    notation: config.numberFormat === 'thousands' ? 'compact' : 'standard',
    compactDisplay: 'short',
    style: config.numberFormat === 'percentage' ? 'percent' : 'decimal',
  });

  return formatter.format(
    config.numberFormat === 'percentage' ? value / 100 : value
  );
};

export const calculateTotal = (data: DataPoint, seriesTypes: Record<string, SeriesConfig>): number => {
  return Object.keys(seriesTypes).reduce((total, key) => {
    if (seriesTypes[key].type === 'bar' && seriesTypes[key].visible !== false) {
      return total + (data[key] || 0);
    }
    return total;
  }, 0);
};

export const generateYAxisTicks = (
  data: DataPoint[],
  seriesTypes: Record<string, SeriesConfig>,
  tickCount: number = 6
): number[] => {
  const maxValue = Math.max(
    ...data.map(point => 
      Object.entries(point)
        .filter(([key]) => key !== 'year' && seriesTypes[key]?.type === 'bar')
        .reduce((sum, [key, value]) => sum + value, 0)
    )
  );

  const roundedMax = Math.ceil(maxValue / 50000) * 50000;
  const interval = roundedMax / (tickCount - 1);
  
  return Array.from({ length: tickCount }, (_, i) => Math.round(i * interval));
};

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

export const generateXAxisTicks = (start: number, end: number, interval: number = 2): number[] => {
  const ticks: number[] = [];
  for (let year = start; year <= end; year += interval) {
    ticks.push(year);
  }
  return ticks;
};
