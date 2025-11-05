import React, { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import { PageLayout } from '../PageLayout';
import { PageHeader } from '../PageHeader';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { AddSpendingModal } from '../AddSpendingModal';
import { CurrencyDisplay } from '../CurrencyDisplay';
import { CategoryBadge } from '../CategoryBadge';
import { MemberAvatar } from '../MemberAvatar';
import { EmptyState } from '../EmptyState';
import {
  ArrowLeft,
  Plus,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProjectWorkspacePageProps {
  projectId: string;
  onNavigate: (page: string, projectId?: string) => void;
}

export function ProjectWorkspacePage({ projectId, onNavigate }: ProjectWorkspacePageProps) {
  const { getProject, getEntriesByProject, getUserById, getPlannedBudgetsByProject, deleteSpendingEntry } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddSpendingOpen, setIsAddSpendingOpen] = useState(false);
  
  const project = getProject(projectId);
  const entries = getEntriesByProject(projectId);
  const plannedBudgets = getPlannedBudgetsByProject(projectId);

  if (!project) {
    return (
      <PageLayout>
        <EmptyState
          icon={FileText}
          title="Project not found"
          description="The project you're looking for doesn't exist or has been deleted."
          action={{
            label: "Back to Dashboard",
            onClick: () => onNavigate('dashboard')
          }}
        />
      </PageLayout>
    );
  }

  const totalSpent = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const budgetPercentage = project.budget ? (totalSpent / project.budget) * 100 : 0;
  const remaining = project.budget ? project.budget - totalSpent : 0;

  // Calculate spending by category
  const spendingByCategory: Record<string, number> = {};
  entries.forEach(entry => {
    if (!spendingByCategory[entry.category]) {
      spendingByCategory[entry.category] = 0;
    }
    spendingByCategory[entry.category] += entry.amount;
  });

  const pieData = Object.entries(spendingByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const COLORS = ['#1E88E5', '#43A047', '#FBC02D', '#E53935', '#3949AB', '#29B6F6'];

  // Members
  const members = project.members.map(m => ({
    ...m,
    user: getUserById(m.userId)
  })).filter(m => m.user);

  // Calculate days remaining
  const today = new Date();
  const endDate = new Date(project.endDate);
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <>
      <PageLayout>
        <PageHeader
          title={project.name}
          description={`${project.category.charAt(0).toUpperCase() + project.category.slice(1)} project`}
          breadcrumbs={[
            { label: 'Dashboard', href: '#' },
            { label: project.name }
          ]}
          actions={
            <>
              <Button variant="outline" onClick={() => onNavigate('dashboard')} className="gap-2">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Button onClick={() => setIsAddSpendingOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Spending
              </Button>
            </>
          }
        />

        {/* Project Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Total Spent</p>
                  <p>
                    <CurrencyDisplay amount={totalSpent} currency={project.currency} />
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>

          {project.budget && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">Budget</p>
                    <p>
                      <CurrencyDisplay amount={project.budget} currency={project.currency} />
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/10 p-3">
                    <TrendingUp className="h-5 w-5 text-accent" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {project.budget && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">Remaining</p>
                    <p className={remaining < 0 ? 'text-destructive' : ''}>
                      <CurrencyDisplay amount={remaining} currency={project.currency} showSign />
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/10 p-3">
                    <Calendar className="h-5 w-5 text-secondary" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Days Remaining</p>
                  <p>{daysRemaining > 0 ? daysRemaining : 0} days</p>
                </div>
                <div className="rounded-lg bg-info/10 p-3">
                  <Calendar className="h-5 w-5 text-info" aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        {project.budget && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Budget Progress</span>
                  <span>{budgetPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(budgetPercentage, 100)} className="h-3" />
                {budgetPercentage > 100 && (
                  <p className="text-destructive">
                    Over budget by <CurrencyDisplay amount={totalSpent - project.budget} currency={project.currency} />
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="entries">Entries ({entries.length})</TabsTrigger>
            <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Category Breakdown Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-muted-foreground py-12">No spending data yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Entries */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  {entries.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">No entries yet</p>
                  ) : (
                    <div className="space-y-4">
                      {entries.slice(0, 5).map(entry => {
                        const author = getUserById(entry.authorId);
                        return (
                          <div key={entry.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                            {author && (
                              <MemberAvatar name={author.name} avatar={author.avatar} size="sm" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="truncate">{entry.title}</p>
                              <CategoryBadge category={entry.category} variant="outline" />
                              <div className="flex items-center justify-between mt-2">
                                <CurrencyDisplay amount={entry.amount} currency={entry.currency} />
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
            </div>
          </TabsContent>

          {/* Entries Tab */}
          <TabsContent value="entries">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Spending Entries</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {entries.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="No entries yet"
                    description="Start tracking your spending by adding your first entry"
                    action={{
                      label: "Add First Entry",
                      onClick: () => setIsAddSpendingOpen(true)
                    }}
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map(entry => {
                          const author = getUserById(entry.authorId);
                          return (
                            <TableRow key={entry.id}>
                              <TableCell>
                                <time dateTime={entry.date}>
                                  {new Date(entry.date).toLocaleDateString()}
                                </time>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p>{entry.title}</p>
                                  {entry.description && (
                                    <p className="text-muted-foreground">{entry.description}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <CategoryBadge category={entry.category} />
                              </TableCell>
                              <TableCell>
                                {author && (
                                  <div className="flex items-center gap-2">
                                    <MemberAvatar name={author.name} avatar={author.avatar} size="sm" />
                                    <span className="hidden sm:inline">{author.name}</span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <CurrencyDisplay amount={entry.amount} currency={entry.currency} />
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button variant="ghost" size="icon" aria-label="Edit entry">
                                    <Edit className="h-4 w-4" aria-hidden="true" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => deleteSpendingEntry(entry.id)}
                                    aria-label="Delete entry"
                                  >
                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Project Members</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map(({ userId, role, user, joinedAt }) => (
                    user && (
                      <div key={userId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <MemberAvatar name={user.name} avatar={user.avatar} size="md" />
                          <div>
                            <p>{user.name}</p>
                            <p className="text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={role === 'owner' ? 'default' : 'secondary'}>
                            {role}
                          </Badge>
                          <p className="text-muted-foreground hidden sm:block">
                            Joined {new Date(joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>

      <AddSpendingModal
        isOpen={isAddSpendingOpen}
        onClose={() => setIsAddSpendingOpen(false)}
        projectId={projectId}
        projectCurrency={project.currency}
      />
    </>
  );
}
