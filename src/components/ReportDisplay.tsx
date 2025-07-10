
import React from 'react';
import { Download, TrendingUp, DollarSign, FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface FinancialResults {
  ebitda: number | null;
  dcf: number | null;
  revenue: number | null;
  netIncome: number | null;
  operatingIncome: number | null;
}

interface ReportDisplayProps {
  results: FinancialResults;
  reportDownloadUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onEmailReport: () => void;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ 
  results, 
  reportDownloadUrl, 
  isLoading, 
  error,
  onEmailReport 
}) => {
  const formatCurrency = (value: number | null): string => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleDownload = () => {
    if (reportDownloadUrl) {
      window.open(reportDownloadUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Calculating Reports...</h3>
          <p className="text-gray-600">Please wait while we analyze your financial data</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 border-red-200 bg-red-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Analysis Failed</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </Card>
    );
  }

  const hasResults = results.ebitda !== null || results.dcf !== null;

  if (!hasResults) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EBITDA Card */}
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              EBITDA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(results.ebitda)}
            </div>
            <p className="text-sm text-gray-600">
              Earnings Before Interest, Taxes, Depreciation, and Amortization
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* DCF Card */}
        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
              DCF Valuation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(results.dcf)}
            </div>
            <p className="text-sm text-gray-600">
              Discounted Cash Flow Valuation
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Financial Metrics */}
      {(results.revenue || results.netIncome || results.operatingIncome) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Financial Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.revenue !== null && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Revenue</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(results.revenue)}</p>
                </div>
              )}
              {results.operatingIncome !== null && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Operating Income</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(results.operatingIncome)}</p>
                </div>
              )}
              {results.netIncome !== null && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Net Income</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(results.netIncome)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDownload}
              disabled={!reportDownloadUrl}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Full Report
            </Button>
            
            <Button 
              onClick={onEmailReport}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg transition-all duration-200"
            >
              <Mail className="mr-2 h-5 w-5" />
              Email Report
            </Button>
            
            <Button 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg transition-all duration-200"
            >
              <FileText className="mr-2 h-5 w-5" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Summary</h3>
            <p className="text-gray-700 leading-relaxed">
              The financial analysis has been completed successfully. The EBITDA represents the company's 
              operational profitability, while the DCF valuation provides an intrinsic value estimate 
              based on projected cash flows.
            </p>
            <Separator className="my-4" />
            <p className="text-sm text-gray-600">
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportDisplay;
