import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  icon: React.ReactNode;
  iconBgColor: string;
  testId?: string;
}

export function MetricCard({
  title,
  value,
  growth,
  isPositive,
  icon,
  iconBgColor,
  testId
}: MetricCardProps) {
  return (
    <Card 
      className="metric-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" 
      data-testid={testId}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2" data-testid={`text-${testId}-value`}>
              {value}
            </p>
          </div>
          <div className={cn("p-3 rounded-full", iconBgColor)}>
            {icon}
          </div>
        </div>
        <div className="flex items-center mt-4">
          {isPositive ? (
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={cn(
            "text-sm font-medium mr-2",
            isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )} data-testid={`text-${testId}-growth`}>
            {growth}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            vs last month
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
