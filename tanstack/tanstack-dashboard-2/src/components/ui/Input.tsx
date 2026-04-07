/**
 * Input Component - Reusable input with label and error
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            px-4 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
        {helperText && !error && <span className="text-sm text-gray-500">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
