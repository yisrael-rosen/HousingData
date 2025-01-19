import React from 'react';
import { TooltipProps } from 'recharts';
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
      className={`bg-white p-4 border border-gray-200 shadow-lg rounded-lg min-w-[280px] transition-all duration-200 ease-in-out transform hover:scale-[1.02]`}
      dir={direction}
      style={{ direction, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
    >
      <div className="font-bold mb-4 border-b pb-3 text-xl bg-gray-50 -mx-4 -mt-4 p-4 rounded-t-lg">
        {language === 'he' ? `שנת ${label}` : `Year ${label}`}
      </div>
      
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
            className={`py-3 ${index !== payload.length - 1 ? 'border-b' : ''} hover:bg-gray-50 transition-colors duration-150 rounded-md`}
          >
            <div className="font-semibold flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full shadow-sm" 
                style={{ backgroundColor: seriesConfig.color }}
              />
              {seriesConfig.name}
            </div>
            
            {seriesConfig.description && (
              <div className="text-sm text-gray-600 mt-1">
                {seriesConfig.description}
              </div>
            )}

            <div className="flex items-center gap-3 mt-2">
              <span className="font-medium text-lg">
                {formatNumber(value, seriesConfig.tooltipConfig, language === 'he' ? 'he-IL' : 'en-US')}
              </span>
              {seriesConfig.showChange && change && seriesConfig.changeConfig && (
                <ChangeIndicator 
                  value={change} 
                  config={seriesConfig.changeConfig}
                />
              )}
            </div>

            {seriesConfig.tooltipConfig.showChangeFromPrevious && change && (
              <div className="text-sm bg-blue-50 px-3 py-1 rounded-lg mt-2">
                {language === 'he' ? 
                  `שינוי משנה קודמת: ${formatNumber(Math.abs(change), seriesConfig.tooltipConfig)} ${change > 0 ? 'יותר' : 'פחות'}` :
                  `Change from previous year: ${change > 0 ? '+' : '-'}${formatNumber(Math.abs(change), seriesConfig.tooltipConfig)}`
                }
              </div>
            )}

            {seriesConfig.tooltipConfig.showPercentOfTotal && percentOfTotal !== null && (
              <div className="text-sm bg-gray-100 px-3 py-1 rounded-full mt-2 font-medium">
                {language === 'he' ? 
                  `${percentOfTotal.toFixed(1)}% מהסך הכל` :
                  `${percentOfTotal.toFixed(1)}% of total`
                }
              </div>
            )}

            {seriesConfig.tooltipConfig.showGapFromActual && seriesConfig.type === 'line' && (
              <div className="text-sm bg-gray-50 px-3 py-1 rounded-lg mt-2">
                {language === 'he' ? 
                  `פער מהיעד: ${formatNumber(Math.abs(totalValue - value), seriesConfig.tooltipConfig)}` :
                  `Gap from target: ${formatNumber(Math.abs(totalValue - value), seriesConfig.tooltipConfig)}`
                }
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CustomTooltip;
