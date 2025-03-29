
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatItem {
  value: number;
  label: string;
  className?: string;
}

interface StatsCardProps {
  title: string;
  stats: StatItem[];
}

const StatsCard: React.FC<StatsCardProps> = ({ title, stats }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className={`text-3xl font-bold ${stat.className || ''}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
