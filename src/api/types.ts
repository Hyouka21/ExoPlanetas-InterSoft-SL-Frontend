// Types based on the Swagger API specification

export interface ExoplanetData {
  koi_period: number;
  koi_duration: number;
  koi_depth: number;
  koi_prad: number;
  koi_steff: number;
  koi_slogg: number;
  koi_srad: number;
  koi_smass: number;
  koi_teq: number;
  koi_insol: number;
  koi_dor: number;
  koi_limbdark_mod: number;
  koi_ldm_coeff4: number;
  koi_ldm_coeff3: number;
  koi_ldm_coeff2: number;
  koi_ldm_coeff1: number;
  koi_ldm_coeff0: number;
  koi_impact: number;
  koi_dor_err1: number;
  koi_dor_err2: number;
  koi_ror: number;
  koi_ror_err1: number;
  koi_ror_err2: number;
  koi_impact_err1: number;
  koi_impact_err2: number;
  koi_duration_err1: number;
  koi_duration_err2: number;
  koi_period_err1: number;
  koi_period_err2: number;
  koi_time0bk: number;
  koi_time0bk_err1: number;
  koi_time0bk_err2: number;
  koi_depth_err1: number;
  koi_depth_err2: number;
  koi_ingress: number;
  koi_ingress_err1: number;
  koi_ingress_err2: number;
  koi_steff_err1: number;
  koi_steff_err2: number;
  koi_slogg_err1: number;
  koi_slogg_err2: number;
  koi_srad_err1: number;
  koi_srad_err2: number;
  koi_smass_err1: number;
  koi_smass_err2: number;
  koi_teq_err1: number;
  koi_teq_err2: number;
  koi_insol_err1: number;
  koi_insol_err2: number;
}

export type ExoplanetClass = 'CONFIRMED' | 'CANDIDATE' | 'FALSE POSITIVE';

export interface PredictionResult {
  class: ExoplanetClass;
  probabilities: Record<ExoplanetClass, number>;
}

export interface PredictionRequest {
  data: ExoplanetData[];
}

export interface PredictionResponse {
  predictions: PredictionResult[];
}

export interface ModelInfo {
  available_models: string[];
  total_models: number;
  current_model: {
    name: string;
    version: string;
    trained_on: string[];
    classes: ExoplanetClass[];
  };
  models_summary: Array<{
    model_name: string;
    latest_version: string;
    total_versions: number;
    versions: string[];
    accuracy: number;
  }>;
}

export interface ModelVersions {
  model_name: string;
  versions: string[];
  total_versions: number;
  latest_version: string;
}

export interface ModelVersionInfo {
  model_name: string;
  version: string;
  metrics: {
    accuracy: number;
    'macro avg'?: {
      precision: number;
      recall: number;
      'f1-score': number;
      support: number;
    };
    'weighted avg'?: {
      precision: number;
      recall: number;
      'f1-score': number;
      support: number;
    };
    [key: string]: any;
  };
  confusion_matrix: number[][];
  files: {
    model: string;
    metrics: string;
    matrix: string;
  };
  model_exists: boolean;
}

export interface ModelInfoDetailed {
  model_name: string;
  model_path: string;
  metrics: Record<string, any>;
  confusion_matrix: number[][];
  files: {
    metrics: string;
    matrix: string;
  };
}

export interface ConfusionMatrix {
  [key: string]: {
    [key: string]: number;
  };
}

export interface ClassDistribution {
  [key: string]: number;
}

// Training types
export interface TrainingParams {
  learning_rate: number;
  max_leaf_nodes: number;
  min_samples_leaf: number;
  early_stopping: boolean;
}

export interface TrainingResponse {
  status: string;
  model_version: string;
  used_params: TrainingParams;
  training_time?: number;
  accuracy?: number;
  message?: string;
}

export interface TrainingProgress {
  status: 'idle' | 'training' | 'completed' | 'error';
  progress?: number;
  message?: string;
  current_epoch?: number;
  total_epochs?: number;
}

// Prediction parameters
export interface PredictionParams {
  model_name?: string;
  version?: string;
}

export interface PredictionRequest {
  data: ExoplanetData[];
}

export interface PredictionResponse {
  predictions: Array<{
    class: string;
    probabilities: {
      CANDIDATE: number;
      CONFIRMED: number;
      'FALSE POSITIVE': number;
    };
  }>;
  model_info: {
    model_name: string;
    version: string;
    used_model: string;
  };
}

export interface DashboardMetrics {
  confusion_matrix: ConfusionMatrix;
  class_distribution: ClassDistribution;
}

export interface UploadResponse {
  total_planets: number;
  class_distribution: ClassDistribution;
  download_url: string;
}

export interface TrainingParams {
  learning_rate?: number;
  max_leaf_nodes?: number;
  min_samples_leaf?: number;
  early_stopping?: boolean;
}

export interface TrainingResponse {
  status: string;
  model_version: string;
  used_params: TrainingParams;
}

export interface ApiError {
  detail: string;
}