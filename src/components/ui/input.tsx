import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  showIcon?: boolean;
  onPressIcon?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, showIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
            showIcon && 'pr-10',
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
        {showIcon && (
          <button onClick={props.onPressIcon}>
            <img
              src="/icons/trash.svg"
              alt=""
              className="absolute top-3 right-3 w-5 h-5"
            />
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
