import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col w-full ${className}`}>
        <label className="mb-1 text-sm font-semibold text-primary">
          {label}
        </label>
        <input
          ref={ref}
          className={`px-3 py-2 rounded-lg border outline-none transition-colors bg-base text-primary
            ${error ? 'border-red-500 focus:border-red-500' : 'border-primary/50 focus:border-primary'}
            disabled:opacity-50 disabled:cursor-not-allowed`}
          {...props}
        />
        {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

InputText.displayName = 'InputText';
