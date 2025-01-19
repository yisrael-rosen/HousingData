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
      className={`bg-white p-4 border border-gray-200 shadow-lg rounded-lg min-w-[250px]`}
      dir={direction}
      style={{ direction }}
    >
      <div className="font-bold mb-2 border-b pb-2">
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
            className={`py-2 ${index !== payload.length - 1 ? 'border-b' : ''}`}
          >
            <div className="font-semibold flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: seriesConfig.color }}
              />
              {seriesConfig.name}
            </div>
            
            {seriesConfig.description && (
              <div className="text-sm text-gray-600 mt-1">
                {seriesConfig.description}
              </div>
            )}

            <div className="flex items-center gap-2 mt-1">
              <span className="font-medium">
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
              <div className="text-sm text-gray-600">
                {language === 'he' ? 
                  `שינוי משנה קודמת: ${formatNumber(Math.abs(change), seriesConfig.tooltipConfig)} ${change > 0 ? 'יותר' : 'פחות'}` :
                  `Change from previous year: ${change > 0 ? '+' : '-'}${formatNumber(Math.abs(change), seriesConfig.tooltipConfig)}`
                }
              </div>
            )}

            {seriesConfig.tooltipConfig.showPercentOfTotal && percentOfTotal !== null && (
              <div className="text-sm text-gray-600">
                {language === 'he' ? 
                  `אחוז מהסך הכל: ${percentOfTotal.toFixed(1)}%` :
                  `Percent of total: ${percentOfTotal.toFixed(1)}%`
                }
              </div>
            )}

            {seriesConfig.tooltipConfig.showGapFromActual && seriesConfig.type === 'line' && (
              <div className="text-sm text-gray-600">
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
