import React, { useState } from 'react';
import { AppProvider, useApp } from './lib/AppContext';
import { Toaster } from './components/ui/sonner';
import { TopNav } from './components/TopNav';
import { AuthPage } from './components/pages/AuthPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { CreateProjectPage } from './components/pages/CreateProjectPage';
import { ProjectWorkspacePage } from './components/pages/ProjectWorkspacePage';
import { CommunityFeedPage } from './components/pages/CommunityFeedPage';
import { AIAssistantPage } from './components/pages/AIAssistantPage';
import { ProfileSettingsPage } from './components/pages/ProfileSettingsPage';

type Page = 'dashboard' | 'create-project' | 'project' | 'community' | 'ai-assistant' | 'profile';

function AppContent() {
  const { isAuthenticated } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();

  const handleNavigate = (page: string, projectId?: string) => {
    setCurrentPage(page as Page);
    if (projectId) {
      setSelectedProjectId(projectId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main>
        {currentPage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        {currentPage === 'create-project' && <CreateProjectPage onNavigate={handleNavigate} />}
        {currentPage === 'project' && selectedProjectId && (
          <ProjectWorkspacePage projectId={selectedProjectId} onNavigate={handleNavigate} />
        )}
        {currentPage === 'community' && <CommunityFeedPage />}
        {currentPage === 'ai-assistant' && <AIAssistantPage />}
        {currentPage === 'profile' && <ProfileSettingsPage />}
      </main>

      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
