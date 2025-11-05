import React, { useState, useMemo } from 'react';
import { Table2, X, ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';
import { DataPoint } from '../types/ChartTypes';
import { exportToCSV } from '../utils/exportUtils';

interface TableViewProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'he' | 'en';
  data: DataPoint[];
  availableSeries: Array<{ key: string; name: string; color: string }>;
  config: any;
}

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'year' | string;

const TableView: React.FC<TableViewProps> = React.memo(({
  isOpen,
  onClose,
  language,
  data,
  availableSeries,
  config,
}) => {
  const [sortField, setSortField] = useState<SortField>('year');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const text = language === 'he' ? {
    title: 'תצוגת טבלה',
    close: 'סגור',
    year: 'שנה',
    export: 'ייצא ל-CSV',
    total: 'סה"כ',
  } : {
    title: 'Table View',
    close: 'Close',
    year: 'Year',
    export: 'Export to CSV',
    total: 'Total',
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = sortField === 'year' ? a.year : (a[sortField] as number || 0);
      const bVal = sortField === 'year' ? b.year : (b[sortField] as number || 0);

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [data, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField('year');
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-50" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3 h-3" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="w-3 h-3" />;
    }
    return <ArrowUpDown className="w-3 h-3 opacity-50" />;
  };

  const handleExport = () => {
    exportToCSV(sortedData, config, config.metadata?.title || 'table-data');
  };

  // Calculate totals for each series
  const totals = useMemo(() => {
    const result: { [key: string]: number } = {};
    availableSeries.forEach(({ key }) => {
      result[key] = sortedData.reduce((sum, row) => sum + ((row[key] as number) || 0), 0);
    });
    return result;
  }, [sortedData, availableSeries]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="table-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Table2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h2 id="table-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {text.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              aria-label={text.export}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">{text.export}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={text.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => handleSort('year')}
                >
                  <div className="flex items-center gap-2">
                    {text.year}
                    {getSortIcon('year')}
                  </div>
                </th>
                {availableSeries.map(({ key, name, color }) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {name}
                      {getSortIcon(key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row) => (
                <tr
                  key={row.year}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
                    {row.year}
                  </td>
                  {availableSeries.map(({ key }) => (
                    <td
                      key={key}
                      className="px-4 py-3 text-sm text-center text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                    >
                      {typeof row[key] === 'number' ? (row[key] as number).toLocaleString() : '-'}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Totals row */}
              <tr className="bg-blue-50 dark:bg-blue-900/20 font-semibold">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
                  {text.total}
                </td>
                {availableSeries.map(({ key }) => (
                  <td
                    key={key}
                    className="px-4 py-3 text-sm text-center text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                  >
                    {totals[key].toLocaleString()}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

TableView.displayName = 'TableView';

export default TableView;
