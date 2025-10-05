'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain
} from 'lucide-react';
import { ModelVersionInfo } from '@/api/types';

interface ModelMetricsDisplayProps {
  modelInfo: ModelVersionInfo;
  className?: string;
}

export function ModelMetricsDisplay({ modelInfo, className }: ModelMetricsDisplayProps) {
  // Calculate dataset size from confusion matrix
  const totalSamples = modelInfo.confusion_matrix.flat().reduce((sum, val) => sum + val, 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-space-600" />
            Model Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Model Name</label>
              <p className="text-sm font-semibold mt-1">{modelInfo.model_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Version</label>
              <p className="text-sm font-semibold mt-1">{modelInfo.version}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge variant={modelInfo.model_exists ? "default" : "destructive"}>
                  {modelInfo.model_exists ? "Available" : "Not found"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Dataset Size</label>
              <p className="text-sm font-semibold mt-1">{totalSamples.toLocaleString()} exoplanets</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
