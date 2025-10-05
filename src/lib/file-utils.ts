/**
 * Utility functions for file path handling
 */

/**
 * Extracts the filename from a full file path
 * @param filePath - The full file path (e.g., "models/hgb_exoplanet_model/v1.0.6/model.pkl")
 * @returns The filename only (e.g., "model.pkl")
 */
export function getFileName(filePath: string): string {
  if (!filePath) return '';
  
  // Split by '/' and get the last part
  const parts = filePath.split('/');
  return parts[parts.length - 1] || filePath;
}

/**
 * Extracts the file extension from a filename
 * @param fileName - The filename (e.g., "model.pkl")
 * @returns The file extension (e.g., "pkl")
 */
export function getFileExtension(fileName: string): string {
  if (!fileName) return '';
  
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

/**
 * Gets a human-readable file type description
 * @param fileName - The filename (e.g., "model.pkl")
 * @returns A human-readable description (e.g., "Modelo entrenado")
 */
export function getFileTypeDescription(fileName: string): string {
  const extension = getFileExtension(fileName).toLowerCase();
  
  switch (extension) {
    case 'pkl':
      return 'Modelo entrenado';
    case 'json':
      return 'Métricas de clasificación';
    case 'npy':
      return 'Matriz de confusión';
    case 'csv':
      return 'Dataset de entrenamiento';
    default:
      return 'Archivo de datos';
  }
}
