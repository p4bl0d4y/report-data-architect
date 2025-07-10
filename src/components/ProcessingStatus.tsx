
import React from 'react';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProcessingStatusProps {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  currentStep: string;
  error?: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ 
  status, 
  progress, 
  currentStep, 
  error 
}) => {
  if (status === 'idle') return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return 'Processing Financial Data';
      case 'completed':
        return 'Analysis Complete';
      case 'error':
        return 'Processing Failed';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-700';
      case 'completed':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center space-x-4">
        {getStatusIcon()}
        <div className="flex-1">
          <h3 className={`font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </h3>
          {status === 'processing' && (
            <>
              <p className="text-sm text-gray-600 mt-1">{currentStep}</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </>
          )}
          {status === 'completed' && (
            <p className="text-sm text-green-600 mt-1">
              EBITDA and DCF reports have been generated successfully
            </p>
          )}
          {status === 'error' && error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProcessingStatus;
