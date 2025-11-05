import React, { useState } from 'react';
import { GitCompare, X, Plus, Trash2 } from 'lucide-react';
import { DataPoint } from '../types/ChartTypes';

interface ComparisonModeProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'he' | 'en';
  data: DataPoint[];
  availableSeries: Array<{ key: string; name: string; color: string }>;
}

const ComparisonMode: React.FC<ComparisonModeProps> = ({
  isOpen,
  onClose,
  language,
  data,
  availableSeries,
}) => {
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const availableYears = data.map(d => d.year).sort((a, b) => a - b);

  const handleAddYear = (year: number) => {
    if (!selectedYears.includes(year) && selectedYears.length < 4) {
      setSelectedYears([...selectedYears, year]);
    }
  };

  const handleRemoveYear = (year: number) => {
    setSelectedYears(selectedYears.filter(y => y !== year));
  };

  const getYearData = (year: number) => {
    return data.find(d => d.year === year);
  };

  const calculateDifference = (year1Data: DataPoint | undefined, year2Data: DataPoint | undefined, seriesKey: string) => {
    if (!year1Data || !year2Data) return null;
    const val1 = year1Data[seriesKey] as number;
    const val2 = year2Data[seriesKey] as number;
    if (typeof val1 !== 'number' || typeof val2 !== 'number') return null;

    const diff = val2 - val1;
    const percentChange = val1 !== 0 ? (diff / val1) * 100 : 0;
    return { diff, percentChange };
  };

  if (!isOpen) return null;

  const text = language === 'he' ? {
    title: 'מצב השוואה',
    close: 'סגור',
    selectYears: 'בחר שנים להשוואה',
    addYear: 'הוסף שנה',
    comparison: 'השוואה',
    difference: 'הפרש',
    percentChange: 'שינוי באחוזים',
    noYearsSelected: 'בחר לפחות שתי שנים להשוואה',
    maxYearsReached: 'ניתן להשוות עד 4 שנים',
  } : {
    title: 'Comparison Mode',
    close: 'Close',
    selectYears: 'Select years to compare',
    addYear: 'Add year',
    comparison: 'Comparison',
    difference: 'Difference',
    percentChange: 'Percent Change',
    noYearsSelected: 'Select at least two years to compare',
    maxYearsReached: 'You can compare up to 4 years',
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <GitCompare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 id="comparison-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
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
        <div className="p-6">
          {/* Year Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {text.selectYears}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedYears.map(year => (
                <div
                  key={year}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg"
                >
                  <span className="font-semibold">{year}</span>
                  <button
                    onClick={() => handleRemoveYear(year)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {selectedYears.length < 4 && (
              <div className="flex flex-wrap gap-2">
                {availableYears
                  .filter(year => !selectedYears.includes(year))
                  .map(year => (
                    <button
                      key={year}
                      onClick={() => handleAddYear(year)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {year}
                    </button>
                  ))}
              </div>
            )}
            {selectedYears.length >= 4 && (
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                {text.maxYearsReached}
              </p>
            )}
          </div>

          {/* Comparison Table */}
          {selectedYears.length >= 2 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
                      {language === 'he' ? 'סדרה' : 'Series'}
                    </th>
                    {selectedYears.map(year => (
                      <th key={year} className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
                        {year}
                      </th>
                    ))}
                    {selectedYears.length === 2 && (
                      <>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
                          {text.difference}
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
                          {text.percentChange}
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {availableSeries.map(series => {
                    const yearData = selectedYears.map(year => getYearData(year));
                    const diff = selectedYears.length === 2
                      ? calculateDifference(yearData[0], yearData[1], series.key)
                      : null;

                    return (
                      <tr key={series.key} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: series.color }}
                            />
                            {series.name}
                          </div>
                        </td>
                        {yearData.map((data, idx) => (
                          <td key={idx} className="px-4 py-3 text-sm text-center text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                            {data ? (data[series.key] as number).toLocaleString() : '-'}
                          </td>
                        ))}
                        {diff && (
                          <>
                            <td className={`px-4 py-3 text-sm text-center font-semibold border border-gray-300 dark:border-gray-600 ${
                              diff.diff > 0 ? 'text-green-600 dark:text-green-400' : diff.diff < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {diff.diff > 0 ? '+' : ''}{diff.diff.toLocaleString()}
                            </td>
                            <td className={`px-4 py-3 text-sm text-center font-semibold border border-gray-300 dark:border-gray-600 ${
                              diff.percentChange > 0 ? 'text-green-600 dark:text-green-400' : diff.percentChange < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {diff.percentChange > 0 ? '+' : ''}{diff.percentChange.toFixed(1)}%
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <GitCompare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">{text.noYearsSelected}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonMode;
