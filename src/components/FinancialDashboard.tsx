import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  PieChart, 
  Calendar,
  Download,
  Filter,
  Home
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ReportDisplay from './ReportDisplay';
import OverallAnalysis from './OverallAnalysis';

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

interface FinancialDashboardProps {
  reportsData: ReportData[];
  isLoading: boolean;
  error: string | null;
  onBackToHome?: () => void;
}

type SelectedReportType = 'EBITDA' | 'DCF' | 'P&L' | 'Summary';
type TimeFilter = 'Year' | 'Month' | 'Week' | 'Day';

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  reportsData,
  isLoading,
  error,
  onBackToHome
}) => {
  const [selectedReportType, setSelectedReportType] = useState<SelectedReportType>('Summary');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>('Month');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { 
      id: 'Summary' as SelectedReportType, 
      label: 'Overall Summary', 
      icon: PieChart,
      color: 'text-purple-600'
    },
    { 
      id: 'EBITDA' as SelectedReportType, 
      label: 'EBITDA Report', 
      icon: BarChart3,
      color: 'text-blue-600'
    },
    { 
      id: 'DCF' as SelectedReportType, 
      label: 'DCF Report', 
      icon: TrendingUp,
      color: 'text-green-600'
    },
    { 
      id: 'P&L' as SelectedReportType, 
      label: 'P&L Report', 
      icon: FileText,
      color: 'text-orange-600'
    }
  ];

  const timeFilters: TimeFilter[] = ['Year', 'Month', 'Week', 'Day'];

  const filteredData = useMemo(() => {
    if (!reportsData.length) return [];

    const now = new Date();
    const filtered = reportsData.filter(report => {
      const reportDate = new Date(report.timestamp);
      
      switch (selectedTimeFilter) {
        case 'Day':
          return reportDate.toDateString() === now.toDateString();
        case 'Week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return reportDate >= weekAgo;
        case 'Month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return reportDate >= monthAgo;
        case 'Year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return reportDate >= yearAgo;
        default:
          return true;
      }
    });

    if (selectedReportType !== 'Summary') {
      return filtered.filter(report => report.reportType === selectedReportType);
    }

    return filtered;
  }, [reportsData, selectedReportType, selectedTimeFilter]);

  const latestReportData = useMemo(() => {
    if (!filteredData.length) return null;
    
    const sorted = [...filteredData].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return sorted[0];
  }, [filteredData]);

  const formatFinancialResults = (data: ReportData[]) => {
    const latest = data[0];
    if (!latest) return null;

    return {
      ebitda: latest.ebitda || null,
      dcf: latest.dcf || null,
      revenue: latest.profitAndLoss?.revenue || null,
      netIncome: latest.profitAndLoss?.netIncome || null,
      operatingIncome: null,
      grossProfit: latest.profitAndLoss?.grossProfit || null,
      totalExpenses: latest.profitAndLoss?.operatingExpenses || null,
      profitBeforeTax: null,
      monthlyRevenue: latest.monthlyBreakdown?.map(item => ({
        month: item.month,
        revenue: item.value
      })) || [],
      expenseBreakdown: [
        { category: 'Operations', amount: (latest.profitAndLoss?.operatingExpenses || 0) * 0.4 },
        { category: 'Personnel', amount: (latest.profitAndLoss?.operatingExpenses || 0) * 0.3 },
        { category: 'Marketing', amount: (latest.profitAndLoss?.operatingExpenses || 0) * 0.2 },
        { category: 'Administrative', amount: (latest.profitAndLoss?.operatingExpenses || 0) * 0.1 }
      ],
      aiGeneratedSummary: "Based on the latest financial analysis, the company demonstrates strong operational performance with healthy profit margins and consistent revenue growth patterns."
    };
  };

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Reports...</h3>
            <p className="text-gray-600">Please wait while we fetch your financial data</p>
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
            <h3 className="text-lg font-medium text-red-900 mb-2">Failed to Load Reports</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      );
    }

    if (!filteredData.length) {
      return (
        <Card className="p-8">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600">
              No reports found for the selected time period. Try adjusting your filters.
            </p>
          </div>
        </Card>
      );
    }

    const financialResults = formatFinancialResults(filteredData);
    
    if (selectedReportType === 'Summary') {
      return (
        <div className="space-y-6">
          {financialResults && (
            <>
              <ReportDisplay
                results={financialResults}
                reportDownloadUrl={latestReportData?.downloadUrl || null}
                isLoading={false}
                error={null}
                onEmailReport={() => {}}
              />
              <OverallAnalysis
                results={financialResults}
                isLoading={false}
                error={null}
              />
            </>
          )}
        </div>
      );
    }

    return (
      <div>
        {financialResults && (
          <ReportDisplay
            results={financialResults}
            reportDownloadUrl={latestReportData?.downloadUrl || null}
            isLoading={false}
            error={null}
            onEmailReport={() => {}}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex w-full">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-lg border-r border-gray-200 min-h-screen`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              {sidebarOpen && (
                <h2 className="text-xl font-bold text-gray-900">Financial Dashboard</h2>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
            
            <nav className="space-y-2">
              {/* Home Button */}
              {onBackToHome && (
                <>
                  <button
                    onClick={onBackToHome}
                    className="w-full flex items-center px-3 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Home className="w-5 h-5 text-gray-600" />
                    {sidebarOpen && (
                      <span className="ml-3 font-medium">Home</span>
                    )}
                  </button>
                  <Separator className="my-2" />
                </>
              )}

              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = selectedReportType === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedReportType(item.id)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : item.color}`} />
                    {sidebarOpen && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedReportType === 'Summary' ? 'Financial Overview' : `${selectedReportType} Report`}
                </h1>
                <p className="text-gray-600 mt-1">
                  {filteredData.length} report{filteredData.length !== 1 ? 's' : ''} found for {selectedTimeFilter.toLowerCase()}
                </p>
              </div>
              
              {/* Time Filter Buttons */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {timeFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedTimeFilter(filter)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        selectedTimeFilter === filter
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
