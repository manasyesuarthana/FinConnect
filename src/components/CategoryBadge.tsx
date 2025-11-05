import React from 'react';
import { Badge } from './ui/badge';

interface CategoryBadgeProps {
  category: string;
  variant?: 'default' | 'secondary' | 'outline';
}

const categoryColors: Record<string, string> = {
  Transportation: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  Accommodation: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  Food: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
  Activities: 'bg-green-100 text-green-700 hover:bg-green-100',
  Insurance: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100',
  Materials: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  Labor: 'bg-red-100 text-red-700 hover:bg-red-100',
  Equipment: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-100',
  Marketing: 'bg-pink-100 text-pink-700 hover:bg-pink-100',
  Software: 'bg-violet-100 text-violet-700 hover:bg-violet-100',
  Utilities: 'bg-teal-100 text-teal-700 hover:bg-teal-100',
  Health: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  Entertainment: 'bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-100',
  Permits: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  Other: 'bg-gray-100 text-gray-700 hover:bg-gray-100'
};

export function CategoryBadge({ category, variant = 'default' }: CategoryBadgeProps) {
  const colorClass = categoryColors[category] || categoryColors.Other;
  
  return (
    <Badge 
      variant={variant}
      className={variant === 'default' ? colorClass : ''}
    >
      {category}
    </Badge>
  );
}
