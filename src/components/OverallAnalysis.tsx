
import React from 'react';
import { TrendingUp, PieChart, BarChart3, Brain, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';
import { Button } from '@/components/ui/button';

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

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#3B82F6",
  },
  amount: {
    label: "Amount",
    color: "#10B981",
  },
};

const OverallAnalysis: React.FC<OverallAnalysisProps> = ({ 
  results, 
  isLoading, 
  error 
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const generateAIInsights = async () => {
    // Placeholder for AI API integration
    console.log('Generating AI insights...');
    // This would integrate with your backend API to generate insights
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Analysis...</h3>
          <p className="text-gray-600">Creating charts and AI insights</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 border-red-200 bg-red-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-900 mb-2">Analysis Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
              Monthly Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <BarChart data={results.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000)}K`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="revenue" 
                  fill="var(--color-revenue)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-green-600" />
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{data.category}</p>
                            <p className="text-blue-600">{formatCurrency(data.amount)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <RechartsPieChart
                    data={results.expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {results.expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </RechartsPieChart>
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {results.expenseBreakdown.map((item, index) => (
                <div key={item.category} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">{item.category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Generated Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-600" />
              AI-Generated Financial Insights
            </div>
            <Button
              onClick={generateAIInsights}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Zap className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.aiGeneratedSummary ? (
            <div className="space-y-4">
              <p className="text-gray-800 leading-relaxed">
                {results.aiGeneratedSummary}
              </p>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Key Recommendations:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Consider optimizing expense allocation for improved profit margins
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Monitor monthly revenue trends for seasonal patterns
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Evaluate cost-cutting opportunities in high-expense categories
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">AI analysis will be generated here</p>
              <Button onClick={generateAIInsights} className="bg-purple-600 hover:bg-purple-700">
                <Zap className="mr-2 h-4 w-4" />
                Generate AI Insights
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
            Financial Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">85</div>
              <p className="text-sm text-gray-600">Overall Score</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">78</div>
              <p className="text-sm text-gray-600">Profitability</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">92</div>
              <p className="text-sm text-gray-600">Growth Potential</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Integration Section */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-orange-600" />
            API Integration Ready
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            This analysis section is designed to integrate with AI APIs for enhanced insights generation. 
            Connect your preferred AI service (OpenAI, Claude, Gemini) to generate:
          </p>
          <ul className="space-y-2 text-sm text-gray-600 mb-4">
            <li className="flex items-center">
              <span className="text-orange-600 mr-2">✓</span>
              Detailed financial narrative reports
            </li>
            <li className="flex items-center">
              <span className="text-orange-600 mr-2">✓</span>
              Risk assessment and recommendations
            </li>
            <li className="flex items-center">
              <span className="text-orange-600 mr-2">✓</span>
              Industry benchmarking analysis
            </li>
            <li className="flex items-center">
              <span className="text-orange-600 mr-2">✓</span>
              Predictive financial modeling
            </li>
          </ul>
          <Button className="bg-orange-600 hover:bg-orange-700">
            Configure AI Integration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverallAnalysis;
