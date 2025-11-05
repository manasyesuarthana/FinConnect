import React, { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import { PageLayout } from '../PageLayout';
import { PageHeader } from '../PageHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Member } from '../../lib/mockData';
import { currencies } from '../../lib/mockData';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface CreateProjectPageProps {
  onNavigate: (page: string, projectId?: string) => void;
}

interface MemberInput {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
}

export function CreateProjectPage({ onNavigate }: CreateProjectPageProps) {
  const { createProject, currentUser } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'business' | 'holiday' | 'personal' | 'household' | 'other'>('personal');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [memberInputs, setMemberInputs] = useState<MemberInput[]>([]);

  const handleAddMember = () => {
    setMemberInputs([
      ...memberInputs,
      { id: `temp-${Date.now()}`, name: '', email: '', role: 'editor' }
    ]);
  };

  const handleRemoveMember = (id: string) => {
    setMemberInputs(memberInputs.filter(m => m.id !== id));
  };

  const handleMemberChange = (id: string, field: keyof MemberInput, value: string) => {
    setMemberInputs(memberInputs.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const members: Member[] = [
        { userId: currentUser?.id || 'user-1', role: 'owner', joinedAt: new Date().toISOString() }
      ];

      // In a real app, we would create user accounts for members
      // For now, we'll just store the member info
      
      createProject({
        name,
        category,
        budget: budget ? parseFloat(budget) : undefined,
        currency,
        startDate,
        endDate,
        members
      });
      
      toast.success('Project created successfully!');
      setTimeout(() => onNavigate('dashboard'), 500);
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout maxWidth="medium">
      <PageHeader
        title="Create Project"
        description="Set up a new finance tracking project"
        breadcrumbs={[
          { label: 'Dashboard', href: '#' },
          { label: 'Create Project' }
        ]}
        actions={
          <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="project-name">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="project-name"
                type="text"
                placeholder="e.g., Summer Vacation 2025"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <p className="text-muted-foreground">
                Give your project a descriptive name
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="project-category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger id="project-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="household">Household</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget and Currency */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-budget">Budget (Optional)</Label>
                <Input
                  id="project-budget"
                  type="number"
                  placeholder="5000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="project-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(curr => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Members */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Add Team Members (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddMember}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add Member
                </Button>
              </div>

              {memberInputs.length > 0 && (
                <div className="space-y-3">
                  {memberInputs.map((member) => (
                    <Card key={member.id} className="p-4">
                      <div className="grid sm:grid-cols-[1fr,1fr,auto,auto] gap-3 items-end">
                        <div className="space-y-2">
                          <Label htmlFor={`member-name-${member.id}`}>Name</Label>
                          <Input
                            id={`member-name-${member.id}`}
                            type="text"
                            placeholder="John Doe"
                            value={member.name}
                            onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`member-email-${member.id}`}>Email</Label>
                          <Input
                            id={`member-email-${member.id}`}
                            type="email"
                            placeholder="john@example.com"
                            value={member.email}
                            onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`member-role-${member.id}`}>Role</Label>
                          <Select
                            value={member.role}
                            onValueChange={(value: any) => handleMemberChange(member.id, 'role', value)}
                          >
                            <SelectTrigger id={`member-role-${member.id}`} className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.id)}
                          aria-label="Remove member"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <p className="text-muted-foreground">
                Members will receive an invitation to join this project
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate('dashboard')}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
