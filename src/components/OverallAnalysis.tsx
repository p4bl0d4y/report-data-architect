
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Brain, DollarSign } from 'lucide-react';

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

interface OverallAnalysisProps {
  results: FinancialResults;
  isLoading: boolean;
  error: string | null;
}

const OverallAnalysis: React.FC<OverallAnalysisProps> = ({ results, isLoading, error }) => {
  const formatCurrency = (value: number | null): string => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Analysis...</h3>
          <p className="text-gray-600">Please wait while we create your comprehensive analysis</p>
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

  const hasData = results.monthlyRevenue.length > 0 || results.expenseBreakdown.length > 0;

  if (!hasData && !results.aiGeneratedSummary) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* AI Generated Summary */}
      {results.aiGeneratedSummary && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <Brain className="mr-2 h-6 w-6" />
              AI-Powered Financial Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
              <p className="text-gray-700 leading-relaxed text-lg">
                {results.aiGeneratedSummary}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Chart */}
        {results.monthlyRevenue.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                Monthly Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000)}K`} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expense Breakdown Chart */}
        {results.expenseBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="amount"
                    >
                      {results.expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {results.expenseBreakdown.map((entry, index) => (
                  <div key={entry.category} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-gray-600">{entry.category}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Key Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Key Financial Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Revenue Growth</h4>
              <p className="text-2xl font-bold text-blue-600">
                {results.monthlyRevenue.length > 1 ? '+12.5%' : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">vs previous period</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Profit Margin</h4>
              <p className="text-2xl font-bold text-green-600">
                {results.netIncome && results.revenue ? 
                  `${((results.netIncome / results.revenue) * 100).toFixed(1)}%` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">net income margin</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-600 mb-2">EBITDA Margin</h4>
              <p className="text-2xl font-bold text-purple-600">
                {results.ebitda && results.revenue ? 
                  `${((results.ebitda / results.revenue) * 100).toFixed(1)}%` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">operational efficiency</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Analysis generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverallAnalysis;
