'use client';

export const dynamic = 'force-dynamic';

import { TrainingDashboard } from '@/components/training/training-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Info } from 'lucide-react';

export default function TrainPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-space-500 to-space-700 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-space-600 to-space-800 bg-clip-text text-transparent mb-2">
            Model Training
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Configure hyperparameters and train new classification models
          </p>
        </div>
        {/* Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              Training Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-nasa-cyan mb-2">Algorithm</h3>
                <p className="text-sm text-gray-600">
                  Uses Gradient Boosting for exoplanet classification
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-nasa-cyan mb-2">Dataset</h3>
                <p className="text-sm text-gray-600">
                  Trained with NASA Kepler and TESS data
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-nasa-cyan mb-2">Classes</h3>
                <p className="text-sm text-gray-600">
                  CANDIDATE, CONFIRMED, FALSE POSITIVE
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Dashboard */}
        <TrainingDashboard />
      </div>
    </div>
  );
}
