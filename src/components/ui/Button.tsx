import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-none font-arcade uppercase transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none',
          {
            // Primary - magenta arcade button
            'arcade-btn bg-[color:var(--neon-magenta)]/10 text-[color:var(--neon-magenta)] hover:bg-[color:var(--neon-magenta)]/20 focus-visible:ring-[color:var(--neon-magenta)]': variant === 'primary',

            // Secondary - cyan arcade button
            'arcade-btn bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)] hover:bg-[color:var(--neon-cyan)]/20': variant === 'secondary',

            // Outline - yellow outline
            'arcade-btn bg-transparent text-[color:var(--neon-yellow)] hover:bg-[color:var(--neon-yellow)]/10': variant === 'outline',

            // Ghost - subtle, no shadow
            'text-[color:var(--foreground)] hover:bg-[rgba(var(--overlay-rgb),0.1)] border border-transparent': variant === 'ghost',

            // Sizes
            'h-8 px-3 text-[10px]': size === 'sm',
            'h-10 px-4 text-xs': size === 'md',
            'h-12 px-8 text-sm': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
