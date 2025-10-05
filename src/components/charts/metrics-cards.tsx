'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Brain, 
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { ModelVersionInfo, DashboardMetrics } from '@/api/types';

interface MetricsCardsProps {
  modelVersionInfo: ModelVersionInfo;
  metrics: DashboardMetrics;
  className?: string;
}

export function MetricsCards({ modelVersionInfo, metrics, className }: MetricsCardsProps) {
  const totalPlanets = Object.values(metrics.class_distribution).reduce((sum, count) => sum + count, 0);
  
  const accuracy = modelVersionInfo.metrics.accuracy || 0;
  
  // Try to get metrics from macro_avg first, then weighted_avg as fallback
  // Handle both underscore and space formats from backend
  const macroAvg = modelVersionInfo.metrics.macro_avg || modelVersionInfo.metrics['macro avg'];
  const weightedAvg = modelVersionInfo.metrics.weighted_avg || modelVersionInfo.metrics['weighted avg'];
  
  const precision = macroAvg?.precision || weightedAvg?.precision || 0;
  const recall = macroAvg?.recall || weightedAvg?.recall || 0;
  const f1Score = macroAvg?.['f1-score'] || weightedAvg?.['f1-score'] || 0;


  const cards = [
    {
      title: 'Model Accuracy',
      value: `${(accuracy * 100).toFixed(1)}%`,
      icon: Target,
      description: 'Overall classifier accuracy',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'F1-Score',
      value: `${(f1Score * 100).toFixed(1)}%`,
      icon: TrendingUp,
      description: 'Harmonic mean between precision and recall',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Exoplanets Analyzed',
      value: totalPlanets.toLocaleString(),
      icon: Activity,
      description: 'Total planets processed',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Model Version',
      value: modelVersionInfo.version,
      icon: Brain,
      description: 'Current classifier version',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-gray-500 mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ClassBreakdown({ metrics }: { metrics: DashboardMetrics }) {
  const classData = Object.entries(metrics.class_distribution).map(([className, count]) => ({
    className: className.replace('_', ' '),
    count,
    percentage: (count / Object.values(metrics.class_distribution).reduce((sum, c) => sum + c, 0)) * 100
  }));

  const getIcon = (className: string) => {
    switch (className.toLowerCase()) {
      case 'confirmed':
        return CheckCircle;
      case 'candidate':
        return AlertCircle;
      case 'false positive':
        return XCircle;
      default:
        return Activity;
    }
  };

  const getColor = (className: string) => {
    switch (className.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'candidate':
        return 'text-yellow-600 bg-yellow-50';
      case 'false positive':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {classData.map((item) => {
            const Icon = getIcon(item.className);
            return (
              <div key={item.className} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getColor(item.className).split(' ')[1]}`}>
                    <Icon className={`w-4 h-4 ${getColor(item.className).split(' ')[0]}`} />
                  </div>
                  <div>
                    <div className="font-medium">{item.className}</div>
                    <div className="text-sm text-gray-500">
                      {item.count} exoplanets
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{item.count}</div>
                  <div className="text-sm text-gray-500">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
