'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MetricsCards, ClassBreakdown } from '@/components/charts/metrics-cards';
import { ConfusionMatrixChart } from '@/components/charts/confusion-matrix';
import { ClassDistributionChart } from '@/components/charts/class-distribution';
import { ModelSelector } from '@/components/model-selector';
import { apiClient } from '@/api/client';
import { ModelVersionInfo, DashboardMetrics } from '@/api/types';
import { 
  Brain, 
  Upload, 
  BarChart3, 
  Rocket,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [modelVersionInfo, setModelVersionInfo] = useState<ModelVersionInfo | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  const handleModelVersionChange = useCallback(async (modelName: string, version: string) => {
    setSelectedModel(modelName);
    setSelectedVersion(version);
    
    try {
      setLoading(true);
      setError(null);
      
      const [modelData, metricsData] = await Promise.all([
        apiClient.getModelVersionInfo(modelName, version),
        apiClient.getDashboardMetrics(modelName, version)
      ]);
      
      setModelVersionInfo(modelData);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Error loading data');
    } finally {
      setLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connection Error
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-space-50 to-space-100 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-space-500 to-space-700 rounded-2xl flex items-center justify-center animate-float">
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-space-600 to-space-800 bg-clip-text text-transparent mb-4">
              ExoClassifier
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Automatic exoplanet classifier using Machine Learning. 
              Discover new worlds with the help of artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/predict">
                <Button size="lg" className="w-full sm:w-auto">
                  <Brain className="w-5 h-5 mr-2" />
                  Classify Exoplanet
                </Button>
              </Link>
              <Link href="/upload">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Dataset
                </Button>
              </Link>
              <Link href="/train">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Brain className="w-5 h-5 mr-2" />
                  Train Model
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Model Selector */}
        <div className="mb-8">
          <ModelSelector onModelVersionChange={handleModelVersionChange} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-space-600" />
            <p className="text-gray-600">Loading model data...</p>
          </div>
        )}

        {/* Metrics Cards */}
        {modelVersionInfo && metrics && !loading && (
          <>
            <MetricsCards modelVersionInfo={modelVersionInfo} metrics={metrics} className="mb-8" />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ClassDistributionChart data={metrics.class_distribution} />
          <ClassBreakdown metrics={metrics} />
        </div>

            {/* Confusion Matrix */}
            <div className="mb-8">
              <ConfusionMatrixChart data={metrics.confusion_matrix} />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link href="/predict">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Brain className="w-8 h-8 text-space-600 mx-auto mb-2" />
                          <h3 className="font-semibold mb-1">Individual Classification</h3>
                          <p className="text-sm text-gray-600">
                            Classify an exoplanet by entering its parameters
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/upload">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-space-600 mx-auto mb-2" />
                          <h3 className="font-semibold mb-1">Batch Processing</h3>
                          <p className="text-sm text-gray-600">
                            Upload a CSV file to classify multiple exoplanets
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/train">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Brain className="w-8 h-8 text-space-600 mx-auto mb-2" />
                          <h3 className="font-semibold mb-1">Train Model</h3>
                          <p className="text-sm text-gray-600">
                            Configure hyperparameters and train new models
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/model-info">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <BarChart3 className="w-8 h-8 text-space-600 mx-auto mb-2" />
                          <h3 className="font-semibold mb-1">Model Information</h3>
                          <p className="text-sm text-gray-600">
                            Technical details and performance metrics
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
