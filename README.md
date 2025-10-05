# ExoClassifier Frontend

Interfaz web moderna para el clasificador automático de exoplanetas utilizando Machine Learning. Esta aplicación permite a investigadores y usuarios generales interactuar con un modelo de ML que clasifica exoplanetas en tres categorías: CONFIRMED, CANDIDATE y FALSE_POSITIVE.

## 🚀 Estado del Proyecto

✅ **COMPLETADO** - Frontend completamente funcional conectado al backend real

## 🚀 Características

- **Dashboard Interactivo**: Visualización de métricas del modelo con gráficos dinámicos
- **Clasificación Individual**: Formulario para clasificar exoplanetas individuales
- **Procesamiento en Lote**: Subida de archivos CSV para procesamiento masivo
- **Información del Modelo**: Detalles técnicos y métricas de rendimiento
- **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- **Tema Moderno**: Interfaz limpia y profesional con Tailwind CSS

## 🛠️ Tecnologías

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Linting**: ESLint + Prettier

## 📁 Estructura del Proyecto

```
frontend/
├── public/                  # Assets estáticos
├── src/
│   ├── api/                 # Clientes API (mock + futuro fetch real)
│   │   └── index.ts         # Cliente API principal
│   ├── app/                 # Páginas de Next.js (App Router)
│   │   ├── layout.tsx       # Layout principal
│   │   ├── page.tsx         # Dashboard
│   │   ├── predict/         # Página de predicción
│   │   ├── upload/          # Página de subida de CSV
│   │   └── model-info/      # Información del modelo
│   ├── components/          # Componentes reutilizables
│   │   ├── charts/          # Gráficos con Recharts
│   │   ├── layout/          # Navbar, Footer
│   │   └── ui/              # Componentes base (Button, Card, etc.)
│   ├── hooks/               # Custom hooks
│   ├── styles/              # Estilos globales
│   └── utils/               # Funciones de ayuda
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+ 
- Backend del ExoClassifier ejecutándose en `http://localhost:8000`

### Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno** (opcional):
   ```bash
   # Crear archivo .env.local
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

### ⚠️ Importante

Asegúrate de que el backend esté ejecutándose en `http://localhost:8000` antes de usar la aplicación. El frontend se conecta directamente a los endpoints del backend según la especificación del Swagger.

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 📊 Páginas y Funcionalidades

### 1. Dashboard (`/`)
- Métricas generales del modelo (precisión, F1-score)
- Matriz de confusión interactiva
- Distribución de clases (gráfico de pastel)
- Importancia de características
- Acciones rápidas a otras secciones

### 2. Clasificador (`/predict`)
- Formulario para parámetros de exoplaneta
- Validación de datos en tiempo real
- Resultados con probabilidades por clase
- Explicaciones del modelo (feature importance)
- Información de confianza

### 3. Subida de CSV (`/upload`)
- Interfaz drag & drop para archivos CSV
- Validación de formato de archivo
- Progreso de procesamiento en tiempo real
- Resultados de procesamiento en lote
- Descarga de resultados

### 4. Información del Modelo (`/model-info`)
- Detalles técnicos del modelo
- Métricas de rendimiento detalladas
- Fuentes de datos de entrenamiento
- Historial de versiones
- Estado operativo

## 🔌 API Mock

El proyecto incluye una implementación mock completa de la API definida en el Swagger:

- **Autenticación**: `/auth/login`
- **Información del modelo**: `/model/info`
- **Predicciones**: `/predict` y `/predict/upload`
- **Métricas**: `/dashboard/metrics`
- **Entrenamiento**: `/train` (para futuras iteraciones)

Los mocks incluyen:
- Simulación de delays realistas
- Datos de ejemplo realistas
- Manejo de errores
- Respuestas estructuradas según el Swagger

## 🎨 Sistema de Diseño

### Colores
- **Primario**: Azul (#3B82F6)
- **Secundario**: Verde (#10B981)
- **Acento**: Púrpura (#8B5CF6)
- **Destructivo**: Rojo (#EF4444)
- **Advertencia**: Amarillo (#F59E0B)

### Componentes UI
- Basados en shadcn/ui
- Totalmente personalizables
- Accesibles (ARIA compliant)
- Responsivos
- Modo oscuro preparado

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navegación**: Menú hamburguesa en móviles
- **Gráficos**: Adaptables a diferentes tamaños de pantalla

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Exoplanet Classifier
```

### Tailwind CSS
Configuración personalizada en `tailwind.config.js`:
- Colores del sistema de diseño
- Animaciones personalizadas
- Utilidades específicas del proyecto

### TypeScript
Configuración estricta en `tsconfig.json`:
- Path mapping (`@/*`)
- Verificación de tipos estricta
- Compatibilidad con Next.js

## 🧪 Testing (Futuro)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t exoplanet-classifier .
docker run -p 3000:3000 exoplanet-classifier
```

### Build Estático
```bash
npm run build
npm run export
```

## 🔄 Próximas Iteraciones

### Iteración 2
- [ ] Conexión con API real del backend
- [ ] Autenticación JWT
- [ ] Control de roles y permisos
- [ ] Métricas en tiempo real
- [ ] Notificaciones push

### Iteración 3
- [ ] Tests automatizados
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)
- [ ] Modo oscuro
- [ ] Exportación de reportes

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollo Frontend**: [Tu Nombre]
- **Diseño UX/UI**: [Diseñador]
- **Backend/ML**: [Equipo de ML]

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: support@exoclassifier.com
- GitHub Issues: [Link al repositorio]
- Documentación: [Link a docs]

---

**Nota**: Este es un proyecto de demostración. Los datos y predicciones son simulados para fines de desarrollo y testing.
