import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";

const COLORS = [
  "hsl(207, 90%, 54%)", // primary
  "hsl(265, 84%, 68%)", // secondary
  "hsl(142, 71%, 45%)", // success
  "hsl(38, 92%, 50%)", // warning
];

export function ConversionsChart() {
  const { data: conversionsData, isLoading } = useQuery({
    queryKey: ['/api/conversions-by-channel'],
  });

  if (isLoading) {
    return (
      <Card data-testid="card-conversions-chart">
        <CardHeader>
          <CardTitle>Conversions by Marketing Channel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 flex items-center justify-center">
            <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalConversions = conversionsData?.reduce((sum: number, item: any) => sum + item.conversions, 0) || 0;

  return (
    <Card data-testid="card-conversions-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Conversions by Marketing Channel</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Total:</span>
              <span className="font-semibold text-gray-900 dark:text-white" data-testid="text-total-conversions">
                {totalConversions.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Donut Chart */}
          <div className="flex justify-center" data-testid="chart-conversions">
            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie
                  data={conversionsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="conversions"
                >
                  {conversionsData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toLocaleString()} (${props.payload.percentage}%)`,
                    props.payload.channel
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="space-y-4">
            {conversionsData?.map((item: any, index: number) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
                data-testid={`row-channel-${index}`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300" data-testid={`text-channel-${index}`}>
                    {item.channel}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white" data-testid={`text-conversions-${index}`}>
                    {item.conversions.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400" data-testid={`text-percentage-${index}`}>
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
