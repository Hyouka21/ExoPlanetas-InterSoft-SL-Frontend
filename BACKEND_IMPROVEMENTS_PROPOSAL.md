# 🚀 Propuesta de Mejoras al Backend - Endpoints de Métricas

## 📋 **Resumen Ejecutivo**

Se propone la creación de nuevos endpoints específicos para métricas de modelos que reemplacen la exposición de rutas de archivos del sistema por datos estructurados y útiles para el usuario final.

## 🎯 **Objetivos**

1. **Eliminar exposición de rutas del sistema** en respuestas de la API
2. **Proporcionar métricas estructuradas** directamente desde archivos JSON
3. **Mejorar la experiencia del usuario** con datos relevantes y legibles
4. **Mantener compatibilidad** con el frontend existente
5. **Facilitar la extensibilidad** para futuras versiones de modelos

## 🔍 **Análisis del Estado Actual**

### **Problemas Identificados:**
- ✅ **Rutas expuestas**: `/Users/gaston/Documents/.../model.pkl`
- ✅ **Datos no estructurados**: Archivos JSON no se leen automáticamente
- ✅ **Información técnica**: No útil para usuarios finales
- ✅ **Inconsistencia**: Diferentes formatos entre endpoints

### **Datos Disponibles Actualmente:**
```json
{
  "model_name": "hgb_exoplanet_model",
  "version": "v1.0.6",
  "model_path": "/Users/gaston/Documents/.../model.pkl",  // ❌ Ruta del sistema
  "files": {
    "metrics": "/Users/gaston/Documents/.../classification_report.json",  // ❌ Ruta del sistema
    "matrix": "/Users/gaston/Documents/.../confusion_matrix.npy"  // ❌ Ruta del sistema
  },
  "metrics": {
    "accuracy": 0.9313349599163472,
    "macro avg": { "precision": 0.9078, "recall": 0.9092, "f1-score": 0.9085 },
    "weighted avg": { "precision": 0.9318, "recall": 0.9313, "f1-score": 0.9315 }
  }
}
```

## 🛠️ **Propuesta de Nuevos Endpoints**

### **1. GET /models/metrics/{model_name}/{version}**
**Propósito**: Obtener métricas detalladas de un modelo específico

**Estructura de Respuesta Propuesta:**
```json
{
  "model_name": "hgb_exoplanet_model",
  "version": "v1.0.6",
  "training_info": {
    "training_date": "2024-01-15T10:30:00Z",
    "training_duration": 1800,
    "dataset_size": 2869,
    "features_count": 42,
    "algorithm": "HistGradientBoostingClassifier"
  },
  "performance_metrics": {
    "accuracy": 0.9313349599163472,
    "macro_avg": {
      "precision": 0.9078154687476448,
      "recall": 0.909212723442559,
      "f1_score": 0.9084739428081785,
      "support": 2869.0
    },
    "weighted_avg": {
      "precision": 0.9318169333784201,
      "recall": 0.9313349599163472,
      "f1_score": 0.9315364038361715,
      "support": 2869.0
    }
  },
  "class_metrics": {
    "CANDIDATE": {
      "precision": 0.8559322033898306,
      "recall": 0.8430717863105175,
      "f1_score": 0.849453322119428,
      "support": 599.0
    },
    "CONFIRMED": {
      "precision": 0.8934426229508197,
      "recall": 0.9159663865546218,
      "f1_score": 0.9045643153526971,
      "support": 833.0
    },
    "FALSE POSITIVE": {
      "precision": 0.9950877192982456,
      "recall": 0.9867780097425192,
      "f1_score": 0.9909154437456325,
      "support": 1437.0
    }
  },
  "confusion_matrix": [[505, 90, 4], [67, 763, 3], [18, 1, 1418]],
  "model_status": "active"
}
```

### **2. GET /models/versions/{model_name}**
**Propósito**: Listar todas las versiones disponibles de un modelo

**Estructura de Respuesta Propuesta:**
```json
{
  "model_name": "hgb_exoplanet_model",
  "versions": [
    {
      "version": "v1.0.6",
      "is_latest": true,
      "training_date": "2024-01-15T10:30:00Z",
      "accuracy": 0.9313349599163472,
      "status": "active"
    },
    {
      "version": "v1.0.5",
      "is_latest": false,
      "training_date": "2024-01-10T14:20:00Z",
      "accuracy": 0.9284567890123456,
      "status": "archived"
    }
  ],
  "total_versions": 2,
  "latest_version": "v1.0.6"
}
```

### **3. GET /models/confusion-matrix/{model_name}/{version}**
**Propósito**: Obtener matriz de confusión en formato estructurado

**Estructura de Respuesta Propuesta:**
```json
{
  "model_name": "hgb_exoplanet_model",
  "version": "v1.0.6",
  "confusion_matrix": {
    "labels": ["CANDIDATE", "CONFIRMED", "FALSE POSITIVE"],
    "matrix": [[505, 90, 4], [67, 763, 3], [18, 1, 1418]],
    "normalized": [[0.843, 0.150, 0.007], [0.080, 0.916, 0.004], [0.012, 0.001, 0.987]]
  },
  "summary": {
    "total_samples": 2869,
    "correct_predictions": 2686,
    "incorrect_predictions": 183,
    "overall_accuracy": 0.9313349599163472
  }
}
```

### **4. GET /models/info**
**Propósito**: Información general del sistema de modelos

**Estructura de Respuesta Propuesta:**
```json
{
  "system_info": {
    "total_models": 1,
    "active_models": 1,
    "total_versions": 6,
    "last_training": "2024-01-15T10:30:00Z"
  },
  "current_model": {
    "name": "hgb_exoplanet_model",
    "version": "v1.0.6",
    "status": "active",
    "accuracy": 0.9313349599163472
  },
  "available_models": [
    {
      "name": "hgb_exoplanet_model",
      "latest_version": "v1.0.6",
      "total_versions": 6,
      "status": "active",
      "last_updated": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## 🔧 **Implementación Propuesta**

### **Backend Changes Required:**

#### **1. Nuevo Servicio de Métricas**
```python
# services/metrics_service.py
class MetricsService:
    def __init__(self):
        self.models_base_path = "/path/to/models"
    
    def get_model_metrics(self, model_name: str, version: str) -> dict:
        """Lee archivos JSON de métricas y devuelve datos estructurados"""
        metrics_file = f"{self.models_base_path}/{model_name}/{version}/metrics/classification_report.json"
        # Leer y parsear JSON
        # Agregar metadatos de entrenamiento
        # Devolver estructura completa
    
    def get_model_versions(self, model_name: str) -> dict:
        """Lista versiones disponibles con metadatos"""
        # Escanear directorio de versiones
        # Leer metadatos de cada versión
        # Devolver lista estructurada
```

#### **2. Nuevos Endpoints FastAPI**
```python
# routers/models.py
@router.get("/models/metrics/{model_name}/{version}")
async def get_model_metrics(model_name: str, version: str):
    """Endpoint para métricas detalladas"""
    return metrics_service.get_model_metrics(model_name, version)

@router.get("/models/versions/{model_name}")
async def get_model_versions(model_name: str):
    """Endpoint para listar versiones"""
    return metrics_service.get_model_versions(model_name)
```

#### **3. Eliminación de Rutas del Sistema**
```python
# Antes (❌)
{
  "model_path": "/Users/gaston/Documents/.../model.pkl",
  "files": {
    "metrics": "/Users/gaston/Documents/.../classification_report.json"
  }
}

# Después (✅)
{
  "training_info": {
    "training_date": "2024-01-15T10:30:00Z",
    "dataset_size": 2869
  },
  "performance_metrics": {
    "accuracy": 0.9313349599163472
  }
}
```

## 🎨 **Integración con Frontend**

### **1. Actualización del API Client**
```typescript
// src/api/client.ts
class ApiClient {
  async getModelMetrics(modelName: string, version: string): Promise<ModelMetrics> {
    return this.request<ModelMetrics>(`/models/metrics/${modelName}/${version}`);
  }
  
  async getModelVersions(modelName: string): Promise<ModelVersions> {
    return this.request<ModelVersions>(`/models/versions/${modelName}`);
  }
}
```

### **2. Nuevos Tipos TypeScript**
```typescript
// src/api/types.ts
export interface ModelMetrics {
  model_name: string;
  version: string;
  training_info: {
    training_date: string;
    training_duration: number;
    dataset_size: number;
    features_count: number;
    algorithm: string;
  };
  performance_metrics: {
    accuracy: number;
    macro_avg: MetricsSummary;
    weighted_avg: MetricsSummary;
  };
  class_metrics: Record<string, ClassMetrics>;
  confusion_matrix: number[][];
  model_status: string;
}
```

### **3. Componentes Actualizados**
```typescript
// src/components/model/model-metrics-display.tsx
export function ModelMetricsDisplay({ modelMetrics }: { modelMetrics: ModelMetrics }) {
  // Usar datos estructurados en lugar de rutas
  const { training_info, performance_metrics, class_metrics } = modelMetrics;
  
  return (
    <div>
      <TrainingInfoCard info={training_info} />
      <PerformanceMetricsCard metrics={performance_metrics} />
      <ClassMetricsCard metrics={class_metrics} />
    </div>
  );
}
```

## 📊 **Beneficios Esperados**

### **Para el Usuario Final:**
- ✅ **Información relevante**: Métricas de rendimiento en lugar de rutas
- ✅ **Datos estructurados**: Fácil de leer y entender
- ✅ **Información completa**: Fecha de entrenamiento, tamaño del dataset, etc.
- ✅ **Mejor UX**: Interfaz más limpia y profesional

### **Para el Desarrollo:**
- ✅ **Mantenibilidad**: Código más limpio y organizado
- ✅ **Extensibilidad**: Fácil agregar nuevas métricas
- ✅ **Consistencia**: Formato unificado entre endpoints
- ✅ **Seguridad**: No exposición de rutas del sistema

### **Para el Sistema:**
- ✅ **Performance**: Lectura directa de archivos JSON
- ✅ **Escalabilidad**: Fácil manejo de múltiples versiones
- ✅ **Monitoreo**: Mejor tracking de métricas de modelos
- ✅ **Backup**: Metadatos preservados en la API

## 🚀 **Plan de Implementación**

### **Fase 1: Backend (1-2 días)**
1. Crear `MetricsService` para leer archivos JSON
2. Implementar nuevos endpoints
3. Actualizar endpoints existentes para eliminar rutas
4. Testing de endpoints

### **Fase 2: Frontend (1 día)**
1. Actualizar tipos TypeScript
2. Modificar API client
3. Actualizar componentes existentes
4. Testing de integración

### **Fase 3: Testing y Deploy (0.5 días)**
1. Testing end-to-end
2. Verificación de compatibilidad
3. Deploy y monitoreo

## 📝 **Consideraciones Técnicas**

### **Compatibilidad:**
- Mantener endpoints existentes durante transición
- Versionado de API para cambios breaking
- Fallbacks para datos faltantes

### **Performance:**
- Cache de métricas leídas
- Lazy loading de datos pesados
- Compresión de respuestas JSON

### **Seguridad:**
- Validación de parámetros de entrada
- Sanitización de rutas de archivos
- Rate limiting en endpoints

---

## 🎯 **Conclusión**

Esta propuesta elimina la exposición de rutas del sistema y proporciona una API más limpia y útil para el frontend, mejorando significativamente la experiencia del usuario y la mantenibilidad del código.

**Próximos pasos**: Implementar los nuevos endpoints en el backend y actualizar el frontend para consumir los datos estructurados.
