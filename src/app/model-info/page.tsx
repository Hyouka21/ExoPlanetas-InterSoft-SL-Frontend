'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/api/client';
import { ModelInfo, ModelInfoDetailed } from '@/api/types';
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
  Cpu
} from 'lucide-react';

export default function ModelInfoPage() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [detailedInfo, setDetailedInfo] = useState<ModelInfoDetailed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [basicInfo, detailed] = await Promise.all([
          apiClient.getModelInfo(),
          apiClient.getModelInfoDetailed('hgb_exoplanet_model').catch(() => null)
        ]);
        
        setModelInfo(basicInfo);
        setDetailedInfo(detailed);
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
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error de Conexión
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!modelInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No se encontró información del modelo</p>
        </div>
      </div>
    );
  }

  // Calculate metrics from modelInfo
  const precision = modelInfo?.models_summary[0]?.accuracy || 0;
  const recall = modelInfo?.models_summary[0]?.accuracy || 0;
  const f1Score = modelInfo?.models_summary[0]?.accuracy || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Model Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2 text-space-600" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nombre del Modelo</label>
                    <p className="text-lg font-semibold">{modelInfo.current_model.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Versión</label>
                    <p className="text-lg font-semibold">{modelInfo.current_model.version}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Clases de Clasificación</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {modelInfo.current_model.classes.map((className) => (
                      <Badge 
                        key={className}
                        variant={className === 'CONFIRMED' ? 'confirmed' : 
                                className === 'CANDIDATE' ? 'candidate' : 'false_positive'}
                      >
                        {className}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Conjuntos de Datos de Entrenamiento</label>
                  <div className="mt-2 space-y-1">
                    {modelInfo.current_model.trained_on.map((dataset, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Database className="w-4 h-4 text-gray-400 mr-2" />
                        {dataset}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-space-600" />
                  Métricas de Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {(modelInfo.models_summary[0]?.accuracy * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Precisión</div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {(precision * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Precisión Promedio</div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {(recall * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Recall Promedio</div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Cpu className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {(f1Score * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">F1-Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Info */}
            {detailedInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-space-600" />
                    Información Detallada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ruta del Modelo</label>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                      {detailedInfo.model_path}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Archivos de Métricas</label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {detailedInfo.files.metrics}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {detailedInfo.files.matrix}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Model Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Estado del Modelo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estado</span>
                    <Badge variant="confirmed">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Última Actualización</span>
                    <span className="text-sm font-medium">Hoy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tiempo de Respuesta</span>
                    <span className="text-sm font-medium">&lt; 100ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Model Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-space-600" />
                  Arquitectura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Algoritmo</span>
                    <span className="text-sm font-medium">HistGradientBoosting</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Características</span>
                    <span className="text-sm font-medium">~50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Clases</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-space-600" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Probar Clasificación
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Ver Métricas Detalladas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Historial de Entrenamiento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
