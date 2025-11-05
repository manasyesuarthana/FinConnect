import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Project,
  SpendingEntry,
  PlannedBudget,
  CommunityPost,
  AIMessage,
  mockCurrentUser,
  mockUsers,
  mockProjects,
  mockSpendingEntries,
  mockPlannedBudgets,
  mockCommunityPosts,
  mockAIMessages
} from './mockData';

interface AppContextType {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Projects
  projects: Project[];
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'createdBy'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  
  // Spending Entries
  spendingEntries: SpendingEntry[];
  addSpendingEntry: (entry: Omit<SpendingEntry, 'id' | 'createdAt'>) => void;
  updateSpendingEntry: (id: string, updates: Partial<SpendingEntry>) => void;
  deleteSpendingEntry: (id: string) => void;
  getEntriesByProject: (projectId: string) => SpendingEntry[];
  
  // Planned Budgets
  plannedBudgets: PlannedBudget[];
  updatePlannedBudget: (projectId: string, budgets: PlannedBudget[]) => void;
  getPlannedBudgetsByProject: (projectId: string) => PlannedBudget[];
  
  // Community
  communityPosts: CommunityPost[];
  createPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'reactions' | 'comments'>) => void;
  reactToPost: (postId: string, reactionType: string) => void;
  addComment: (postId: string, content: string) => void;
  
  // AI Assistant
  aiMessages: AIMessage[];
  sendAIMessage: (content: string, projectContext?: string) => Promise<void>;
  clearAIHistory: () => void;
  
  // Users
  getUserById: (id: string) => User | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [spendingEntries, setSpendingEntries] = useState<SpendingEntry[]>(mockSpendingEntries);
  const [plannedBudgets, setPlannedBudgets] = useState<PlannedBudget[]>(mockPlannedBudgets);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [aiMessages, setAIMessages] = useState<AIMessage[]>(mockAIMessages);

  // Auto-login for demo purposes
  useEffect(() => {
    const storedAuth = localStorage.getItem('finconnect_auth');
    if (storedAuth === 'true') {
      setCurrentUser(mockCurrentUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Auth functions
  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentUser(mockCurrentUser);
    setIsAuthenticated(true);
    localStorage.setItem('finconnect_auth', 'true');
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser = { ...mockCurrentUser, name, email };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('finconnect_auth', 'true');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('finconnect_auth');
  };

  // Project functions
  const createProject = (project: Omit<Project, 'id' | 'createdAt' | 'createdBy'>) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id || 'user-1'
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    // Also clean up related data
    setSpendingEntries(spendingEntries.filter(e => e.projectId !== id));
    setPlannedBudgets(plannedBudgets.filter(b => b.projectId !== id));
  };

  const getProject = (id: string) => {
    return projects.find(p => p.id === id);
  };

  // Spending entry functions
  const addSpendingEntry = (entry: Omit<SpendingEntry, 'id' | 'createdAt'>) => {
    const newEntry: SpendingEntry = {
      ...entry,
      id: `spend-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSpendingEntries([...spendingEntries, newEntry]);
  };

  const updateSpendingEntry = (id: string, updates: Partial<SpendingEntry>) => {
    setSpendingEntries(spendingEntries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteSpendingEntry = (id: string) => {
    setSpendingEntries(spendingEntries.filter(e => e.id !== id));
  };

  const getEntriesByProject = (projectId: string) => {
    return spendingEntries.filter(e => e.projectId === projectId);
  };

  // Planned budget functions
  const updatePlannedBudget = (projectId: string, budgets: PlannedBudget[]) => {
    // Remove old budgets for this project and add new ones
    const otherBudgets = plannedBudgets.filter(b => b.projectId !== projectId);
    setPlannedBudgets([...otherBudgets, ...budgets]);
  };

  const getPlannedBudgetsByProject = (projectId: string) => {
    return plannedBudgets.filter(b => b.projectId === projectId);
  };

  // Community functions
  const createPost = (post: Omit<CommunityPost, 'id' | 'createdAt' | 'reactions' | 'comments'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      reactions: [],
      comments: [],
      createdAt: new Date().toISOString()
    };
    setCommunityPosts([newPost, ...communityPosts]);
  };

  const reactToPost = (postId: string, reactionType: string) => {
    setCommunityPosts(communityPosts.map(post => {
      if (post.id === postId) {
        const existingReaction = post.reactions.find(r => r.type === reactionType);
        if (existingReaction) {
          return {
            ...post,
            reactions: post.reactions.map(r =>
              r.type === reactionType ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...post,
            reactions: [...post.reactions, { type: reactionType, count: 1 }]
          };
        }
      }
      return post;
    }));
  };

  const addComment = (postId: string, content: string) => {
    setCommunityPosts(communityPosts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: `comment-${Date.now()}`,
          authorId: currentUser?.id || 'user-1',
          content,
          createdAt: new Date().toISOString()
        };
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  };

  // AI Assistant functions
  const sendAIMessage = async (content: string, projectContext?: string) => {
    // Add user message
    const userMessage: AIMessage = {
      id: `ai-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      projectContext
    };
    setAIMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock AI response based on the question
    let aiResponse = '';
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('overspend') || lowerContent.includes('over budget')) {
      aiResponse = 'Based on your spending data, you\'re currently spending within your planned budget for most categories. However, I notice your "Food" spending is 15% higher than planned. Consider meal planning and cooking at home more often to reduce this expense.';
    } else if (lowerContent.includes('save') || lowerContent.includes('reduce')) {
      aiResponse = 'Here are some personalized saving tips:\n\n1. Transportation: You\'ve spent $850 on flights. Consider using flight comparison tools and booking in advance for better deals.\n\n2. Food: Your food expenses could be reduced by 20-30% through meal prepping and limiting dining out to once per week.\n\n3. Set up automatic transfers to a savings account right after payday to make saving effortless.';
    } else if (lowerContent.includes('category') || lowerContent.includes('spending')) {
      aiResponse = 'Your top 3 spending categories are:\n\n1. Accommodation: $1,400 (28% of total)\n2. Transportation: $850 (17% of total)\n3. Materials: $450 (9% of total)\n\nYour spending pattern looks healthy and aligns with your vacation planning goals.';
    } else if (lowerContent.includes('budget') || lowerContent.includes('plan')) {
      aiResponse = 'Your current spending is $2,430 out of your $5,000 budget (49% used). You\'re on track! I recommend allocating the remaining $2,570 as follows:\n\n- Food: $800\n- Activities: $1,200\n- Contingency: $570\n\nThis will give you a comfortable buffer for unexpected expenses.';
    } else {
      aiResponse = 'I\'d be happy to help you with that! I can analyze your spending patterns, compare planned vs actual budgets, suggest ways to save money, or answer specific questions about your projects. What would you like to explore?';
    }
    
    const assistantMessage: AIMessage = {
      id: `ai-${Date.now() + 1}`,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
      projectContext
    };
    setAIMessages(prev => [...prev, assistantMessage]);
  };

  const clearAIHistory = () => {
    setAIMessages([mockAIMessages[0]]);
  };

  // User functions
  const getUserById = (id: string) => {
    return mockUsers[id];
  };

  const value: AppContextType = {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
    projects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    spendingEntries,
    addSpendingEntry,
    updateSpendingEntry,
    deleteSpendingEntry,
    getEntriesByProject,
    plannedBudgets,
    updatePlannedBudget,
    getPlannedBudgetsByProject,
    communityPosts,
    createPost,
    reactToPost,
    addComment,
    aiMessages,
    sendAIMessage,
    clearAIHistory,
    getUserById
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
