import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-xs font-arcade uppercase leading-none text-[color:var(--neon-cyan)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'flex h-10 w-full rounded-none border-2 border-[color:var(--neon-cyan)]/40 bg-[color:var(--inset-bg)] px-3 py-2 text-lg font-terminal text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus-visible:outline-none focus-visible:border-[color:var(--neon-cyan)] focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[color:var(--neon-red)] focus-visible:border-[color:var(--neon-red)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-[color:var(--neon-red)]">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
