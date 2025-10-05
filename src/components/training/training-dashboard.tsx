'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/api/client';
import { TrainingParams, TrainingResponse, TrainingProgress } from '@/api/types';
import { 
  Brain, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Settings,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface TrainingDashboardProps {
  className?: string;
}

export function TrainingDashboard({ className }: TrainingDashboardProps) {
  const [params, setParams] = useState<TrainingParams>({
    learning_rate: 0.1,
    max_leaf_nodes: 50,
    min_samples_leaf: 20,
    early_stopping: true,
  });

  const [progress, setProgress] = useState<TrainingProgress>({
    status: 'idle',
  });

  const [result, setResult] = useState<TrainingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParamChange = (key: keyof TrainingParams, value: string | boolean) => {
    setParams(prev => ({
      ...prev,
      [key]: typeof value === 'string' ? parseFloat(value) : value,
    }));
  };

  const handleTrain = async () => {
    try {
      setProgress({ status: 'training', progress: 0, message: 'Starting training...' });
      setError(null);
      setResult(null);

      // Simulate progress during training
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev.progress && prev.progress < 90) {
            return {
              ...prev,
              progress: prev.progress + Math.random() * 10,
              message: 'Training model...',
            };
          }
          return prev;
        });
      }, 1000);

      const response = await apiClient.trainModel(params);
      
      clearInterval(progressInterval);
      
      setProgress({ 
        status: 'completed', 
        progress: 100, 
        message: 'Training completed successfully!' 
      });
      setResult(response);

    } catch (err) {
      setProgress({ 
        status: 'error', 
        message: err instanceof Error ? err.message : 'Error during training' 
      });
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'training':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-nasa-red" />;
      default:
        return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'training':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-nasa-red/20 text-nasa-red';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-space-600" />
            Training Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Configure hyperparameters and train a new exoplanet classification model.
          </p>
        </CardContent>
      </Card>

      {/* Training Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Training Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Learning Rate */}
            <div className="space-y-2">
              <Label htmlFor="learning_rate" className="flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                Learning Rate
              </Label>
              <Input
                id="learning_rate"
                type="number"
                step="0.01"
                min="0.001"
                max="1"
                value={params.learning_rate}
                onChange={(e) => handleParamChange('learning_rate', e.target.value)}
                placeholder="0.1"
              />
              <p className="text-xs text-gray-500">
                Controls how fast the model learns (0.001 - 1.0)
              </p>
            </div>

            {/* Max Leaf Nodes */}
            <div className="space-y-2">
              <Label htmlFor="max_leaf_nodes" className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Max Leaf Nodes
              </Label>
              <Input
                id="max_leaf_nodes"
                type="number"
                min="2"
                max="1000"
                value={params.max_leaf_nodes}
                onChange={(e) => handleParamChange('max_leaf_nodes', e.target.value)}
                placeholder="50"
              />
              <p className="text-xs text-gray-500">
                Limits model complexity (2 - 1000)
              </p>
            </div>

            {/* Min Samples Leaf */}
            <div className="space-y-2">
              <Label htmlFor="min_samples_leaf" className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Min Samples per Leaf
              </Label>
              <Input
                id="min_samples_leaf"
                type="number"
                min="1"
                max="100"
                value={params.min_samples_leaf}
                onChange={(e) => handleParamChange('min_samples_leaf', e.target.value)}
                placeholder="20"
              />
              <p className="text-xs text-gray-500">
                Prevents overfitting (1 - 100)
              </p>
            </div>

            {/* Early Stopping */}
            <div className="space-y-2">
              <Label htmlFor="early_stopping" className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Early Stopping
              </Label>
              <div className="flex items-center space-x-2">
                <input
                  id="early_stopping"
                  type="checkbox"
                  checked={params.early_stopping}
                  onChange={(e) => handleParamChange('early_stopping', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="early_stopping" className="text-sm">
                  Enable early stopping
                </Label>
              </div>
              <p className="text-xs text-gray-500">
                Stops training if no improvement
              </p>
            </div>
          </div>

          {/* Train Button */}
          <div className="pt-4">
            <Button
              onClick={handleTrain}
              disabled={progress.status === 'training'}
              className="w-full md:w-auto"
              size="lg"
            >
              {progress.status === 'training' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Training...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start Training
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Training Progress */}
      {progress.status !== 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {getStatusIcon()}
              <span className="ml-2">Training Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor()}>
                {progress.status === 'training' && 'Training'}
                {progress.status === 'completed' && 'Completed'}
                {progress.status === 'error' && 'Error'}
              </Badge>
              {progress.progress && (
                <span className="text-sm text-gray-600">
                  {Math.round(progress.progress)}%
                </span>
              )}
            </div>

            {progress.progress && (
              <Progress value={progress.progress} className="w-full" />
            )}

            {progress.message && (
              <p className="text-sm text-gray-600">{progress.message}</p>
            )}

            {error && (
              <div className="p-3 bg-nasa-red/10 border border-nasa-red/30 rounded-md">
                <p className="text-sm text-nasa-red">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Training Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Training Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">New Version</h4>
                <p className="text-2xl font-bold text-green-600">{result.model_version}</p>
              </div>
              
              {result.accuracy && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Accuracy</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {(result.accuracy * 100).toFixed(2)}%
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Parameters Used</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Learning Rate:</span>
                  <span className="ml-1 font-medium">{result.used_params.learning_rate}</span>
                </div>
                <div>
                  <span className="text-gray-600">Max Leaf Nodes:</span>
                  <span className="ml-1 font-medium">{result.used_params.max_leaf_nodes}</span>
                </div>
                <div>
                  <span className="text-gray-600">Min Samples Leaf:</span>
                  <span className="ml-1 font-medium">{result.used_params.min_samples_leaf}</span>
                </div>
                <div>
                  <span className="text-gray-600">Early Stopping:</span>
                  <span className="ml-1 font-medium">
                    {result.used_params.early_stopping ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {result.message && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-600">{result.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
