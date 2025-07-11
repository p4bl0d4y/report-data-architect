
import React, { useState } from 'react';
import { BarChart3, FileSpreadsheet, TrendingUp, PieChart, Brain } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import ProcessingStatus from '@/components/ProcessingStatus';
import FinancialDashboard from '@/components/FinancialDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface ReportData {
  id: string;
  timestamp: string;
  reportType: 'EBITDA' | 'DCF' | 'P&L';
  ebitda?: number | null;
  dcf?: number | null;
  profitAndLoss?: {
    revenue: number;
    cogs: number;
    grossProfit: number;
    operatingExpenses: number;
    netIncome: number;
  };
  monthlyBreakdown?: Array<{ month: string; value: number }>;
  downloadUrl?: string;
}

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [reportsData, setReportsData] = useState<ReportData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');

  // Mock historical data for demonstration
  const mockHistoricalData: ReportData[] = [
    {
      id: 'historical-1',
      timestamp: '2024-06-15T10:30:00Z',
      reportType: 'EBITDA',
      ebitda: 1180000,
      monthlyBreakdown: [
        { month: 'Jan', value: 350000 },
        { month: 'Feb', value: 420000 },
        { month: 'Mar', value: 410000 }
      ],
      downloadUrl: '/api/download-historical-ebitda'
    },
    {
      id: 'historical-2',
      timestamp: '2024-06-15T10:30:00Z',
      reportType: 'DCF',
      dcf: 14500000,
      downloadUrl: '/api/download-historical-dcf'
    },
    {
      id: 'historical-3',
      timestamp: '2024-06-15T10:30:00Z',
      reportType: 'P&L',
      profitAndLoss: {
        revenue: 4800000,
        cogs: 1900000,
        grossProfit: 2400000,
        operatingExpenses: 1650000,
        netIncome: 750000
      },
      downloadUrl: '/api/download-historical-pl'
    }
  ];

  const simulateProcessing = async (file: File) => {
    setIsProcessing(true);
    setProcessingStatus('processing');
    setError(null);
    
    const steps = [
      'Reading Excel file...',
      'Parsing financial data...',
      'Calculating EBITDA...',
      'Performing DCF analysis...',
      'Generating P&L report...',
      'Creating charts and visualizations...',
      'Generating AI analysis...',
      'Finalizing comprehensive report...'
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      // Simulate comprehensive financial analysis with multiple reports
      const mockReports: ReportData[] = [
        {
          id: 'report-1',
          timestamp: new Date().toISOString(),
          reportType: 'EBITDA',
          ebitda: 1250000 + Math.random() * 500000,
          monthlyBreakdown: [
            { month: 'Jan', value: 400000 + Math.random() * 100000 },
            { month: 'Feb', value: 380000 + Math.random() * 100000 },
            { month: 'Mar', value: 420000 + Math.random() * 100000 },
            { month: 'Apr', value: 450000 + Math.random() * 100000 },
            { month: 'May', value: 430000 + Math.random() * 100000 },
            { month: 'Jun', value: 480000 + Math.random() * 100000 }
          ],
          downloadUrl: '/api/download-ebitda-report'
        },
        {
          id: 'report-2',
          timestamp: new Date().toISOString(),
          reportType: 'DCF',
          dcf: 15000000 + Math.random() * 5000000,
          downloadUrl: '/api/download-dcf-report'
        },
        {
          id: 'report-3',
          timestamp: new Date().toISOString(),
          reportType: 'P&L',
          profitAndLoss: {
            revenue: 5000000 + Math.random() * 2000000,
            cogs: 2000000 + Math.random() * 800000,
            grossProfit: 2500000 + Math.random() * 800000,
            operatingExpenses: 1800000 + Math.random() * 600000,
            netIncome: 800000 + Math.random() * 300000
          },
          downloadUrl: '/api/download-pl-report'
        }
      ];

      setReportsData(mockReports);
      setProcessingStatus('completed');
      setCurrentView('dashboard'); // Navigate to dashboard after processing
      
      toast({
        title: "Comprehensive Analysis Complete",
        description: "Your financial reports with P&L analysis and AI insights have been generated successfully.",
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

  const handleViewHistory = () => {
    setCurrentView('dashboard');
    setReportsData(mockHistoricalData);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setProcessingStatus('idle');
    setReportsData([]);
    setError(null);
  };

  if (currentView === 'dashboard') {
    return (
      <FinancialDashboard
        reportsData={reportsData}
        isLoading={false}
        error={null}
        onBackToHome={handleBackToHome}
      />
    );
  }

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
            Comprehensive Financial Analysis Suite
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload your Excel financial data to generate comprehensive EBITDA, DCF, P&L reports with AI-powered insights
          </p>
        </div>

        {/* Enhanced Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">EBITDA & DCF</h3>
              <p className="text-gray-600">
                Automated calculation of profitability and valuation metrics
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-4">
              <PieChart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">P&L Analysis</h3>
              <p className="text-gray-600">
                Detailed profit & loss statements with visual breakdowns
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-4">
              <Brain className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Insights</h3>
              <p className="text-gray-600">
                AI-generated analysis and recommendations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleViewHistory}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Historical Reports
            </button>
          </div>

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
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Powered by advanced financial modeling algorithms and AI analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
