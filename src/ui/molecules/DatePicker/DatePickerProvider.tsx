'use client';

import { useState, type ReactNode } from 'react';
import { DatePickerContext, type DatePickerContextValue, type Locale } from './DatePickerContext';

export interface DatePickerProviderProps {
  children: ReactNode;
  mode?: 'single' | 'range';
  value?: Date | { start: Date | null; end: Date | null };
  defaultValue?: Date | { start: Date | null; end: Date | null };
  onValueChange?: (value: Date | { start: Date | null; end: Date | null } | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  locale?: Locale;
}

export function DatePickerProvider({
  children,
  mode = 'single',
  value: controlledValue,
  defaultValue,
  onValueChange,
  minDate,
  maxDate,
  disabledDates,
  locale,
}: DatePickerProviderProps) {
  // Initialize state
  const getInitialDate = () => {
    if (controlledValue !== undefined) return null; // Controlled mode
    if (defaultValue) {
      if (mode === 'single' && defaultValue instanceof Date) {
        return defaultValue;
      }
      if (mode === 'range' && typeof defaultValue === 'object' && 'start' in defaultValue) {
        return null; // Range handled separately
      }
    }
    return null;
  };

  const getInitialRange = () => {
    if (controlledValue !== undefined) return null; // Controlled mode
    if (defaultValue && mode === 'range' && typeof defaultValue === 'object' && 'start' in defaultValue) {
      return defaultValue;
    }
    return { start: null, end: null };
  };

  const [uncontrolledDate, setUncontrolledDate] = useState<Date | null>(getInitialDate());
  const [uncontrolledRange, setUncontrolledRange] = useState<{ start: Date | null; end: Date | null }>(getInitialRange());

  // Use controlled or uncontrolled state
  const selectedDate = mode === 'single'
    ? (controlledValue instanceof Date ? controlledValue : uncontrolledDate)
    : null;

  const selectedRange = mode === 'range'
    ? (controlledValue && typeof controlledValue === 'object' && 'start' in controlledValue
        ? controlledValue
        : uncontrolledRange)
    : null;

  const handleDateChange = (date: Date | null) => {
    if (mode !== 'single') return;
    
    if (controlledValue === undefined) {
      setUncontrolledDate(date);
    }
    onValueChange?.(date);
  };

  const handleRangeChange = (range: { start: Date | null; end: Date | null }) => {
    if (mode !== 'range') return;
    
    if (controlledValue === undefined) {
      setUncontrolledRange(range);
    }
    onValueChange?.(range);
  };

  const contextValue: DatePickerContextValue = {
    selectedDate,
    selectedRange,
    mode,
    onDateChange: handleDateChange,
    onRangeChange: handleRangeChange,
    minDate,
    maxDate,
    disabledDates,
    locale,
  };

  return (
    <DatePickerContext.Provider value={contextValue}>
      {children}
    </DatePickerContext.Provider>
  );
}
