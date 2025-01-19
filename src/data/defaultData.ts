import { ChartConfig, DataPoint } from '../types/ChartTypes';

export const defaultConfig: ChartConfig = {
  metadata: {
    title: "סך מצטבר של יחידות דיור לאוכלוסייה החרדית 2025-2040",
    footnote: "הנתונים לדוגמה בלבד",
    yearRange: {
      start: 2025,
      end: 2040
    },
    language: 'he',
    direction: 'rtl'
  },
  seriesTypes: {
    marketed: {
      name: "סך יחידות דיור ששווקו בפועל",
      description: "יחידות דיור ששווקו על ידי רמ\"י והמשרד במסלולים השונים",
      type: "bar",
      color: "#1E40AF",
      stackOrder: 1,
      stack: "main",
      showChange: true,
      changeConfig: {
        type: "arrow",
        thresholds: {
          significant: 1000,
          major: 5000
        }
      },
      tooltipConfig: {
        numberFormat: "thousands",
        showPercentOfTotal: true,
        showChangeFromPrevious: true
      }
    },
    submitted: {
      name: "סך תוכניות שהוגשו",
      description: "תכניות שהוגשו למוסדות התכנון וטרם אושרו",
      type: "bar",
      color: "#16A34A",
      stackOrder: 2,
      stack: "main",
      showChange: true,
      changeConfig: {
        type: "arrow",
        thresholds: {
          significant: 500,
          major: 2000
        }
      },
      tooltipConfig: {
        numberFormat: "thousands",
        showPercentOfTotal: true,
        showChangeFromPrevious: true
      }
    },
    planned: {
      name: "סך יחידות דיור בתכנון",
      description: "יחידות דיור בתכניות בתהליכי תכנון שונים",
      type: "bar",
      color: "#4F46E5",
      stackOrder: 3,
      stack: "main",
      showChange: true,
      changeConfig: {
        type: "arrow",
        thresholds: {
          significant: 500,
          major: 2000
        }
      },
      tooltipConfig: {
        numberFormat: "thousands",
        showPercentOfTotal: true,
        showChangeFromPrevious: true
      }
    },
    built: {
      name: "סך יחידות דיור שנבנו",
      description: "יחידות דיור שבנייתן הושלמה ונמסרו לדיירים",
      type: "bar",
      color: "#9333EA",
      stackOrder: 0,
      stack: "main",
      showChange: true,
      changeConfig: {
        type: "arrow",
        thresholds: {
          significant: 1000,
          major: 5000
        }
      },
      tooltipConfig: {
        numberFormat: "thousands",
        showPercentOfTotal: true,
        showChangeFromPrevious: true
      }
    },
    required: {
      name: "יעד סך יחידות דיור נדרשות",
      description: "יעד יחידות הדיור הנדרשות לפי תחזית הצרכים של האוכלוסייה",
      type: "line",
      color: "#F97316",
      stackOrder: null,
      stack: null,
      showChange: false,
      tooltipConfig: {
        numberFormat: "thousands",
        showGapFromActual: true
      }
    }
  },
  appearance: {
    height: 96,
    barSize: 20,
    gridLines: true,
    animation: true
  }
};

import housingData from './housingData2025-2040.json';
export const defaultData: DataPoint[] = housingData.data;
