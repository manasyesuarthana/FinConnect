import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CurrencyDisplay } from './CurrencyDisplay';
import { MemberAvatar } from './MemberAvatar';
import { useApp } from '../lib/AppContext';
import { Project } from '../lib/mockData';
import { Calendar, Users } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  totalSpent: number;
}

export function ProjectCard({ project, onClick, totalSpent }: ProjectCardProps) {
  const { getUserById } = useApp();
  const budgetPercentage = project.budget ? (totalSpent / project.budget) * 100 : 0;
  const isOverBudget = budgetPercentage > 100;
  
  const categoryColors: Record<string, string> = {
    business: 'bg-blue-100 text-blue-700',
    holiday: 'bg-purple-100 text-purple-700',
    personal: 'bg-green-100 text-green-700',
    household: 'bg-orange-100 text-orange-700',
    other: 'bg-gray-100 text-gray-700'
  };

  const categoryColor = categoryColors[project.category] || categoryColors.other;

  const members = project.members.map(m => getUserById(m.userId)).filter(Boolean);

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`View ${project.name} project`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2">{project.name}</CardTitle>
          <Badge className={categoryColor}>
            {project.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Budget Progress */}
        {project.budget && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Budget</span>
              <div className="flex items-center gap-2">
                <CurrencyDisplay 
                  amount={totalSpent} 
                  currency={project.currency}
                  className={isOverBudget ? 'text-destructive' : 'text-foreground'}
                />
                <span className="text-muted-foreground">/</span>
                <CurrencyDisplay amount={project.budget} currency={project.currency} />
              </div>
            </div>
            <Progress 
              value={Math.min(budgetPercentage, 100)} 
              className="h-2"
              aria-label={`${budgetPercentage.toFixed(0)}% of budget used`}
            />
            {isOverBudget && (
              <p className="text-destructive">
                Over budget by <CurrencyDisplay amount={totalSpent - project.budget} currency={project.currency} />
              </p>
            )}
          </div>
        )}

        {/* Date Range */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <span>
            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
          </span>
        </div>

        {/* Members */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <div className="flex -space-x-2">
            {members.slice(0, 3).map((member, index) => (
              member && (
                <div key={member.id} style={{ zIndex: 10 - index }}>
                  <MemberAvatar
                    name={member.name}
                    avatar={member.avatar}
                    size="sm"
                  />
                </div>
              )
            ))}
            {members.length > 3 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted border-2 border-background text-muted-foreground">
                +{members.length - 3}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
