import html2canvas from 'html2canvas';
import { ChartConfig, DataPoint } from '../types/ChartTypes';

/**
 * Export chart as PNG image
 */
export const exportToPNG = async (element: HTMLElement, filename: string = 'chart'): Promise<void> => {
  try {
    // Hide control panel temporarily if present
    const controlPanel = document.querySelector('[data-control-panel]');
    const originalDisplay = controlPanel ? (controlPanel as HTMLElement).style.display : '';
    if (controlPanel) {
      (controlPanel as HTMLElement).style.display = 'none';
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
    });

    // Restore control panel
    if (controlPanel) {
      (controlPanel as HTMLElement).style.display = originalDisplay;
    }

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  } catch (error) {
    console.error('Failed to export PNG:', error);
    alert('Failed to export image. Please try again.');
  }
};

/**
 * Export data as CSV file
 */
export const exportToCSV = (
  data: DataPoint[],
  config: ChartConfig,
  filename: string = 'data'
): void => {
  try {
    // Get visible series
    const visibleSeries = Object.entries(config.seriesTypes)
      .filter(([, seriesConfig]) => seriesConfig.visible !== false)
      .map(([key, seriesConfig]) => ({
        key,
        name: seriesConfig.name
      }));

    // Create CSV header
    const headers = ['Year', ...visibleSeries.map(s => s.name)];
    const csvRows = [headers.join(',')];

    // Add data rows
    data.forEach(row => {
      const values = [
        row.year,
        ...visibleSeries.map(s => row[s.key] || 0)
      ];
      csvRows.push(values.join(','));
    });

    // Create blob and download
    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // UTF-8 BOM for Excel
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export CSV:', error);
    alert('Failed to export CSV. Please try again.');
  }
};
