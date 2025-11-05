import React from 'react';
import { useApp } from '../lib/AppContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MemberAvatar } from './MemberAvatar';
import { Wallet, LayoutDashboard, FolderPlus, MessageSquare, User, LogOut, Bot } from 'lucide-react';

interface TopNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function TopNav({ currentPage, onNavigate }: TopNavProps) {
  const { currentUser, logout } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot }
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-2 py-1"
            aria-label="Go to dashboard"
          >
            <div className="rounded-lg bg-primary p-2">
              <Wallet className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="hidden sm:inline">FinConnect</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                onClick={() => onNavigate(item.id)}
                className="gap-2"
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onNavigate('create-project')}
              className="gap-2"
              aria-label="Create new project"
            >
              <FolderPlus className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">New Project</span>
            </Button>

            {/* User Menu */}
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0"
                    aria-label="Open user menu"
                  >
                    <MemberAvatar
                      name={currentUser.name}
                      avatar={currentUser.avatar}
                      size="md"
                      showTooltip={false}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p>{currentUser.name}</p>
                      <p className="text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Mobile navigation items */}
                  <div className="md:hidden">
                    {navItems.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                      >
                        <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </div>
                  
                  <DropdownMenuItem onClick={() => onNavigate('profile')}>
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    Profile & Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
