'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/api/client';
import { ModelInfo, ModelVersionInfo } from '@/api/types';
import { ModelMetricsDisplay } from '@/components/model/model-metrics-display';
import { 
  Brain, 
  Info, 
  Database,
  Loader2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function ModelInfoPage() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [modelVersionInfo, setModelVersionInfo] = useState<ModelVersionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get basic model info and latest version info
        const [basicInfo, versionInfo] = await Promise.all([
          apiClient.getModelInfo(),
          apiClient.getModelVersionInfo('hgb_exoplanet_model', 'v1.0.6').catch(() => null)
        ]);
        
        setModelInfo(basicInfo);
        setModelVersionInfo(versionInfo);
      } catch (err) {
        console.error('Error fetching model info:', err);
        setError(err instanceof Error ? err.message : 'Error loading model information');
      } finally {
        setLoading(false);
      }
    };

    fetchModelInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-space-600" />
          <p className="text-gray-600">Loading model information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/" className="flex items-center text-space-600 hover:text-space-700 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-space-500 to-space-700 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-space-600 to-space-800 bg-clip-text text-transparent mb-2">
              Model Information
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Technical details, performance metrics and exoplanet classifier configuration.
            </p>
          </div>
        </div>

        {/* Model Metrics Display */}
        {modelVersionInfo && (
          <ModelMetricsDisplay modelInfo={modelVersionInfo} />
        )}

        {/* Additional Information */}
        {modelInfo && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2 text-space-600" />
                  General System Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Models</label>
                    <p className="text-2xl font-bold text-space-600 mt-1">
                      {modelInfo.total_models}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Model</label>
                    <p className="text-lg font-semibold mt-1">
                      {modelInfo.current_model.name}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Version</label>
                    <p className="text-lg font-semibold mt-1">
                      {modelInfo.current_model.version}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Supported Classes</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {modelInfo.current_model.classes.map((className) => (
                        <Badge 
                          key={className}
                          variant="secondary"
                          className="text-xs"
                        >
                          {className}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-500">Training Datasets</label>
                  <div className="mt-2 space-y-2">
                    {modelInfo.current_model.dataset_name ? (
                      <div className="flex items-center text-sm p-2 bg-gray-50 rounded-lg">
                        <Database className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium">{modelInfo.current_model.dataset_name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm p-2 bg-gray-50 rounded-lg">
                        <Database className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-500">No dataset information available</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
