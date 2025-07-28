import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Moon, Sun, Download, Calendar, BarChart3 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { MetricCard } from "@/components/MetricCard";
import { RevenueChart } from "@/components/RevenueChart";
import { UsersChart } from "@/components/UsersChart";
import { ConversionsChart } from "@/components/ConversionsChart";
import { CampaignTable } from "@/components/CampaignTable";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<any>(null);

  const { data: initialMetrics, isLoading } = useQuery({
    queryKey: ['/api/metrics'],
  });

  // Real-time updates simulation
  useEffect(() => {
    if (initialMetrics) {
      setMetrics(initialMetrics);
      
      const interval = setInterval(() => {
        setMetrics((prev: any) => {
          if (!prev) return prev;
          
          const variance = 0.02;
          return {
            ...prev,
            revenue: Math.round(847392 * (1 + (Math.random() - 0.5) * variance)),
            users: Math.round(24573 * (1 + (Math.random() - 0.5) * 0.01)),
            conversions: Math.round(1847 * (1 + (Math.random() - 0.5) * 0.03)),
            growth: parseFloat((15.3 * (1 + (Math.random() - 0.5) * 0.05)).toFixed(1))
          };
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [initialMetrics]);

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'csv' }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'campaigns.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Success",
          description: "Campaign data exported successfully",
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="animate-pulse">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-app-title">
                  ADmyBRAND Insights
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Date Range Picker */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg" data-testid="button-date-range">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last 30 days</span>
              </div>
              
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                data-testid="button-theme-toggle"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
              
              {/* Export Button */}
              <Button onClick={handleExport} data-testid="button-export">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:block">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`$${metrics?.revenue?.toLocaleString() || '0'}`}
            growth="+12.5%"
            isPositive={true}
            icon={<span className="text-lg">💰</span>}
            iconBgColor="bg-green-100 dark:bg-green-900/30"
            testId="metric-revenue"
          />
          <MetricCard
            title="Active Users"
            value={metrics?.users?.toLocaleString() || '0'}
            growth="+8.2%"
            isPositive={true}
            icon={<span className="text-lg">👥</span>}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            testId="metric-users"
          />
          <MetricCard
            title="Conversions"
            value={metrics?.conversions?.toLocaleString() || '0'}
            growth="-2.4%"
            isPositive={false}
            icon={<span className="text-lg">✅</span>}
            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            testId="metric-conversions"
          />
          <MetricCard
            title="Growth Rate"
            value={`${metrics?.growth || 0}%`}
            growth="+3.1%"
            isPositive={true}
            icon={<span className="text-lg">📈</span>}
            iconBgColor="bg-orange-100 dark:bg-orange-900/30"
            testId="metric-growth"
          />
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevenueChart />
          <UsersChart />
        </section>

        {/* Pie Chart */}
        <ConversionsChart />

        {/* Data Table */}
        <CampaignTable />
      </main>
    </div>
  );
}
