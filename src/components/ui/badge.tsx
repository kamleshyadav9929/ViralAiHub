import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'difficulty' | 'outline' | 'success';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const Badge = ({ className, variant = 'default', difficulty, ...props }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border';
  
  const getDifficultyStyles = (diff?: 'Beginner' | 'Intermediate' | 'Advanced') => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Intermediate':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'Advanced':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-white/5 text-textSecondary border-white/10';
    }
  };

  const variants = {
    default: 'bg-secondary/10 text-secondary border-secondary/20',
    difficulty: getDifficultyStyles(difficulty),
    outline: 'border border-border1 text-textSecondary bg-transparent',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
};
