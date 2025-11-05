import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, onClick }: StatCardProps) {
  const CardWrapper = onClick ? 'button' : 'div';
  const cardProps = onClick ? {
    onClick,
    className: 'w-full text-left transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'aria-label': `View details for ${title}`
  } : {};

  return (
    <CardWrapper {...cardProps}>
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground mb-1">{title}</p>
              <p className="mb-1">{value}</p>
              {subtitle && (
                <p className="text-muted-foreground">{subtitle}</p>
              )}
              {trend && (
                <p className={`text-${trend.isPositive ? 'success' : 'destructive'} mt-2`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </p>
              )}
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}
