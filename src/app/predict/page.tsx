'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/api/client';
import { ExoplanetData, PredictionResult, ExoplanetClass, PredictionParams } from '@/api/types';
import { ModelVersionSelector } from '@/components/model-version-selector';
import { 
  Brain, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Info,
  Zap
} from 'lucide-react';

const exoplanetFields = [
  { key: 'koi_period', label: 'Orbital Period (days)', description: 'Time it takes the planet to complete one orbit' },
  { key: 'koi_duration', label: 'Transit Duration (hours)', description: 'Duration of the planet transit' },
  { key: 'koi_depth', label: 'Transit Depth (ppm)', description: 'Decrease in star brightness during transit' },
  { key: 'koi_prad', label: 'Planetary Radius (R⊕)', description: 'Planet radius in Earth radii' },
  { key: 'koi_steff', label: 'Stellar Effective Temperature (K)', description: 'Effective temperature of the star' },
  { key: 'koi_slogg', label: 'Stellar Surface Gravity (log g)', description: 'Logarithm of stellar surface gravity' },
  { key: 'koi_srad', label: 'Stellar Radius (R☉)', description: 'Star radius in solar radii' },
  { key: 'koi_smass', label: 'Stellar Mass (M☉)', description: 'Star mass in solar masses' },
  { key: 'koi_teq', label: 'Equilibrium Temperature (K)', description: 'Planet equilibrium temperature' },
  { key: 'koi_insol', label: 'Insolation (S⊕)', description: 'Amount of stellar radiation received by the planet' },
];

const classIcons = {
  'CONFIRMED': CheckCircle,
  'CANDIDATE': AlertCircle,
  'FALSE POSITIVE': XCircle,
};

const classColors = {
  'CONFIRMED': 'confirmed',
  'CANDIDATE': 'candidate', 
  'FALSE POSITIVE': 'false_positive',
};

export default function PredictPage() {
  const [formData, setFormData] = useState<Partial<ExoplanetData>>({});
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionParams, setPredictionParams] = useState<PredictionParams>({});

  const handleInputChange = (key: string, value: string) => {
    const numValue = parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [key]: isNaN(numValue) ? undefined : numValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = exoplanetFields.map(field => field.key);
    const missingFields = requiredFields.filter(field => !formData[field as keyof ExoplanetData]);
    
    if (missingFields.length > 0) {
      setError(`Please complete all required fields`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPrediction(null);

      const response = await apiClient.predict([formData as ExoplanetData], predictionParams);
      setPrediction(response.predictions[0]);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'Error performing prediction');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (probability: number) => {
    if (probability >= 0.8) return 'text-green-600';
    if (probability >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-space-500 to-space-700 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-space-600 to-space-800 bg-clip-text text-transparent mb-2">
            Exoplanet Classifier
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter exoplanet parameters to automatically classify it 
            as CONFIRMED, CANDIDATE or FALSE POSITIVE.
          </p>
        </div>

        {/* Model and Version Selector */}
        <div className="mb-8">
          <ModelVersionSelector
            onSelectionChange={setPredictionParams}
            title="Model Configuration"
            description="Select the model and version to perform the prediction"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-space-600" />
                Exoplanet Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {exoplanetFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    <Input
                      id={field.key}
                      type="number"
                      step="any"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={formData[field.key as keyof ExoplanetData] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">{field.description}</p>
                  </div>
                ))}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Classifying...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Classify Exoplanet
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {prediction && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Classification Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Prediction */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      {(() => {
                        const Icon = classIcons[prediction.class];
                        return <Icon className="w-12 h-12 text-green-600" />;
                      })()}
                    </div>
                    <Badge 
                      variant={classColors[prediction.class] as any}
                      className="text-lg px-4 py-2 mb-2"
                    >
                      {prediction.class}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Classification with {((prediction.probabilities[prediction.class] || 0) * 100).toFixed(1)}% confidence
                    </p>
                  </div>

                  {/* Probabilities */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Class Probabilities:</h4>
                    {Object.entries(prediction.probabilities).map(([className, probability]) => (
                      <div key={className} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{className}</span>
                          <span className={`text-sm font-semibold ${getConfidenceColor(probability)}`}>
                            {(probability * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={probability * 100} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Interpretation */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-1">Interpretation:</h5>
                        <p className="text-sm text-blue-800">
                          {prediction.class === 'CONFIRMED' && 
                            'This exoplanet has been confirmed as a real planet through additional observations.'}
                          {prediction.class === 'CANDIDATE' && 
                            'This object is an exoplanet candidate that requires more observations for confirmation.'}
                          {prediction.class === 'FALSE POSITIVE' && 
                            'This object is probably not a real exoplanet, but a false positive caused by other phenomena.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-600" />
                  Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>CONFIRMED:</strong> Exoplanets verified through multiple detection methods.
                  </p>
                  <p>
                    <strong>CANDIDATE:</strong> Objects showing transit signals but requiring confirmation.
                  </p>
                  <p>
                    <strong>FALSE POSITIVE:</strong> Signals that appear to be transits but are caused by other phenomena.
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
