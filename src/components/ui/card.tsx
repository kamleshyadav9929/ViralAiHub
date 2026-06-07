import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  animateEntry?: boolean;
  delayIndex?: number;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = true, animateEntry = false, delayIndex = 0, ...props }, ref) => {
    if (animateEntry) {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, delay: delayIndex * 0.05, ease: 'easeOut' }}
          className={cn(
            'glass-panel rounded-2xl overflow-hidden transition-all duration-300',
            hoverEffect && 'glass-panel-hover',
            className
          )}
          {...props as any}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'glass-panel rounded-2xl overflow-hidden transition-all duration-300',
          hoverEffect && 'glass-panel-hover',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 pb-3 flex flex-col space-y-1.5', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-lg font-bold text-textPrimary leading-none', className)} {...props} />
);

export const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-textSecondary', className)} {...props} />
);

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 pt-0 text-textSecondary text-sm', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 pt-0 flex items-center border-t border-border1 mt-4', className)} {...props} />
);
