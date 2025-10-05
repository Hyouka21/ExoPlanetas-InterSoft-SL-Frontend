'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfusionMatrix } from '@/api/types';

interface ConfusionMatrixChartProps {
  data: ConfusionMatrix;
  className?: string;
}

export function ConfusionMatrixChart({ data, className }: ConfusionMatrixChartProps) {
  const classes = Object.keys(data);
  const maxValue = Math.max(...classes.flatMap(cls => Object.values(data[cls])));

  // Helper function to get class display name
  const getClassDisplayName = (className: string) => {
    if (className === 'FALSE POSITIVE') return 'FALSE_POSITIVE';
    return className;
  };

  // Helper function to get class short name for headers
  const getClassShortName = (className: string) => {
    if (className === 'FALSE POSITIVE') return 'FALSE_POS';
    return className;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Confusion Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="w-full max-w-4xl mx-auto">
            {/* Header row */}
            <div className="flex w-full">
              <div className="w-1/4 h-16 sm:h-20 flex items-center justify-center text-sm sm:text-base font-medium text-gray-500 border-r border-b bg-gray-50">
                Actual
              </div>
              {classes.map((cls) => (
                <div key={cls} className="w-1/4 h-16 sm:h-20 flex items-center justify-center text-sm sm:text-base font-medium text-gray-700 border-r border-b bg-gray-50">
                  <span className="text-center leading-tight">
                    {getClassShortName(cls)}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Data rows */}
            {classes.map((actualClass, rowIndex) => (
              <div key={actualClass} className="flex w-full">
                <div className="w-1/4 h-16 sm:h-20 flex items-center justify-center text-sm sm:text-base font-medium text-gray-700 border-r border-b bg-gray-50">
                  <span className="text-center leading-tight">
                    {getClassShortName(actualClass)}
                  </span>
                </div>
                {classes.map((predictedClass, colIndex) => {
                  const value = data[actualClass]?.[predictedClass] || 0;
                  const isCorrect = actualClass === predictedClass;
                  
                  // Different colors for correct vs incorrect predictions
                  let bgColor;
                  if (isCorrect) {
                    // Green gradient for correct predictions (diagonal)
                    const intensity = maxValue > 0 ? value / maxValue : 0;
                    bgColor = `rgba(34, 197, 94, ${0.2 + intensity * 0.6})`;
                  } else {
                    // Normal red for incorrect predictions (off-diagonal) - using NASA red
                    const intensity = maxValue > 0 ? value / maxValue : 0;
                    bgColor = `rgba(255, 68, 68, ${0.3 + intensity * 0.4})`;
                  }
                  
                  return (
                    <div
                      key={`${actualClass}-${predictedClass}`}
                      className="w-1/4 h-16 sm:h-20 flex items-center justify-center text-lg sm:text-xl font-bold border-r border-b hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: bgColor }}
                    >
                      {value.toLocaleString()}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 rounded border" style={{ backgroundColor: 'rgba(34, 197, 94, 0.4)' }}></div>
            <span className="text-gray-700 font-medium">Correct Predictions</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 rounded border" style={{ backgroundColor: 'rgba(255, 68, 68, 0.5)' }}></div>
            <span className="text-gray-700 font-medium">Incorrect Predictions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
