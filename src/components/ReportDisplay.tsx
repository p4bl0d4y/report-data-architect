
import React from 'react';
import { Download, TrendingUp, DollarSign, FileText, Mail, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface FinancialResults {
  ebitda: number | null;
  dcf: number | null;
  revenue: number | null;
  netIncome: number | null;
  operatingIncome: number | null;
  grossProfit: number | null;
  totalExpenses: number | null;
  profitBeforeTax: number | null;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  expenseBreakdown: Array<{ category: string; amount: number }>;
  aiGeneratedSummary: string | null;
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* P&L Summary Card */}
        <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Receipt className="mr-2 h-5 w-5 text-purple-600" />
              Net Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(results.netIncome)}
            </div>
            <p className="text-sm text-gray-600">
              Profit & Loss Bottom Line
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* P&L Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="mr-2 h-5 w-5 text-purple-600" />
            Profit & Loss Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-700 mb-1">Gross Profit</p>
              <p className="text-xl font-bold text-green-800">{formatCurrency(results.grossProfit)}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-red-700 mb-1">Total Expenses</p>
              <p className="text-xl font-bold text-red-800">{formatCurrency(results.totalExpenses)}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-700 mb-1">Profit Before Tax</p>
              <p className="text-xl font-bold text-blue-800">{formatCurrency(results.profitBeforeTax)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Financial Metrics */}
      {(results.revenue || results.operatingIncome) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Financial Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.revenue !== null && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(results.revenue)}</p>
                </div>
              )}
              {results.operatingIncome !== null && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Operating Income</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(results.operatingIncome)}</p>
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
              Download Comprehensive Report
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
              The comprehensive financial analysis includes EBITDA operational metrics, DCF valuation, 
              detailed P&L breakdown, and AI-generated insights. All calculations follow standard 
              financial modeling practices and accounting principles.
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
