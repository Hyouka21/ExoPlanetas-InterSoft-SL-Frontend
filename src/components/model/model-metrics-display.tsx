'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Activity, 
  Brain,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  Clock,
  Database
} from 'lucide-react';
import { ModelVersionInfo } from '@/api/types';

interface ModelMetricsDisplayProps {
  modelInfo: ModelVersionInfo;
  className?: string;
}

export function ModelMetricsDisplay({ modelInfo, className }: ModelMetricsDisplayProps) {
  // Extract metrics with fallbacks
  const accuracy = modelInfo.metrics.accuracy || 0;
  const macroAvg = modelInfo.metrics['macro avg'];
  const weightedAvg = modelInfo.metrics['weighted avg'];
  
  // Use macro avg as primary, weighted avg as fallback
  const precision = macroAvg?.precision || weightedAvg?.precision || 0;
  const recall = macroAvg?.recall || weightedAvg?.recall || 0;
  const f1Score = macroAvg?.['f1-score'] || weightedAvg?.['f1-score'] || 0;
  const support = macroAvg?.support || weightedAvg?.support || 0;

  // Calculate dataset size from confusion matrix
  const totalSamples = modelInfo.confusion_matrix.flat().reduce((sum, val) => sum + val, 0);
  
  // Extract class-specific metrics
  const classMetrics = Object.entries(modelInfo.metrics)
    .filter(([key]) => ['CANDIDATE', 'CONFIRMED', 'FALSE POSITIVE'].includes(key))
    .map(([className, metrics]: [string, any]) => ({
      className,
      precision: metrics.precision || 0,
      recall: metrics.recall || 0,
      f1Score: metrics['f1-score'] || 0,
      support: metrics.support || 0
    }));

  const getClassIcon = (className: string) => {
    switch (className) {
      case 'CONFIRMED':
        return CheckCircle;
      case 'CANDIDATE':
        return AlertCircle;
      case 'FALSE POSITIVE':
        return XCircle;
      default:
        return Activity;
    }
  };

  const getClassColor = (className: string) => {
    switch (className) {
      case 'CONFIRMED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'CANDIDATE':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'FALSE POSITIVE':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-space-600" />
            Rendimiento General del Modelo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {(accuracy * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {(precision * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Precision</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {(recall * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Recall</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Brain className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {(f1Score * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">F1-Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dataset Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-space-600" />
            Información del Dataset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-700">
                {totalSamples.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total de Muestras</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-700">
                {classMetrics.length}
              </div>
              <div className="text-sm text-gray-600">Clases</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-700">
                {modelInfo.version}
              </div>
              <div className="text-sm text-gray-600">Versión del Modelo</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class-Specific Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-space-600" />
            Métricas por Clase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classMetrics.map((classMetric) => {
              const Icon = getClassIcon(classMetric.className);
              const colorClass = getClassColor(classMetric.className);
              
              return (
                <div key={classMetric.className} className={`p-4 rounded-lg border ${colorClass}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-2" />
                      <span className="font-semibold">{classMetric.className}</span>
                      <Badge variant="secondary" className="ml-2">
                        {classMetric.support} muestras
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {(classMetric.precision * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">Precision</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {(classMetric.recall * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">Recall</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {(classMetric.f1Score * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">F1-Score</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-space-600" />
            Información del Modelo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nombre del Modelo</label>
              <p className="text-sm font-semibold mt-1">{modelInfo.model_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Versión</label>
              <p className="text-sm font-semibold mt-1">{modelInfo.version}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Estado</label>
              <div className="mt-1">
                <Badge variant={modelInfo.model_exists ? "default" : "destructive"}>
                  {modelInfo.model_exists ? "Disponible" : "No encontrado"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Tamaño del Dataset</label>
              <p className="text-sm font-semibold mt-1">{totalSamples.toLocaleString()} exoplanetas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
