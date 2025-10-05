# Production Configuration

## Environment Variables for Render

### Frontend (exoplanetas-intersoft.onrender.com)
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://exoplanetas.onrender.com
```

### Backend (exoplanetas.onrender.com)
The backend should be configured with proper CORS settings to allow requests from:
- `https://exoplanetas-intersoft.onrender.com`

## API Endpoints

The frontend will make requests to:
- `https://exoplanetas.onrender.com/model/info`
- `https://exoplanetas.onrender.com/model-versions/{model_name}`
- `https://exoplanetas.onrender.com/model-info/{model_name}/{version}`
- `https://exoplanetas.onrender.com/predict`
- `https://exoplanetas.onrender.com/predict/upload`
- `https://exoplanetas.onrender.com/train`

## CORS Configuration

The backend must allow CORS requests from the frontend domain:
```python
# In your FastAPI backend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://exoplanetas-intersoft.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing the Connection

Test the backend directly:
```bash
curl https://exoplanetas.onrender.com/model/info
```

Should return:
```json
{
  "available_models": ["hgb_exoplanet_model"],
  "total_models": 1,
  "current_model": {
    "name": "HGBExoplanetModel",
    "version": "latest",
    "dataset_name": "kepler.csv",
    "classes": ["CANDIDATE", "CONFIRMED", "FALSE_POSITIVE"]
  }
}
```
