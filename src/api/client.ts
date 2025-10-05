import {
  ExoplanetData,
  PredictionRequest,
  PredictionResponse,
  PredictionParams,
  ModelInfo,
  ModelInfoDetailed,
  ModelVersions,
  ModelVersionInfo,
  DashboardMetrics,
  UploadResponse,
  TrainingParams,
  TrainingResponse,
  ApiError,
  ConfusionMatrix,
  ClassDistribution
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  // Model endpoints
  async getModelInfo(): Promise<ModelInfo> {
    return this.request<ModelInfo>('/model/info');
  }

  async getModelVersions(modelName: string): Promise<ModelVersions> {
    return this.request<ModelVersions>(`/model-versions/${modelName}`);
  }

  async getModelVersionInfo(modelName: string, version: string): Promise<ModelVersionInfo> {
    return this.request<ModelVersionInfo>(`/model-info/${modelName}/${version}`);
  }

  async getModelInfoDetailed(modelName: string): Promise<ModelInfoDetailed> {
    return this.request<ModelInfoDetailed>(`/model-info/${modelName}`);
  }

  // Prediction endpoints
  async predict(data: ExoplanetData[], params?: PredictionParams): Promise<PredictionResponse> {
    const queryParams = new URLSearchParams();
    if (params?.model_name) queryParams.append('model_name', params.model_name);
    if (params?.version) queryParams.append('version', params.version);
    
    const url = `/predict${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return this.request<PredictionResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
  }

  async uploadFile(file: File, params?: PredictionParams): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const queryParams = new URLSearchParams();
    if (params?.model_name) queryParams.append('model_name', params.model_name);
    if (params?.version) queryParams.append('version', params.version);
    
    const url = `${this.baseUrl}/predict/upload${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async downloadFile(filename: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/download/${filename}`);
    
    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  }

  // Training endpoint
  async trainModel(params: TrainingParams): Promise<TrainingResponse> {
    return this.request<TrainingResponse>('/train', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  }

  // Dashboard endpoints
  async getDashboardMetrics(modelName: string, version: string): Promise<DashboardMetrics> {
    const modelVersionInfo = await this.getModelVersionInfo(modelName, version);
    
    // Transform the data to match DashboardMetrics interface
    const confusionMatrix: ConfusionMatrix = {
      'CANDIDATE': {
        'CANDIDATE': modelVersionInfo.confusion_matrix[0][0],
        'CONFIRMED': modelVersionInfo.confusion_matrix[0][1],
        'FALSE POSITIVE': modelVersionInfo.confusion_matrix[0][2]
      },
      'CONFIRMED': {
        'CANDIDATE': modelVersionInfo.confusion_matrix[1][0],
        'CONFIRMED': modelVersionInfo.confusion_matrix[1][1],
        'FALSE POSITIVE': modelVersionInfo.confusion_matrix[1][2]
      },
      'FALSE POSITIVE': {
        'CANDIDATE': modelVersionInfo.confusion_matrix[2][0],
        'CONFIRMED': modelVersionInfo.confusion_matrix[2][1],
        'FALSE POSITIVE': modelVersionInfo.confusion_matrix[2][2]
      }
    };

    // Calculate class distribution from confusion matrix
    const classDistribution: ClassDistribution = {
      'CANDIDATE': modelVersionInfo.confusion_matrix[0].reduce((sum, val) => sum + val, 0),
      'CONFIRMED': modelVersionInfo.confusion_matrix[1].reduce((sum, val) => sum + val, 0),
      'FALSE POSITIVE': modelVersionInfo.confusion_matrix[2].reduce((sum, val) => sum + val, 0)
    };

    return {
      confusion_matrix: confusionMatrix,
      class_distribution: classDistribution
    };
  }

  // Training endpoints
  async trainModel(params: TrainingParams): Promise<TrainingResponse> {
    return this.request<TrainingResponse>('/train', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    try {
      return await this.request<{ status: string }>('/health');
    } catch {
      // If health endpoint doesn't exist, try model info as fallback
      await this.getModelInfo();
      return { status: 'ok' };
    }
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
