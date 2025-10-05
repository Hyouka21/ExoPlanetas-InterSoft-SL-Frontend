'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/api/client';
import { UploadResponse, ClassDistribution, PredictionParams } from '@/api/types';
import { ModelVersionSelector } from '@/components/model-version-selector';
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  X,
  Info,
  BarChart3
} from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [predictionParams, setPredictionParams] = useState<PredictionParams>({});

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Por favor selecciona un archivo CSV válido');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Por favor selecciona un archivo CSV válido');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      setResult(null);
      setUploadProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiClient.uploadFile(file, predictionParams);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setResult(response);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.download_url) return;

    try {
      const filename = result.download_url.split('/').pop() || 'predictions.csv';
      const blob = await apiClient.downloadFile(filename);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      setError('Error al descargar el archivo');
    }
  };

  const getClassColor = (className: string) => {
    switch (className.toLowerCase()) {
      case 'confirmed':
        return 'confirmed';
      case 'candidate':
        return 'candidate';
      case 'false_positive':
      case 'false positive':
        return 'false_positive';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-space-500 to-space-700 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-space-600 to-space-800 bg-clip-text text-transparent mb-2">
            Procesamiento en Lote
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sube un archivo CSV con datos de exoplanetas para clasificarlos automáticamente 
            y obtener resultados en lote.
          </p>
        </div>

        {/* Model and Version Selector */}
        <div className="mb-8">
          <ModelVersionSelector
            onSelectionChange={setPredictionParams}
            title="Configuración del Modelo"
            description="Selecciona el modelo y versión para procesar el archivo CSV"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-space-600" />
                Subir Archivo CSV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-space-500 bg-space-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <FileText className="w-12 h-12 text-space-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFile(null)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Upload className="w-12 h-12 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Arrastra tu archivo CSV aquí
                      </p>
                      <p className="text-sm text-gray-500">
                        o haz clic para seleccionar
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" asChild>
                        <span>Seleccionar Archivo</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Procesando archivo...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Procesar Archivo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Resultados del Procesamiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-space-600 mb-2">
                      {result.total_planets.toLocaleString()}
                    </div>
                    <p className="text-gray-600">Exoplanetas procesados</p>
                  </div>

                  {/* Class Distribution */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Distribución de Clases:
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(result.class_distribution).map(([className, count]) => (
                        <div key={className} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getClassColor(className) as any}>
                              {className.replace('_', ' ')}
                            </Badge>
                          </div>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={handleDownload}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Resultados
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-600" />
                  Formato del Archivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Formato requerido:</strong> Archivo CSV con las siguientes columnas:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>koi_period (período orbital en días)</li>
                    <li>koi_duration (duración del tránsito en horas)</li>
                    <li>koi_depth (profundidad del tránsito en ppm)</li>
                    <li>koi_prad (radio planetario en radios terrestres)</li>
                    <li>koi_steff (temperatura efectiva estelar en K)</li>
                    <li>Y otras características del exoplaneta...</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-3">
                    El archivo debe tener una fila de encabezados y los datos en las filas siguientes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
