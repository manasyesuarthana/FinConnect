import React, { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import { PageLayout } from '../PageLayout';
import { PageHeader } from '../PageHeader';
import { StatCard } from '../StatCard';
import { ProjectCard } from '../ProjectCard';
import { EmptyState } from '../EmptyState';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CurrencyDisplay } from '../CurrencyDisplay';
import { CategoryBadge } from '../CategoryBadge';
import { MemberAvatar } from '../MemberAvatar';
import { FolderPlus, DollarSign, TrendingDown, FolderOpen, Clock } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string, projectId?: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { projects, spendingEntries, currentUser, getUserById } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Calculate statistics
  const activeProjects = projects.length;
  
  const thisMonthEntries = spendingEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
  });
  
  const totalSpentThisMonth = thisMonthEntries.reduce((sum, entry) => sum + entry.amount, 0);
  
  const totalSpentAllTime = spendingEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const avgSpendPerProject = activeProjects > 0 ? totalSpentAllTime / activeProjects : 0;

  // Filter projects
  const filteredProjects = filterCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === filterCategory);

  // Recent activity (last 5 entries)
  const recentActivity = [...spendingEntries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Calculate spending per project
  const projectSpending = projects.map(project => ({
    project,
    totalSpent: spendingEntries
      .filter(e => e.projectId === project.id)
      .reduce((sum, e) => sum + e.amount, 0)
  }));

  return (
    <PageLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your financial projects and recent activity"
        actions={
          <Button onClick={() => onNavigate('create-project')} className="gap-2">
            <FolderPlus className="h-4 w-4" aria-hidden="true" />
            Create Project
          </Button>
        }
      />

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Active Projects"
          value={activeProjects}
          icon={FolderOpen}
        />
        <StatCard
          title="Spent This Month"
          value={<CurrencyDisplay amount={totalSpentThisMonth} currency="USD" />}
          icon={DollarSign}
          subtitle={`${thisMonthEntries.length} transactions`}
        />
        <StatCard
          title="Total Spent"
          value={<CurrencyDisplay amount={totalSpentAllTime} currency="USD" />}
          icon={TrendingDown}
        />
        <StatCard
          title="Avg per Project"
          value={<CurrencyDisplay amount={avgSpendPerProject} currency="USD" />}
          icon={DollarSign}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2>Your Projects</h2>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]" aria-label="Filter by category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="household">Household</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredProjects.length === 0 ? (
            <EmptyState
              icon={FolderPlus}
              title="No projects found"
              description={
                filterCategory === 'all'
                  ? "Get started by creating your first financial project"
                  : "No projects in this category. Try a different filter or create a new project."
              }
              action={{
                label: "Create Your First Project",
                onClick: () => onNavigate('create-project')
              }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projectSpending
                .filter(({ project }) => 
                  filterCategory === 'all' || project.category === filterCategory
                )
                .map(({ project, totalSpent }) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    totalSpent={totalSpent}
                    onClick={() => onNavigate('project', project.id)}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Sidebar - Recent Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" aria-hidden="true" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No activity yet
                </p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map(entry => {
                    const author = getUserById(entry.authorId);
                    const project = projects.find(p => p.id === entry.projectId);
                    
                    return (
                      <div
                        key={entry.id}
                        className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                      >
                        {author && (
                          <MemberAvatar
                            name={author.name}
                            avatar={author.avatar}
                            size="sm"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="truncate">
                            {entry.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <CategoryBadge category={entry.category} variant="outline" />
                            {project && (
                              <span className="text-muted-foreground truncate">
                                {project.name}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <CurrencyDisplay
                              amount={entry.amount}
                              currency={entry.currency}
                              className="text-foreground"
                            />
                            <time className="text-muted-foreground" dateTime={entry.date}>
                              {new Date(entry.date).toLocaleDateString()}
                            </time>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>💡 Quick Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Set planned budgets for your categories to track your spending goals and get AI-powered recommendations.
              </p>
              <Button 
                variant="link" 
                className="px-0 mt-2"
                onClick={() => onNavigate('community')}
              >
                Browse community tips →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
