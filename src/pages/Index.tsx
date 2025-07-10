import React, { useState } from 'react';
import { BarChart3, FileSpreadsheet, TrendingUp, PieChart, Brain } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import ProcessingStatus from '@/components/ProcessingStatus';
import ReportDisplay from '@/components/ReportDisplay';
import OverallAnalysis from '@/components/OverallAnalysis';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface FinancialResults {
  ebitda: number | null;
  dcf: number | null;
  revenue: number | null;
  netIncome: number | null;
  operatingIncome: number | null;
  // P&L specific data
  grossProfit: number | null;
  totalExpenses: number | null;
  profitBeforeTax: number | null;
  // Chart data
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  expenseBreakdown: Array<{ category: string; amount: number }>;
  // Overall analysis
  aiGeneratedSummary: string | null;
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
    operatingIncome: null,
    grossProfit: null,
    totalExpenses: null,
    profitBeforeTax: null,
    monthlyRevenue: [],
    expenseBreakdown: [],
    aiGeneratedSummary: null
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

      // Simulate comprehensive financial analysis
      const mockResults: FinancialResults = {
        ebitda: 1250000 + Math.random() * 500000,
        dcf: 15000000 + Math.random() * 5000000,
        revenue: 5000000 + Math.random() * 2000000,
        netIncome: 800000 + Math.random() * 300000,
        operatingIncome: 1100000 + Math.random() * 400000,
        grossProfit: 2500000 + Math.random() * 800000,
        totalExpenses: 1800000 + Math.random() * 600000,
        profitBeforeTax: 900000 + Math.random() * 350000,
        monthlyRevenue: [
          { month: 'Jan', revenue: 400000 + Math.random() * 100000 },
          { month: 'Feb', revenue: 380000 + Math.random() * 100000 },
          { month: 'Mar', revenue: 420000 + Math.random() * 100000 },
          { month: 'Apr', revenue: 450000 + Math.random() * 100000 },
          { month: 'May', revenue: 430000 + Math.random() * 100000 },
          { month: 'Jun', revenue: 480000 + Math.random() * 100000 }
        ],
        expenseBreakdown: [
          { category: 'Operations', amount: 600000 + Math.random() * 200000 },
          { category: 'Marketing', amount: 300000 + Math.random() * 100000 },
          { category: 'Personnel', amount: 500000 + Math.random() * 150000 },
          { category: 'Administrative', amount: 200000 + Math.random() * 80000 },
          { category: 'Other', amount: 150000 + Math.random() * 60000 }
        ],
        aiGeneratedSummary: "Based on the financial analysis, the company shows strong operational performance with healthy EBITDA margins. Revenue growth is consistent across quarters, with particularly strong performance in Q2. The expense structure appears well-managed, though there may be opportunities for optimization in marketing spend efficiency."
      };

      setResults(mockResults);
      setReportDownloadUrl('/api/download-comprehensive-report');
      setProcessingStatus('completed');
      
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

  const handleEmailReport = () => {
    toast({
      title: "Email Sent",
      description: "The comprehensive financial report has been sent to your email address.",
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
            <>
              <ReportDisplay 
                results={results}
                reportDownloadUrl={reportDownloadUrl}
                isLoading={false}
                error={null}
                onEmailReport={handleEmailReport}
              />
              
              <OverallAnalysis 
                results={results}
                isLoading={false}
                error={null}
              />
            </>
          )}
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
