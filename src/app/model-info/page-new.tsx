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
  Target, 
  TrendingUp, 
  Database,
  FileText,
  Activity,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu,
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
        setError(err instanceof Error ? err.message : 'Error al cargar la información del modelo');
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
          <p className="text-gray-600">Cargando información del modelo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
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
              Volver al Dashboard
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-space-500 to-space-700 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-space-600 to-space-800 bg-clip-text text-transparent mb-2">
              Información del Modelo
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Detalles técnicos, métricas de rendimiento y configuración del clasificador de exoplanetas.
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
                  Información General del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total de Modelos</label>
                    <p className="text-2xl font-bold text-space-600 mt-1">
                      {modelInfo.total_models}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Modelo Actual</label>
                    <p className="text-lg font-semibold mt-1">
                      {modelInfo.current_model.name}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Versión Actual</label>
                    <p className="text-lg font-semibold mt-1">
                      {modelInfo.current_model.version}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Clases Soportadas</label>
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
                  <label className="text-sm font-medium text-gray-500">Conjuntos de Datos de Entrenamiento</label>
                  <div className="mt-2 space-y-2">
                    {modelInfo.current_model.trained_on.map((dataset, index) => (
                      <div key={index} className="flex items-center text-sm p-2 bg-gray-50 rounded-lg">
                        <Database className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium">{dataset}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-space-600" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Ver Dashboard
                  </Button>
                </Link>
                
                <Link href="/predict">
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="w-4 h-4 mr-2" />
                    Clasificar Exoplaneta
                  </Button>
                </Link>
                
                <Link href="/upload">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Subir CSV
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
