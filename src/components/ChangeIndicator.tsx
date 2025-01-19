import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, CircleDotIcon } from 'lucide-react';
import { ChangeConfig } from '../types/ChartTypes';
import { getChangeIndicatorColor } from '../utils/chartUtils';

interface ChangeIndicatorProps {
  value: number | null;
  config: ChangeConfig;
  className?: string;
}

const ChangeIndicator: React.FC<ChangeIndicatorProps> = ({ 
  value, 
  config,
  className = ''
}) => {
  if (!value) return null;

  const color = getChangeIndicatorColor(value, config.thresholds, config.colors);
  const baseClass = `inline-block w-4 h-4 ${color} ${className}`;

  const Icon = value > 0 ? ArrowUpIcon : ArrowDownIcon;

  switch (config.type) {
    case 'arrow':
      return <Icon className={baseClass} />;
    
    case 'dot':
      return <CircleDotIcon className={baseClass} />;
    
    case 'badge':
      return (
        <span className={`
          ${baseClass} px-2 py-1 rounded-full text-xs font-medium
          ${value > 0 ? 'bg-green-100' : 'bg-red-100'}
        `}>
          {value > 0 ? '+' : '-'}{Math.abs(value)}
        </span>
      );
    
    default:
      return null;
  }
};

export default ChangeIndicator;
