import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface MemberAvatarProps {
  name: string;
  avatar?: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function MemberAvatar({ name, avatar, role, size = 'md', showTooltip = true }: MemberAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };
  
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarElement = (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={avatar} alt={`${name}'s avatar`} />
      <AvatarFallback className="bg-primary/10 text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  if (!showTooltip) {
    return avatarElement;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {avatarElement}
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
          {role && <p className="text-muted-foreground">{role}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
