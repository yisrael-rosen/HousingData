import React from 'react';
import { BarChart3, LineChart, AreaChart, PieChart } from 'lucide-react';

export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'composed';

interface ChartTypeSwitcherProps {
  currentType: ChartType;
  onTypeChange: (type: ChartType) => void;
  language: 'he' | 'en';
}

const ChartTypeSwitcher: React.FC<ChartTypeSwitcherProps> = ({
  currentType,
  onTypeChange,
  language,
}) => {
  const types: Array<{ type: ChartType; icon: React.ReactNode; label: string; labelEn: string }> = [
    { type: 'composed', icon: <BarChart3 className="w-4 h-4" />, label: 'משולב', labelEn: 'Mixed' },
    { type: 'bar', icon: <BarChart3 className="w-4 h-4" />, label: 'עמודות', labelEn: 'Bars' },
    { type: 'line', icon: <LineChart className="w-4 h-4" />, label: 'קווים', labelEn: 'Lines' },
    { type: 'area', icon: <AreaChart className="w-4 h-4" />, label: 'שטח', labelEn: 'Area' },
    { type: 'pie', icon: <PieChart className="w-4 h-4" />, label: 'עוגה', labelEn: 'Pie' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
      {types.map(({ type, icon, label, labelEn }) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            currentType === type
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title={language === 'he' ? label : labelEn}
          aria-label={language === 'he' ? label : labelEn}
        >
          {icon}
          <span className="text-xs font-medium hidden sm:inline">
            {language === 'he' ? label : labelEn}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ChartTypeSwitcher;
