import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'premium';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', type = 'button', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
    
    const variants = {
      default: 'bg-primary hover:bg-[#07070d] text-cohereBlack hover:text-white border border-transparent hover:border-white/20',
      secondary: 'bg-surface1 text-textPrimary hover:bg-border1/65 border border-transparent',
      outline: 'border border-border1 hover:border-textMuted text-textPrimary hover:bg-surface1 bg-transparent',
      ghost: 'text-textSecondary hover:text-textPrimary hover:bg-surface1 bg-transparent',
      premium: 'bg-secondary hover:bg-secondary/90 text-white font-semibold border border-transparent',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-xs',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...(props as any)}
      />
    );
  }
);

Button.displayName = 'Button';
