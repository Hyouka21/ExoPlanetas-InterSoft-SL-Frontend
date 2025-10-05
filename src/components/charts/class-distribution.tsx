'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ClassDistribution } from '@/api/types';

interface ClassDistributionChartProps {
  data: ClassDistribution;
  className?: string;
}

const COLORS = {
  'CONFIRMED': '#10B981',
  'CANDIDATE': '#F59E0B', 
  'FALSE POSITIVE': '#ff4444',
  'confirmed': '#10B981',
  'candidate': '#F59E0B',
  'false_positive': '#ff4444',
};

export function ClassDistributionChart({ data, className }: ClassDistributionChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value,
    color: COLORS[name as keyof typeof COLORS] || '#6B7280'
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-nasa-cyan">Class Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Exoplanets']}
                labelFormatter={(label) => `Class: ${label}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {chartData.map((item) => (
            <div key={item.name} className="text-center">
              <div 
                className="w-3 h-3 rounded-full mx-auto mb-1"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-sm font-medium">{item.name}</div>
              <div className="text-xs text-gray-500">
                {item.value} ({((item.value / total) * 100).toFixed(1)}%)
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
