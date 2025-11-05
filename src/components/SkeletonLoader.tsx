import React from 'react';

interface SkeletonLoaderProps {
  height?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ height = '24rem' }) => {
  return (
    <div
      className="w-full p-6 animate-pulse"
      style={{ height }}
      role="status"
      aria-live="polite"
      aria-label="Loading chart data"
    >
      {/* Title skeleton */}
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg w-2/3 mx-auto mb-8"></div>

      {/* Chart area skeleton */}
      <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/20 to-transparent animate-shimmer"></div>

        {/* Fake bars */}
        <div className="absolute bottom-16 left-0 right-0 flex items-end justify-around px-12 h-3/4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-300 dark:bg-gray-600 rounded-t w-12"
              style={{ height: `${Math.random() * 60 + 30}%` }}
            ></div>
          ))}
        </div>

        {/* Fake legend */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
              <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footnote skeleton */}
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto mt-4"></div>

      <span className="sr-only">Loading chart data, please wait...</span>
    </div>
  );
};

export default SkeletonLoader;
