'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/api/client';
import { ModelInfo, ModelVersions } from '@/api/types';
import { Brain, GitBranch, Loader2 } from 'lucide-react';

interface ModelSelectorProps {
  onModelVersionChange: (modelName: string, version: string) => void;
  className?: string;
}

export function ModelSelector({ onModelVersionChange, className }: ModelSelectorProps) {
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
          onModelVersionChange(selectedModel, latestVersion);
        }
      } catch (err) {
        console.error('Error loading versions:', err);
        setError(err instanceof Error ? err.message : 'Error loading versions');
      } finally {
        setLoading(false);
      }
    };

    loadVersions();
  }, [selectedModel]); // Removed onModelVersionChange from dependencies

  // Handle version change
  const handleVersionChange = useCallback((version: string) => {
    setSelectedVersion(version);
    onModelVersionChange(selectedModel, version);
  }, [selectedModel, onModelVersionChange]);

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
          Model Selection
        </CardTitle>
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

        {/* Model Info */}
        {modelInfo && selectedModel && (
          <div className="pt-4 border-t">
            <div className="text-sm text-gray-600">
              <p><strong>Current model:</strong> {modelInfo.current_model.name}</p>
              <p><strong>Current version:</strong> {modelInfo.current_model.version}</p>
              <p><strong>Classes:</strong> {modelInfo.current_model.classes.join(', ')}</p>
              <p><strong>Total models:</strong> {modelInfo.total_models}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
