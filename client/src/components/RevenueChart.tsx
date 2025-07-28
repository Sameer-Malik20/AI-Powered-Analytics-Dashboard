import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";

export function RevenueChart() {
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ['/api/revenue-data'],
  });

  if (isLoading) {
    return (
      <Card data-testid="card-revenue-chart">
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 flex items-center justify-center">
            <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-revenue-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Revenue Growth</CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" variant="default" data-testid="button-30d">30D</Button>
            <Button size="sm" variant="ghost" data-testid="button-90d">90D</Button>
            <Button size="sm" variant="ghost" data-testid="button-1y">1Y</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72" data-testid="chart-revenue">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="month" 
                className="text-gray-500 dark:text-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-gray-500 dark:text-gray-400"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(207, 90%, 54%)" 
                strokeWidth={3}
                dot={{ fill: "hsl(207, 90%, 54%)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(207, 90%, 54%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
