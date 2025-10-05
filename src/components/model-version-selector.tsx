'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/api/client';
import { ModelInfo, ModelVersions, PredictionParams } from '@/api/types';
import { Brain, GitBranch, Loader2 } from 'lucide-react';

interface ModelVersionSelectorProps {
  onSelectionChange: (params: PredictionParams) => void;
  className?: string;
  title?: string;
  description?: string;
}

export function ModelVersionSelector({ 
  onSelectionChange, 
  className,
  title = "Model and Version Selection",
  description = "Choose the model and version to perform predictions"
}: ModelVersionSelectorProps) {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [modelVersions, setModelVersions] = useState<ModelVersions | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load available models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const info = await apiClient.getModelInfo();
        setModelInfo(info);
        
        // Select first model by default
        if (info.available_models.length > 0) {
          const firstModel = info.available_models[0];
          setSelectedModel(firstModel);
        }
      } catch (err) {
        console.error('Error loading models:', err);
        setError(err instanceof Error ? err.message : 'Error loading models');
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  // Load versions when model changes
  useEffect(() => {
    if (!selectedModel) return;

    const loadVersions = async () => {
      try {
        setLoading(true);
        const versions = await apiClient.getModelVersions(selectedModel);
        setModelVersions(versions);
        
        // Select latest version by default
        if (versions.versions.length > 0) {
          const latestVersion = versions.latest_version;
          setSelectedVersion(latestVersion);
          onSelectionChange({
            model_name: selectedModel,
            version: latestVersion
          });
        }
      } catch (err) {
        console.error('Error loading versions:', err);
        setError(err instanceof Error ? err.message : 'Error loading versions');
      } finally {
        setLoading(false);
      }
    };

    loadVersions();
  }, [selectedModel, onSelectionChange]);

  // Handle version change
  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    onSelectionChange({
      model_name: selectedModel,
      version: version
    });
  };

  if (loading && !modelInfo) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading models...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="w-5 h-5 mr-2 text-space-600" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model-select">Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {modelInfo?.available_models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Version Selection */}
        <div className="space-y-2">
          <Label htmlFor="version-select" className="flex items-center">
            <GitBranch className="w-4 h-4 mr-1" />
            Version
          </Label>
          <Select 
            value={selectedVersion} 
            onValueChange={handleVersionChange}
            disabled={!selectedModel || loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a version" />
            </SelectTrigger>
            <SelectContent>
              {modelVersions?.versions.map((version) => (
                <SelectItem key={version} value={version}>
                  <div className="flex items-center">
                    {version}
                    {version === modelVersions.latest_version && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Latest
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Selection Info */}
        {selectedModel && selectedVersion && (
          <div className="pt-4 border-t">
            <div className="text-sm text-gray-600">
              <p><strong>Selected model:</strong> {selectedModel}</p>
              <p><strong>Selected version:</strong> {selectedVersion}</p>
              {modelVersions && (
                <p><strong>Total versions:</strong> {modelVersions.total_versions}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
