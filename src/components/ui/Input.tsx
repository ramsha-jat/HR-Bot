import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-muted flex items-center">{leftIcon}</span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-surface text-primary placeholder:text-muted border border-border rounded-lg px-3 py-2 font-sans shadow-soft focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-muted flex items-center">{rightIcon}</span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
