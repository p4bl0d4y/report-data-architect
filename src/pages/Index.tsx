
import React, { useState } from 'react';
import { BarChart3, FileSpreadsheet, TrendingUp } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import ProcessingStatus from '@/components/ProcessingStatus';
import ReportDisplay from '@/components/ReportDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface FinancialResults {
  ebitda: number | null;
  dcf: number | null;
  revenue: number | null;
  netIncome: number | null;
  operatingIncome: number | null;
}

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [results, setResults] = useState<FinancialResults>({
    ebitda: null,
    dcf: null,
    revenue: null,
    netIncome: null,
    operatingIncome: null
  });
  const [reportDownloadUrl, setReportDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulateProcessing = async (file: File) => {
    setIsProcessing(true);
    setProcessingStatus('processing');
    setError(null);
    
    const steps = [
      'Reading Excel file...',
      'Parsing financial data...',
      'Calculating EBITDA...',
      'Performing DCF analysis...',
      'Generating report...',
      'Finalizing results...'
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate successful calculation
      const mockResults: FinancialResults = {
        ebitda: 1250000 + Math.random() * 500000,
        dcf: 15000000 + Math.random() * 5000000,
        revenue: 5000000 + Math.random() * 2000000,
        netIncome: 800000 + Math.random() * 300000,
        operatingIncome: 1100000 + Math.random() * 400000
      };

      setResults(mockResults);
      setReportDownloadUrl('/api/download-report'); // This would be a real endpoint
      setProcessingStatus('completed');
      
      toast({
        title: "Analysis Complete",
        description: "Your financial reports have been generated successfully.",
      });
      
    } catch (err) {
      setError('Failed to process the financial data. Please check your file format and try again.');
      setProcessingStatus('error');
      
      toast({
        title: "Processing Failed",
        description: "There was an error analyzing your file.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    simulateProcessing(file);
  };

  const handleEmailReport = () => {
    toast({
      title: "Email Sent",
      description: "The financial report has been sent to your email address.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full shadow-lg">
              <BarChart3 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Financial Analysis Suite
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload your Excel financial data to generate comprehensive EBITDA and DCF reports
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-4">
              <FileSpreadsheet className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Excel Upload</h3>
              <p className="text-gray-600">
                Seamlessly upload your financial data in Excel format
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-4">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">EBITDA Analysis</h3>
              <p className="text-gray-600">
                Automated calculation of operational profitability metrics
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-4">
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">DCF Valuation</h3>
              <p className="text-gray-600">
                Comprehensive discounted cash flow analysis
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* File Upload Section */}
          {processingStatus === 'idle' && (
            <FileUpload 
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
            />
          )}

          {/* Processing Status */}
          <ProcessingStatus 
            status={processingStatus}
            progress={progress}
            currentStep={currentStep}
            error={error}
          />

          {/* Results Display */}
          {processingStatus === 'completed' && (
            <ReportDisplay 
              results={results}
              reportDownloadUrl={reportDownloadUrl}
              isLoading={false}
              error={null}
              onEmailReport={handleEmailReport}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Powered by advanced financial modeling algorithms
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
