"use client";

import { useState, useRef, useEffect, type HTMLAttributes } from "react";
import { Calendar } from "lucide-react";
import { useDatePickerContext } from "./DatePickerContext";
import Input from "../../primitives/Input/Input";
import Button from "../../primitives/Button/Button";

export interface DatePickerInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onFocus"> {
  placeholder?: string;
  format?: string; // Date format string (e.g., 'MM/dd/yyyy')
  showCalendarButton?: boolean;
  "aria-label"?: string;
  onFocus?: () => void;
}

// Simple date formatting without date-fns dependency
function formatDate(date: Date, format: string = "yyyy-MM-dd"): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return format
    .replace("yyyy", String(year))
    .replace("MM", month)
    .replace("dd", day)
    .replace("MM/dd/yyyy", `${month}/${day}/${year}`)
    .replace("dd/MM/yyyy", `${day}/${month}/${year}`);
}

function parseDate(value: string): Date | null {
  if (!value) return null;

  // Try ISO format first (yyyy-MM-dd)
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime())) return date;
  }

  // Try MM/dd/yyyy
  const usMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (usMatch) {
    const [, month, day, year] = usMatch;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime())) return date;
  }

  // Try dd/MM/yyyy
  const euMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (euMatch) {
    const [, day, month, year] = euMatch;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime())) return date;
  }

  return null;
}

export function DatePickerInput({
  placeholder = "Select date",
  format = "yyyy-MM-dd",
  showCalendarButton = true,
  "aria-label": ariaLabel,
  onFocus,
  className = "",
  ...props
}: DatePickerInputProps) {
  const { selectedDate, selectedRange, mode, onDateChange } =
    useDatePickerContext();
  const [inputValue, setInputValue] = useState("");
  const [_isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when selected date changes
  useEffect(() => {
    if (mode === "single" && selectedDate) {
      setInputValue(formatDate(selectedDate, format));
    } else if (mode === "range" && selectedRange) {
      if (selectedRange.start && selectedRange.end) {
        setInputValue(
          `${formatDate(selectedRange.start, format)} - ${formatDate(selectedRange.end, format)}`,
        );
      } else if (selectedRange.start) {
        setInputValue(formatDate(selectedRange.start, format));
      } else {
        setInputValue("");
      }
    } else {
      setInputValue("");
    }
  }, [selectedDate, selectedRange, mode, format]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (mode === "single") {
      const date = parseDate(value);
      onDateChange(date);
    }
    // Range mode parsing would be more complex, handled by calendar
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Validate and format on blur
    if (inputValue && mode === "single") {
      const date = parseDate(inputValue);
      if (date) {
        setInputValue(formatDate(date, format));
      }
    }
  };

  const handleCalendarClick = () => {
    inputRef.current?.focus();
    // Calendar popup would be triggered by parent component
  };

  return (
    <div className={`relative ${className}`} {...props}>
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        rightIcon={
          showCalendarButton ? (
            <Button
              variant="iconOnly"
              size="sm"
              onClick={handleCalendarClick}
              aria-label="Open calendar"
              type="button"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
