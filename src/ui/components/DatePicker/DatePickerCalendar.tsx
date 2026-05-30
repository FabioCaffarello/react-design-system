"use client";

import {
  useState,
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDatePickerContext } from "./DatePickerContext";
import Button from "../../primitives/Button/Button";
import { getRadiusClass } from "../../tokens";

export interface DatePickerCalendarProps
  extends HTMLAttributes<HTMLDivElement> {
  month?: Date; // Current month to display
  onMonthChange?: (month: Date) => void;
}

// Helper functions for date manipulation (without date-fns dependency)
function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

function isDateInRange(
  date: Date,
  start: Date | null,
  end: Date | null,
): boolean {
  if (!start || !end) return false;
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[],
): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDates?.some((d) => isSameDay(date, d))) return true;
  return false;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DatePickerCalendar({
  month: controlledMonth,
  onMonthChange,
  className = "",
  ...props
}: DatePickerCalendarProps) {
  const {
    selectedDate,
    selectedRange,
    mode,
    onDateChange,
    onRangeChange,
    minDate,
    maxDate,
    disabledDates,
  } = useDatePickerContext();

  const [currentMonth, setCurrentMonth] = useState<Date>(
    controlledMonth || selectedDate || selectedRange?.start || new Date(),
  );
  const calendarRef = useRef<HTMLDivElement>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  // Update current month if controlled
  useEffect(() => {
    if (controlledMonth) {
      setCurrentMonth(controlledMonth);
    }
  }, [controlledMonth]);

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days: (Date | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
    );
  }

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date, minDate, maxDate, disabledDates)) return;

    if (mode === "single") {
      onDateChange(date);
    } else if (mode === "range") {
      const currentRange = selectedRange || { start: null, end: null };
      if (!currentRange.start || (currentRange.start && currentRange.end)) {
        // Start new range
        onRangeChange({ start: date, end: null });
      } else if (currentRange.start && !currentRange.end) {
        // Complete range
        if (date < currentRange.start) {
          onRangeChange({ start: date, end: currentRange.start });
        } else {
          onRangeChange({ start: currentRange.start, end: date });
        }
      }
    }
  };

  const handlePreviousMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1,
    );
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1,
    );
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, date: Date) => {
    let newDate: Date | null = null;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        newDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - 1,
        );
        break;
      case "ArrowRight":
        e.preventDefault();
        newDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        newDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - 7,
        );
        break;
      case "ArrowDown":
        e.preventDefault();
        newDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 7,
        );
        break;
      case "Home":
        e.preventDefault();
        newDate = new Date(date.getFullYear(), date.getMonth(), 1);
        break;
      case "End":
        e.preventDefault();
        newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        handleDateClick(date);
        return;
    }

    if (newDate) {
      // Adjust month if needed
      if (!isSameMonth(newDate, currentMonth)) {
        setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
      }
      setFocusedDate(newDate);
    }
  };

  return (
    <div
      ref={calendarRef}
      className={`p-4 ${className}`}
      role="grid"
      aria-label="Calendar"
      {...props}
    >
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="iconOnly"
          size="sm"
          onClick={handlePreviousMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-semibold">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <Button
          variant="iconOnly"
          size="sm"
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-fg-tertiary py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const isSelected =
            mode === "single"
              ? isSameDay(date, selectedDate)
              : isSameDay(date, selectedRange?.start || null) ||
                isSameDay(date, selectedRange?.end || null);

          const isInRange =
            mode === "range" && selectedRange
              ? isDateInRange(date, selectedRange.start, selectedRange.end)
              : false;

          const isDisabled = isDateDisabled(
            date,
            minDate,
            maxDate,
            disabledDates,
          );
          const isToday = isSameDay(date, new Date());
          const isFocused = focusedDate && isSameDay(date, focusedDate);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => handleDateClick(date)}
              onKeyDown={(e) => handleKeyDown(e, date)}
              disabled={isDisabled}
              className={`
                aspect-square
                text-sm
                ${getRadiusClass("md")}
                transition-colors
                focus:outline-none
                focus:ring-2
                focus:ring-offset-1
                ${
                  isDisabled
                    ? "text-fg-disabled cursor-not-allowed"
                    : isSelected
                      ? "bg-surface-brand-strong text-fg-inverse font-semibold"
                      : isInRange
                        ? "bg-surface-brand-muted text-fg-brand-emphasis"
                        : isToday
                          ? "border-2 border-line-brand font-semibold"
                          : isFocused
                            ? "bg-surface-brand-muted"
                            : "hover:bg-surface-active"
                }
              `}
              aria-label={date.toDateString()}
              aria-selected={isSelected}
              aria-disabled={isDisabled}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
