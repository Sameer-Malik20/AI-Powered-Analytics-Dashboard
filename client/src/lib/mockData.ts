// Utility functions for generating consistent data formats
// Note: This file provides utilities but the app uses real API data from storage

export interface MockMetrics {
  revenue: number;
  users: number;
  conversions: number;
  growth: number;
}

export interface MockRevenueData {
  month: string;
  revenue: number;
}

export interface MockUsersByRegion {
  region: string;
  users: number;
}

export interface MockConversionsByChannel {
  channel: string;
  conversions: number;
  percentage: number;
}

export interface MockCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  budget: number;
  impressions: number;
  clicks: number;
  ctr: number;
  createdAt: Date;
}

// Utility functions for data formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

// Calculate growth percentage between two values
export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Generate random variation for real-time updates
export const generateVariation = (baseValue: number, variance: number): number => {
  const change = (Math.random() - 0.5) * variance;
  return baseValue * (1 + change);
};

// Color utilities for charts
export const CHART_COLORS = {
  primary: "hsl(207, 90%, 54%)",
  secondary: "hsl(265, 84%, 68%)",
  success: "hsl(142, 71%, 45%)",
  warning: "hsl(38, 92%, 50%)",
  error: "hsl(0, 84%, 60%)",
} as const;

// Status badge color mapping
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'draft':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

// Date utilities
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getDateRange = (days: number): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
};
