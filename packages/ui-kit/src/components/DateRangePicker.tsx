import React from 'react';

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChangeStartDate: (date: string) => void;
  onChangeEndDate: (date: string) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 w-full ${className}`}>
      <div className="flex flex-col w-full">
        <label className="mb-1 text-sm font-semibold text-primary">Start Date</label>
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => onChangeStartDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-primary/50 outline-none focus:border-primary transition-colors bg-base text-primary w-full"
        />
      </div>
      <div className="flex flex-col w-full">
        <label className="mb-1 text-sm font-semibold text-primary">End Date</label>
        <input 
          type="date" 
          value={endDate}
          min={startDate}
          onChange={(e) => onChangeEndDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-primary/50 outline-none focus:border-primary transition-colors bg-base text-primary w-full"
        />
      </div>
    </div>
  );
};
