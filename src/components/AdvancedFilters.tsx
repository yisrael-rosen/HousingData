import React, { useState, useEffect } from 'react';
import { Filter, X, Calendar, TrendingUp, RotateCcw } from 'lucide-react';
import { DataPoint } from '../types/ChartTypes';

interface FilterConfig {
  yearRange: {
    min: number;
    max: number;
  };
  valueFilters: {
    [key: string]: {
      min?: number;
      max?: number;
      enabled: boolean;
    };
  };
  changeFilter: {
    enabled: boolean;
    minChange?: number; // percentage
    series?: string;
  };
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'he' | 'en';
  data: DataPoint[];
  availableSeries: Array<{ key: string; name: string }>;
  onApplyFilters: (filters: FilterConfig) => void;
  currentFilters?: FilterConfig;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onClose,
  language,
  data,
  availableSeries,
  onApplyFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<FilterConfig>(
    currentFilters || {
      yearRange: {
        min: Math.min(...data.map(d => d.year)),
        max: Math.max(...data.map(d => d.year)),
      },
      valueFilters: {},
      changeFilter: {
        enabled: false,
      },
    }
  );

  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
    }
  }, [currentFilters]);

  const minYear = Math.min(...data.map(d => d.year));
  const maxYear = Math.max(...data.map(d => d.year));

  const handleYearRangeChange = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      yearRange: {
        ...prev.yearRange,
        [type]: value,
      },
    }));
  };

  const handleValueFilterChange = (series: string, type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFilters(prev => ({
      ...prev,
      valueFilters: {
        ...prev.valueFilters,
        [series]: {
          ...prev.valueFilters[series],
          [type]: numValue,
          enabled: true,
        },
      },
    }));
  };

  const handleToggleValueFilter = (series: string) => {
    setFilters(prev => ({
      ...prev,
      valueFilters: {
        ...prev.valueFilters,
        [series]: {
          ...prev.valueFilters[series],
          enabled: !prev.valueFilters[series]?.enabled,
        },
      },
    }));
  };

  const handleChangeFilterToggle = () => {
    setFilters(prev => ({
      ...prev,
      changeFilter: {
        ...prev.changeFilter,
        enabled: !prev.changeFilter.enabled,
      },
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterConfig = {
      yearRange: { min: minYear, max: maxYear },
      valueFilters: {},
      changeFilter: { enabled: false },
    };
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
  };

  if (!isOpen) return null;

  const text = language === 'he' ? {
    title: 'סינונים מתקדמים',
    close: 'סגור',
    apply: 'החל',
    reset: 'איפוס',
    yearRange: 'טווח שנים',
    from: 'מ',
    to: 'עד',
    valueFilters: 'סינון לפי ערכים',
    minimum: 'מינימום',
    maximum: 'מקסימום',
    changeFilter: 'סינון לפי שינוי',
    minChange: 'שינוי מינימלי (%)',
    series: 'סדרה',
    enable: 'הפעל',
    noFiltersApplied: 'אין סינונים פעילים',
  } : {
    title: 'Advanced Filters',
    close: 'Close',
    apply: 'Apply',
    reset: 'Reset',
    yearRange: 'Year Range',
    from: 'From',
    to: 'To',
    valueFilters: 'Value Filters',
    minimum: 'Minimum',
    maximum: 'Maximum',
    changeFilter: 'Change Filter',
    minChange: 'Minimum Change (%)',
    series: 'Series',
    enable: 'Enable',
    noFiltersApplied: 'No filters applied',
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filters-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 id="filters-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {text.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={text.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Year Range */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {text.yearRange}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {text.from}
                </label>
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={filters.yearRange.min}
                  onChange={(e) => handleYearRangeChange('min', Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center font-semibold text-gray-900 dark:text-gray-100 mt-1">
                  {filters.yearRange.min}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {text.to}
                </label>
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={filters.yearRange.max}
                  onChange={(e) => handleYearRangeChange('max', Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center font-semibold text-gray-900 dark:text-gray-100 mt-1">
                  {filters.yearRange.max}
                </div>
              </div>
            </div>
          </div>

          {/* Value Filters */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {text.valueFilters}
            </h3>
            <div className="space-y-3">
              {availableSeries.map(series => (
                <div key={series.key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {series.name}
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{text.enable}</span>
                      <input
                        type="checkbox"
                        checked={filters.valueFilters[series.key]?.enabled || false}
                        onChange={() => handleToggleValueFilter(series.key)}
                        className="rounded"
                      />
                    </label>
                  </div>
                  {filters.valueFilters[series.key]?.enabled && (
                    <div className="flex gap-3 mt-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {text.minimum}
                        </label>
                        <input
                          type="number"
                          value={filters.valueFilters[series.key]?.min || ''}
                          onChange={(e) => handleValueFilterChange(series.key, 'min', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {text.maximum}
                        </label>
                        <input
                          type="number"
                          value={filters.valueFilters[series.key]?.max || ''}
                          onChange={(e) => handleValueFilterChange(series.key, 'max', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="∞"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {text.reset}
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {text.close}
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              {text.apply}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
