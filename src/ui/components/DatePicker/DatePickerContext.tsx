"use client";

import { createContext, useContext } from "react";

export interface DatePickerContextValue {
  selectedDate: Date | null;
  selectedRange: { start: Date | null; end: Date | null } | null;
  mode: "single" | "range";
  onDateChange: (date: Date | null) => void;
  onRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  locale?: Locale;
}

export const DatePickerContext = createContext<
  DatePickerContextValue | undefined
>(undefined);

export function useDatePickerContext(): DatePickerContextValue {
  const context = useContext(DatePickerContext);
  if (!context) {
    throw new Error(
      "DatePicker components must be used within a DatePicker component",
    );
  }
  return context;
}

export function useDatePickerContextOptional():
  | DatePickerContextValue
  | undefined {
  return useContext(DatePickerContext);
}

// Locale type - will be provided by date-fns
export interface Locale {
  code?: string;
  localize?: unknown;
  formatLong?: unknown;
  format?: unknown;
  match?: unknown;
  options?: unknown;
}
