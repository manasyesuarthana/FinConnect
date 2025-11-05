// Mock data for FinConnect application

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Member {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
}

export interface SpendingEntry {
  id: string;
  projectId: string;
  date: string;
  title: string;
  description?: string;
  category: string;
  amount: number;
  currency: string;
  authorId: string;
  receipt?: string;
  notes?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  category: 'business' | 'holiday' | 'personal' | 'household' | 'other';
  budget?: number;
  currency: string;
  startDate: string;
  endDate: string;
  members: Member[];
  createdAt: string;
  createdBy: string;
}

export interface PlannedBudget {
  id: string;
  projectId: string;
  category: string;
  plannedAmount: number;
  notes?: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  content: string;
  projectTag?: string;
  imageUrl?: string;
  reactions: { type: string; count: number }[];
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  projectContext?: string;
}

// Mock current user
export const mockCurrentUser: User = {
  id: 'user-1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
};

// Mock additional users
export const mockUsers: Record<string, User> = {
  'user-1': mockCurrentUser,
  'user-2': {
    id: 'user-2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
  },
  'user-3': {
    id: 'user-3',
    name: 'Emma Davis',
    email: 'emma@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
  },
  'user-4': {
    id: 'user-4',
    name: 'James Wilson',
    email: 'james@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'
  }
};

// Mock projects
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Summer Vacation 2025',
    category: 'holiday',
    budget: 5000,
    currency: 'USD',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    members: [
      { userId: 'user-1', role: 'owner', joinedAt: '2025-01-01' },
      { userId: 'user-2', role: 'editor', joinedAt: '2025-01-05' }
    ],
    createdAt: '2025-01-01',
    createdBy: 'user-1'
  },
  {
    id: 'project-2',
    name: 'Home Renovation',
    category: 'household',
    budget: 15000,
    currency: 'USD',
    startDate: '2025-02-01',
    endDate: '2025-12-31',
    members: [
      { userId: 'user-1', role: 'owner', joinedAt: '2025-02-01' },
      { userId: 'user-3', role: 'editor', joinedAt: '2025-02-01' }
    ],
    createdAt: '2025-02-01',
    createdBy: 'user-1'
  },
  {
    id: 'project-3',
    name: 'Personal Budget 2025',
    category: 'personal',
    budget: 3000,
    currency: 'USD',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    members: [
      { userId: 'user-1', role: 'owner', joinedAt: '2025-01-01' }
    ],
    createdAt: '2025-01-01',
    createdBy: 'user-1'
  },
  {
    id: 'project-4',
    name: 'Startup Expenses Q1',
    category: 'business',
    budget: 25000,
    currency: 'USD',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    members: [
      { userId: 'user-1', role: 'owner', joinedAt: '2025-01-01' },
      { userId: 'user-2', role: 'editor', joinedAt: '2025-01-01' },
      { userId: 'user-4', role: 'viewer', joinedAt: '2025-01-15' }
    ],
    createdAt: '2025-01-01',
    createdBy: 'user-1'
  }
];

// Mock spending entries
export const mockSpendingEntries: SpendingEntry[] = [
  {
    id: 'spend-1',
    projectId: 'project-1',
    date: '2025-01-15',
    title: 'Flight Tickets',
    description: 'Round-trip flights to Hawaii',
    category: 'Transportation',
    amount: 850,
    currency: 'USD',
    authorId: 'user-1',
    createdAt: '2025-01-15'
  },
  {
    id: 'spend-2',
    projectId: 'project-1',
    date: '2025-01-20',
    title: 'Hotel Booking',
    description: 'Ocean view resort - 7 nights',
    category: 'Accommodation',
    amount: 1400,
    currency: 'USD',
    authorId: 'user-2',
    createdAt: '2025-01-20'
  },
  {
    id: 'spend-3',
    projectId: 'project-2',
    date: '2025-02-05',
    title: 'Paint Supplies',
    description: 'Interior paint and brushes',
    category: 'Materials',
    amount: 450,
    currency: 'USD',
    authorId: 'user-1',
    createdAt: '2025-02-05'
  },
  {
    id: 'spend-4',
    projectId: 'project-2',
    date: '2025-02-12',
    title: 'Contractor Payment',
    description: 'Kitchen renovation - deposit',
    category: 'Labor',
    amount: 3000,
    currency: 'USD',
    authorId: 'user-3',
    createdAt: '2025-02-12'
  },
  {
    id: 'spend-5',
    projectId: 'project-3',
    date: '2025-10-01',
    title: 'Groceries',
    description: 'Weekly shopping',
    category: 'Food',
    amount: 120,
    currency: 'USD',
    authorId: 'user-1',
    createdAt: '2025-10-01'
  },
  {
    id: 'spend-6',
    projectId: 'project-3',
    date: '2025-10-03',
    title: 'Gym Membership',
    description: 'Monthly subscription',
    category: 'Health',
    amount: 50,
    currency: 'USD',
    authorId: 'user-1',
    createdAt: '2025-10-03'
  },
  {
    id: 'spend-7',
    projectId: 'project-4',
    date: '2025-01-10',
    title: 'Office Supplies',
    description: 'Desks, chairs, and equipment',
    category: 'Equipment',
    amount: 2500,
    currency: 'USD',
    authorId: 'user-2',
    createdAt: '2025-01-10'
  },
  {
    id: 'spend-8',
    projectId: 'project-4',
    date: '2025-01-25',
    title: 'Marketing Campaign',
    description: 'Social media ads',
    category: 'Marketing',
    amount: 1200,
    currency: 'USD',
    authorId: 'user-1',
    createdAt: '2025-01-25'
  },
  {
    id: 'spend-9',
    projectId: 'project-1',
    date: '2025-02-01',
    title: 'Travel Insurance',
    description: 'Comprehensive coverage',
    category: 'Insurance',
    amount: 180,
    currency: 'USD',
    authorId: 'user-1',
    createdAt: '2025-02-01'
  },
  {
    id: 'spend-10',
    projectId: 'project-3',
    date: '2025-10-15',
    title: 'Dining Out',
    description: 'Restaurant',
    category: 'Food',
    amount: 75,
    currency: 'USD',
    authorId: 'user-1',
    createdAt: '2025-10-15'
  },
  {
    id: 'spend-11',
    projectId: 'project-3',
    date: '2025-10-20',
    title: 'Electric Bill',
    description: 'Monthly utility',
    category: 'Utilities',
    amount: 95,
    currency: 'USD',
    authorId: 'user-1',
    createdAt: '2025-10-20'
  },
  {
    id: 'spend-12',
    projectId: 'project-4',
    date: '2025-02-10',
    title: 'Software Licenses',
    description: 'Annual subscriptions',
    category: 'Software',
    amount: 800,
    currency: 'USD',
    authorId: 'user-2',
    createdAt: '2025-02-10'
  }
];

// Mock planned budgets
export const mockPlannedBudgets: PlannedBudget[] = [
  {
    id: 'plan-1',
    projectId: 'project-1',
    category: 'Transportation',
    plannedAmount: 1000,
    notes: 'Flights and car rental'
  },
  {
    id: 'plan-2',
    projectId: 'project-1',
    category: 'Accommodation',
    plannedAmount: 1500,
    notes: 'Hotel for 7 nights'
  },
  {
    id: 'plan-3',
    projectId: 'project-1',
    category: 'Food',
    plannedAmount: 800,
    notes: 'Dining and groceries'
  },
  {
    id: 'plan-4',
    projectId: 'project-1',
    category: 'Activities',
    plannedAmount: 1200,
    notes: 'Tours and entertainment'
  },
  {
    id: 'plan-5',
    projectId: 'project-1',
    category: 'Insurance',
    plannedAmount: 200,
    notes: 'Travel insurance'
  },
  {
    id: 'plan-6',
    projectId: 'project-2',
    category: 'Materials',
    plannedAmount: 5000
  },
  {
    id: 'plan-7',
    projectId: 'project-2',
    category: 'Labor',
    plannedAmount: 8000
  },
  {
    id: 'plan-8',
    projectId: 'project-2',
    category: 'Permits',
    plannedAmount: 1000
  },
  {
    id: 'plan-9',
    projectId: 'project-3',
    category: 'Food',
    plannedAmount: 600
  },
  {
    id: 'plan-10',
    projectId: 'project-3',
    category: 'Utilities',
    plannedAmount: 200
  },
  {
    id: 'plan-11',
    projectId: 'project-3',
    category: 'Health',
    plannedAmount: 100
  },
  {
    id: 'plan-12',
    projectId: 'project-3',
    category: 'Entertainment',
    plannedAmount: 150
  }
];

// Mock community posts
export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    authorId: 'user-2',
    content: '💡 Pro tip: Use the 50/30/20 budgeting rule - 50% for needs, 30% for wants, and 20% for savings. It has helped me stay on track this year!',
    reactions: [
      { type: 'like', count: 24 },
      { type: 'helpful', count: 15 }
    ],
    comments: [
      {
        id: 'comment-1',
        authorId: 'user-1',
        content: 'This is great advice! I\'ve been using a similar approach.',
        createdAt: '2025-10-15T10:30:00Z'
      }
    ],
    createdAt: '2025-10-14T09:00:00Z'
  },
  {
    id: 'post-2',
    authorId: 'user-3',
    content: 'Just finished my first month of strict budget tracking. Saved $350 by cutting down on dining out! Small changes really add up.',
    projectTag: 'Personal Budget',
    reactions: [
      { type: 'like', count: 18 },
      { type: 'celebrate', count: 12 }
    ],
    comments: [],
    createdAt: '2025-10-20T14:20:00Z'
  },
  {
    id: 'post-3',
    authorId: 'user-4',
    content: 'Question: How do you all handle budgeting for irregular expenses like car maintenance? I find it hard to predict.',
    reactions: [
      { type: 'like', count: 8 }
    ],
    comments: [
      {
        id: 'comment-2',
        authorId: 'user-2',
        content: 'I set aside a fixed amount each month in a "surprise expenses" category. Works well!',
        createdAt: '2025-10-25T11:00:00Z'
      },
      {
        id: 'comment-3',
        authorId: 'user-1',
        content: 'Same here! I budget about 10% for unexpected costs.',
        createdAt: '2025-10-25T11:30:00Z'
      }
    ],
    createdAt: '2025-10-24T16:45:00Z'
  },
  {
    id: 'post-4',
    authorId: 'user-1',
    content: 'Planning a vacation on a budget? Book flights on Tuesday afternoons and hotels on Sunday nights for the best deals! 🏖️✈️',
    reactions: [
      { type: 'like', count: 31 },
      { type: 'helpful', count: 22 }
    ],
    comments: [],
    createdAt: '2025-10-28T08:15:00Z'
  }
];

// Mock AI conversation
export const mockAIMessages: AIMessage[] = [
  {
    id: 'ai-1',
    role: 'assistant',
    content: 'Hi Sarah! I\'m your AI Budget Assistant. I can help you analyze your spending, suggest ways to save, and answer questions about your projects. What would you like to know?',
    timestamp: '2025-11-05T09:00:00Z'
  }
];

// Helper function to get spending by project
export function getSpendingByProject(projectId: string): SpendingEntry[] {
  return mockSpendingEntries.filter(entry => entry.projectId === projectId);
}

// Helper function to calculate total spending
export function calculateTotalSpending(projectId: string): number {
  return getSpendingByProject(projectId).reduce((sum, entry) => sum + entry.amount, 0);
}

// Helper function to get spending by category
export function getSpendingByCategory(projectId: string): Record<string, number> {
  const entries = getSpendingByProject(projectId);
  const byCategory: Record<string, number> = {};
  
  entries.forEach(entry => {
    if (!byCategory[entry.category]) {
      byCategory[entry.category] = 0;
    }
    byCategory[entry.category] += entry.amount;
  });
  
  return byCategory;
}

// Helper function to get planned budget by project
export function getPlannedBudgetsByProject(projectId: string): PlannedBudget[] {
  return mockPlannedBudgets.filter(budget => budget.projectId === projectId);
}

// Helper function to calculate total planned budget
export function calculateTotalPlanned(projectId: string): number {
  return getPlannedBudgetsByProject(projectId).reduce((sum, budget) => sum + budget.plannedAmount, 0);
}

// Common spending categories
export const spendingCategories = [
  'Transportation',
  'Accommodation',
  'Food',
  'Activities',
  'Insurance',
  'Materials',
  'Labor',
  'Equipment',
  'Marketing',
  'Software',
  'Utilities',
  'Health',
  'Entertainment',
  'Permits',
  'Other'
];

// Currency options
export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
];
