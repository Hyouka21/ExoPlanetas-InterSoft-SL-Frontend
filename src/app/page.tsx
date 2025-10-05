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
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
              <AlertCircle className="w-12 h-12 text-nasa-red mx-auto mb-4" />
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
    <div className="min-h-screen bg-galaxy-dark">
      {/* Hero Section */}
      <div className="gradient-nebula border-b border-nasa-cyan/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden animate-float shadow-2xl bg-nasa-cyan/20 backdrop-blur-sm border-2 border-nasa-cyan/50 space-glow">
                <Image 
                  src={`/interspace-img.png?v=${Date.now()}`}
                  alt="ExoClassifier Logo" 
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  style={{
                    clipPath: 'circle(50% at 50% 50%)',
                    objectPosition: 'center'
                  }}
                  priority
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-nasa-cyan to-nasa-blue bg-clip-text text-transparent mb-4 text-neon">
              ExoClassifier
            </h1>
            <p className="text-xl text-galaxy-primary mb-8 max-w-3xl mx-auto text-glow">
              Automatic exoplanet classifier using Machine Learning. 
              Discover new worlds with the help of artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/predict">
                <Button size="lg" className="w-full sm:w-auto bg-nasa-cyan hover:bg-nasa-cyan/80 text-galaxy-dark space-glow">
                  <Brain className="w-5 h-5 mr-2" />
                  Classify Exoplanet
                </Button>
              </Link>
              <Link href="/upload">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-nasa-cyan text-nasa-cyan hover:bg-nasa-cyan/10 space-border">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Dataset
                </Button>
              </Link>
              <Link href="/train">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-nasa-blue text-nasa-blue hover:bg-nasa-blue/10 space-border">
                  <Brain className="w-5 h-5 mr-2" />
                  Train Model
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-galaxy-dark">
        {/* Model Selector */}
        <div className="mb-8">
          <ModelSelector onModelVersionChange={handleModelVersionChange} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-nasa-cyan" />
            <p className="text-galaxy-primary">Loading model data...</p>
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
            <Card className="bg-galaxy-dark/50 border-nasa-cyan/30 space-glow">
              <CardHeader>
                <CardTitle className="flex items-center text-galaxy-primary">
                  <BarChart3 className="w-5 h-5 mr-2 text-nasa-cyan" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link href="/predict">
                    <Card className="hover:shadow-md transition-all duration-300 cursor-pointer bg-galaxy-dark/30 border-nasa-cyan/20 hover:border-nasa-cyan/50 hover:space-glow">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Brain className="w-8 h-8 text-nasa-cyan mx-auto mb-2" />
                          <h3 className="font-semibold mb-1 text-galaxy-primary">Individual Classification</h3>
                          <p className="text-sm text-galaxy-primary/70">
                            Classify an exoplanet by entering its parameters
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/upload">
                    <Card className="hover:shadow-md transition-all duration-300 cursor-pointer bg-galaxy-dark/30 border-nasa-cyan/20 hover:border-nasa-cyan/50 hover:space-glow">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-nasa-cyan mx-auto mb-2" />
                          <h3 className="font-semibold mb-1 text-galaxy-primary">Batch Processing</h3>
                          <p className="text-sm text-galaxy-primary/70">
                            Upload a CSV file to classify multiple exoplanets
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/train">
                    <Card className="hover:shadow-md transition-all duration-300 cursor-pointer bg-galaxy-dark/30 border-nasa-cyan/20 hover:border-nasa-cyan/50 hover:space-glow">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Brain className="w-8 h-8 text-nasa-cyan mx-auto mb-2" />
                          <h3 className="font-semibold mb-1 text-galaxy-primary">Train Model</h3>
                          <p className="text-sm text-galaxy-primary/70">
                            Configure hyperparameters and train new models
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/model-info">
                    <Card className="hover:shadow-md transition-all duration-300 cursor-pointer bg-galaxy-dark/30 border-nasa-cyan/20 hover:border-nasa-cyan/50 hover:space-glow">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <BarChart3 className="w-8 h-8 text-nasa-cyan mx-auto mb-2" />
                          <h3 className="font-semibold mb-1 text-galaxy-primary">Model Information</h3>
                          <p className="text-sm text-galaxy-primary/70">
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
