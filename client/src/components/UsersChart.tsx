import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export function UsersChart() {
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['/api/users-by-region'],
  });

  if (isLoading) {
    return (
      <Card data-testid="card-users-chart">
        <CardHeader>
          <CardTitle>Users by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 flex items-center justify-center">
            <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxUsers = Math.max(...(usersData || []).map((d: any) => d.users));
  const colors = [
    "hsl(207, 90%, 54%)", // primary
    "hsl(265, 84%, 68%)", // secondary  
    "hsl(142, 71%, 45%)", // success
    "hsl(38, 92%, 50%)", // warning
    "hsl(0, 84%, 60%)" // error
  ];

  return (
    <Card data-testid="card-users-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Users by Region</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-view-all">
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4" data-testid="chart-users">
          {usersData?.map((region: any, index: number) => (
            <div key={region.id} className="flex items-center justify-between" data-testid={`row-region-${index}`}>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300" data-testid={`text-region-${index}`}>
                  {region.region}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${(region.users / maxUsers) * 100}%`,
                      backgroundColor: colors[index % colors.length]
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right" data-testid={`text-users-${index}`}>
                  {region.users.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
