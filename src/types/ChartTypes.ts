export type ChangeThresholds = {
  significant: number;
  major: number;
};

export type TooltipConfig = {
  numberFormat: 'thousands' | 'percentage' | 'decimal';
  showPercentOfTotal?: boolean;
  showChangeFromPrevious?: boolean;
  showGapFromActual?: boolean;
  customFormatter?: (value: number) => string;
};

export type ChangeConfig = {
  type: 'arrow' | 'dot' | 'badge';
  thresholds: ChangeThresholds;
  colors?: {
    positive: string;
    negative: string;
    neutral: string;
  };
};

export type SeriesConfig = {
  name: string;
  description: string;
  type: 'bar' | 'line';
  color: string;
  stackOrder: number | null;
  stack: string | null;
  showChange: boolean;
  changeConfig?: ChangeConfig;
  tooltipConfig: TooltipConfig;
  visible?: boolean;
  dashArray?: string;
  opacity?: number;
};

export type ChartMetadata = {
  title: string;
  footnote: string;
  yearRange: {
    start: number;
    end: number;
  };
  language?: 'he' | 'en';
  direction?: 'rtl' | 'ltr';
};

export type ChartConfig = {
  metadata: ChartMetadata;
  seriesTypes: Record<string, SeriesConfig>;
  appearance?: {
    height?: number;
    barSize?: number;
    gridLines?: boolean;
    animation?: boolean;
  };
};

export type DataPoint = {
  year: number;
  [key: string]: number;
};

export type ChartProps = {
  configData?: ChartConfig;
  chartData?: DataPoint[];
  className?: string;
  onSeriesClick?: (seriesKey: string) => void;
  onYearClick?: (year: number) => void;
  loading?: boolean;
};
