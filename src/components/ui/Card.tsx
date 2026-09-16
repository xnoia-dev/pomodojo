import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-none',
          {
            'bg-[rgba(var(--overlay-rgb),0.05)] backdrop-blur-sm border border-[color:var(--neon-cyan)]/30': variant === 'glass',
            'bg-[color:var(--card)] border border-[color:var(--neon-magenta)]/40': variant === 'default',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('flex flex-col space-y-1.5 p-4 pb-3 border-b border-[color:var(--hairline)]', className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('p-4', className)}
        {...props}
      />
    );
  }
);
CardContent.displayName = 'CardContent';
