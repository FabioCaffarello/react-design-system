"use client";

import { useState, useEffect, useCallback, type KeyboardEvent } from "react";
import { Clock } from "lucide-react";
import Input from "../../primitives/Input/Input";
import Popover from "../Popover/Popover";
import Button from "../../primitives/Button/Button";
import { getSpacingClass } from "../../tokens/spacing";

export type TimeFormat = "12h" | "24h";

export interface TimePickerProps {
  value?: string; // Format: "HH:mm" for 24h or "hh:mm AM/PM" for 12h
  defaultValue?: string;
  format?: TimeFormat;
  onChange?: (value: string) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  className?: string;
}

/**
 * TimePicker Component
 *
 * A time picker component for selecting time values.
 * Supports 12h and 24h formats.
 *
 * @example
 * ```tsx
 * <TimePicker
 *   value="14:30"
 *   format="24h"
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
export default function TimePicker({
  value: controlledValue,
  defaultValue,
  format = "24h",
  onChange,
  disabled = false,
  label,
  error = false,
  helperText,
  className = "",
}: TimePickerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [amPm, setAmPm] = useState<"AM" | "PM">("AM");
  const [open, setOpen] = useState(false);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Parse time value
  const parseTime = useCallback(
    (timeStr: string) => {
      if (!timeStr) return { hours: 12, minutes: 0, amPm: "AM" as const };

      if (format === "24h") {
        const [h, m] = timeStr.split(":").map(Number);
        return {
          hours: Number.isFinite(h) ? h : 12,
          minutes: Number.isFinite(m) ? m : 0,
          amPm: "AM" as const,
        };
      } else {
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
          return {
            hours: parseInt(match[1]),
            minutes: parseInt(match[2]),
            amPm: match[3].toUpperCase() as "AM" | "PM",
          };
        }
        return { hours: 12, minutes: 0, amPm: "AM" as const };
      }
    },
    [format],
  );

  // Format time value
  const formatTime = (h: number, m: number, ap?: "AM" | "PM"): string => {
    if (format === "24h") {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    } else {
      const displayHours =
        ap === "PM" && h !== 12 ? h + 12 : ap === "AM" && h === 12 ? 0 : h;
      return `${String(displayHours === 0 ? 12 : displayHours > 12 ? displayHours - 12 : displayHours).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ap || "AM"}`;
    }
  };

  // Initialize from value
  useEffect(() => {
    if (currentValue) {
      const parsed = parseTime(currentValue);
      setHours(parsed.hours);
      setMinutes(parsed.minutes);
      setAmPm(parsed.amPm);
    }
  }, [currentValue, parseTime]);

  const handleHoursChange = (newHours: number) => {
    const validHours =
      format === "24h"
        ? Math.max(0, Math.min(23, newHours))
        : Math.max(1, Math.min(12, newHours));

    setHours(validHours);
    const newValue = formatTime(
      validHours,
      minutes,
      format === "12h" ? amPm : undefined,
    );

    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleMinutesChange = (newMinutes: number) => {
    const validMinutes = Math.max(0, Math.min(59, newMinutes));
    setMinutes(validMinutes);
    const newValue = formatTime(
      hours,
      validMinutes,
      format === "12h" ? amPm : undefined,
    );

    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleAmPmToggle = () => {
    const newAmPm = amPm === "AM" ? "PM" : "AM";
    setAmPm(newAmPm);
    const newValue = formatTime(hours, minutes, newAmPm);

    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const incrementHours = () => {
    if (format === "24h") {
      handleHoursChange((hours + 1) % 24);
    } else {
      const newHours = hours === 12 ? 1 : hours + 1;
      handleHoursChange(newHours);
    }
  };

  const decrementHours = () => {
    if (format === "24h") {
      handleHoursChange(hours === 0 ? 23 : hours - 1);
    } else {
      const newHours = hours === 1 ? 12 : hours - 1;
      handleHoursChange(newHours);
    }
  };

  const incrementMinutes = () => {
    handleMinutesChange((minutes + 1) % 60);
  };

  const decrementMinutes = () => {
    handleMinutesChange(minutes === 0 ? 59 : minutes - 1);
  };

  // Keyboard affordance for the readOnly trigger Input: a focused
  // readOnly <input> never synthesizes a click, so the Popover's
  // wrapper onClick (mouse-only) leaves keyboard users unable to open
  // the dialog at all. Enter/Space toggle; ArrowUp/ArrowDown open.
  // Gated on `disabled` so a disabled control never surfaces its popup.
  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const timePickerContent = (
    <div className={`${getSpacingClass("base", "p")} min-w-48`}>
      <div
        className={`flex items-center justify-center ${getSpacingClass("base", "gap")}`}
      >
        {/* Hours */}
        <div
          className={`flex flex-col items-center ${getSpacingClass("sm", "gap")}`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={incrementHours}
            disabled={disabled}
            aria-label="Increment hours"
          >
            ↑
          </Button>
          <div
            role="spinbutton"
            tabIndex={disabled ? -1 : 0}
            aria-label="Hours"
            aria-valuenow={hours}
            aria-valuemin={format === "24h" ? 0 : 1}
            aria-valuemax={format === "24h" ? 23 : 12}
            aria-valuetext={String(hours).padStart(2, "0")}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                incrementHours();
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                decrementHours();
              }
            }}
            className="text-2xl font-mono font-semibold w-12 text-center"
          >
            {String(hours).padStart(2, "0")}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={decrementHours}
            disabled={disabled}
            aria-label="Decrement hours"
          >
            ↓
          </Button>
        </div>

        <div className="text-2xl font-semibold">:</div>

        {/* Minutes */}
        <div
          className={`flex flex-col items-center ${getSpacingClass("sm", "gap")}`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={incrementMinutes}
            disabled={disabled}
            aria-label="Increment minutes"
          >
            ↑
          </Button>
          <div
            role="spinbutton"
            tabIndex={disabled ? -1 : 0}
            aria-label="Minutes"
            aria-valuenow={minutes}
            aria-valuemin={0}
            aria-valuemax={59}
            aria-valuetext={String(minutes).padStart(2, "0")}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                incrementMinutes();
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                decrementMinutes();
              }
            }}
            className="text-2xl font-mono font-semibold w-12 text-center"
          >
            {String(minutes).padStart(2, "0")}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={decrementMinutes}
            disabled={disabled}
            aria-label="Decrement minutes"
          >
            ↓
          </Button>
        </div>

        {/* AM/PM for 12h format */}
        {format === "12h" && (
          <div
            className={`flex flex-col ${getSpacingClass("sm", "gap")} ${getSpacingClass("sm", "ml")}`}
          >
            <Button
              variant={amPm === "AM" ? "primary" : "outline"}
              size="sm"
              onClick={() => handleAmPmToggle()}
              disabled={disabled}
            >
              AM
            </Button>
            <Button
              variant={amPm === "PM" ? "primary" : "outline"}
              size="sm"
              onClick={() => handleAmPmToggle()}
              disabled={disabled}
            >
              PM
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={className}>
      <Popover
        open={disabled ? false : open}
        onOpenChange={(next) => {
          if (!disabled) setOpen(next);
        }}
        trigger={
          <Input
            label={label}
            value={
              currentValue ||
              formatTime(hours, minutes, format === "12h" ? amPm : undefined)
            }
            readOnly
            disabled={disabled}
            error={error}
            helperText={helperText}
            leftIcon={<Clock className="h-4 w-4" />}
            className="cursor-pointer"
            role="combobox"
            aria-haspopup="dialog"
            aria-expanded={!disabled && open}
            onKeyDown={handleTriggerKeyDown}
          />
        }
        placement="bottom-start"
        showCloseButton
        title="Select Time"
      >
        {timePickerContent}
      </Popover>
    </div>
  );
}
