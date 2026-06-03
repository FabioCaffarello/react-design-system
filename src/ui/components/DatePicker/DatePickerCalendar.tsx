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
import { getSpacingClass } from "../../tokens/spacing";

export interface DatePickerCalendarProps extends HTMLAttributes<HTMLDivElement> {
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

  // Initial focusedDate: prefer selectedDate if in currentMonth, else today
  // if in currentMonth, else first of currentMonth. Always non-null so
  // exactly one cell has tabIndex=0 — required for canonical grid roving
  // tabindex (Tab enters once, arrows navigate within).
  const [focusedDate, setFocusedDate] = useState<Date>(() => {
    const today = new Date();
    const initialMonth =
      controlledMonth || selectedDate || selectedRange?.start || today;
    if (selectedDate && isSameMonth(selectedDate, initialMonth)) {
      return selectedDate;
    }
    if (isSameMonth(today, initialMonth)) {
      return today;
    }
    return new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1);
  });

  // Update current month if controlled
  useEffect(() => {
    if (controlledMonth) {
      setCurrentMonth(controlledMonth);
    }
  }, [controlledMonth]);

  // Roving tabindex: when focusedDate changes (via arrow keys or initial
  // mount), move the DOM focus to the matching cell. Without this, axe
  // sees a correct grid structure but the keyboard experience is broken
  // — arrow keys change only the state, not the actual focus.
  useEffect(() => {
    if (!calendarRef.current) return;
    const cell = calendarRef.current.querySelector<HTMLElement>(
      `[data-date="${focusedDate.toISOString()}"]`,
    );
    if (cell) cell.focus();
  }, [focusedDate]);

  // Effective focused date for tabIndex assignment: if focusedDate is not
  // in currentMonth (e.g. user clicked Prev/Next via mouse), still keep
  // exactly one cell with tabIndex=0 so Tab can re-enter the grid. Pick a
  // sensible fallback in the visible month.
  const effectiveFocusedDate = (() => {
    if (isSameMonth(focusedDate, currentMonth)) return focusedDate;
    const today = new Date();
    if (isSameMonth(today, currentMonth)) return today;
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  })();

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

  // Chunk days into rows of 7 (one per week). The previous implementation
  // rendered all ~35 day cells as direct children of a single CSS grid div,
  // which made role="grid" structurally invalid (grid must contain rows;
  // rows must contain gridcells). Each week is now a role="row".
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div
      ref={calendarRef}
      className={`${getSpacingClass("base", "p")} ${className}`}
      {...props}
    >
      {/* Header with month navigation — sits OUTSIDE the role="grid" so
          the grid's direct children are only rows. */}
      <div
        className={`flex items-center justify-between ${getSpacingClass("base", "mb")}`}
      >
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

      <div role="grid" aria-label="Calendar">
        {/* Weekday header row */}
        <div
          role="row"
          className={`grid grid-cols-7 ${getSpacingClass("xs", "gap")} ${getSpacingClass("sm", "mb")}`}
        >
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              role="columnheader"
              className={`text-center text-xs font-medium text-fg-tertiary ${getSpacingClass("xs", "py")}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid — one role="row" per week, role="gridcell" per day.
            The buttons carry role="gridcell" explicitly: the explicit role
            overrides the implicit button role, so aria-selected (allowed on
            gridcell, prohibited on button) becomes valid. */}
        {weeks.map((week, weekIdx) => (
          <div
            role="row"
            key={`week-${weekIdx}`}
            className={`grid grid-cols-7 ${getSpacingClass("xs", "gap")}`}
          >
            {week.map((date, dayIdx) => {
              if (!date) {
                return (
                  <div
                    role="gridcell"
                    key={`empty-${weekIdx}-${dayIdx}`}
                    className="aspect-square"
                  />
                );
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
              const isFocused = isSameDay(date, focusedDate);
              // Roving tabindex: exactly one cell has tabIndex=0 per render,
              // and it is the effective focused cell. Other cells are
              // tabIndex=-1 (programmatically focusable via arrows, but
              // skipped by Tab). When focusedDate is outside currentMonth
              // (mouse-driven Prev/Next month nav), effectiveFocusedDate
              // picks a fallback so the grid never loses its single tab stop.
              const isTabStop = isSameDay(date, effectiveFocusedDate);

              return (
                <button
                  key={date.toISOString()}
                  role="gridcell"
                  type="button"
                  data-date={date.toISOString()}
                  tabIndex={isTabStop ? 0 : -1}
                  onClick={() => handleDateClick(date)}
                  onKeyDown={(e) => handleKeyDown(e, date)}
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
                    ? "text-fg-disabled cursor-not-allowed opacity-50"
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
        ))}
      </div>
    </div>
  );
}
