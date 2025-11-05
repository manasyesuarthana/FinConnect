import React, { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: 'full' | 'wide' | 'medium' | 'narrow';
}

export function PageLayout({ children, maxWidth = 'wide' }: PageLayoutProps) {
  const widthClasses = {
    full: 'max-w-full',
    wide: 'max-w-7xl',
    medium: 'max-w-4xl',
    narrow: 'max-w-2xl'
  };

  return (
    <div className={`mx-auto w-full ${widthClasses[maxWidth]} px-4 sm:px-6 lg:px-8 py-6`}>
      {children}
    </div>
  );
}
