import React, { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectDropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export const SelectDropdown = forwardRef<HTMLSelectElement, SelectDropdownProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col w-full ${className}`}>
        <label className="mb-1 text-sm font-semibold text-primary">
          {label}
        </label>
        <select
          ref={ref}
          className={`px-3 py-2 rounded-lg border outline-none transition-colors bg-base text-primary
            ${error ? 'border-red-500 focus:border-red-500' : 'border-primary/50 focus:border-primary'}
            disabled:opacity-50 disabled:cursor-not-allowed`}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

SelectDropdown.displayName = 'SelectDropdown';
