'use client';

import React, { useState, useRef, useEffect, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { DatePickerProvider } from './DatePickerProvider';
import { DatePickerInput } from './DatePickerInput';
import { DatePickerCalendar } from './DatePickerCalendar';
import { getRadiusClass, getShadowClass } from '../../tokens';

export interface DatePickerProps {
  children?: ReactNode;
  mode?: 'single' | 'range';
  value?: Date | { start: Date | null; end: Date | null };
  defaultValue?: Date | { start: Date | null; end: Date | null };
  onValueChange?: (value: Date | { start: Date | null; end: Date | null } | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  placeholder?: string;
  format?: string;
  showCalendarButton?: boolean;
  'aria-label'?: string;
  className?: string;
}

/**
 * DatePicker Component
 * 
 * A flexible date picker component with single date and range selection.
 * Supports keyboard navigation and basic localization.
 * 
 * @example
 * ```tsx
 * // Single date
 * <DatePicker
 *   value={selectedDate}
 *   onValueChange={setSelectedDate}
 * />
 * 
 * // Date range
 * <DatePicker
 *   mode="range"
 *   value={{ start: rangeStart, end: rangeEnd }}
 *   onValueChange={setRange}
 * />
 * 
 * // Compound components
 * <DatePicker>
 *   <DatePicker.Input />
 *   <DatePicker.Calendar />
 * </DatePicker>
 * ```
 */
function DatePickerComponent({
  children,
  mode = 'single',
  value,
  defaultValue,
  onValueChange,
  minDate,
  maxDate,
  disabledDates,
  placeholder,
  format,
  showCalendarButton = true,
  'aria-label': ariaLabel,
  className = '',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside both container and popup
      const clickedInsideContainer = containerRef.current?.contains(target) ?? false;
      const clickedInsidePopup = popupRef.current?.contains(target) ?? false;
      
      // Close if clicked outside both container and popup
      if (!clickedInsideContainer && !clickedInsidePopup) {
        setIsOpen(false);
      }
    };

    // Use mousedown instead of click to catch the event before it bubbles
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // If children provided, use compound component API
  if (children) {
    return (
      <DatePickerProvider
        mode={mode}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
      >
        {children}
      </DatePickerProvider>
    );
  }

  // Otherwise, use simplified API
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <DatePickerProvider
        mode={mode}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
      >
        <DatePickerInput
          placeholder={placeholder}
          format={format}
          showCalendarButton={showCalendarButton}
          aria-label={ariaLabel}
          onFocus={() => setIsOpen(true)}
        />
        {isOpen && (
          <DatePickerPopup containerRef={containerRef} popupRef={popupRef}>
            <DatePickerCalendar />
          </DatePickerPopup>
        )}
      </DatePickerProvider>
    </div>
  );
}

// Popup component for calendar
function DatePickerPopup({ 
  children, 
  containerRef,
  popupRef: externalPopupRef 
}: { 
  children: ReactNode; 
  containerRef?: RefObject<HTMLDivElement>;
  popupRef?: RefObject<HTMLDivElement>;
}) {
  const internalPopupRef = useRef<HTMLDivElement>(null);
  const popupRef = externalPopupRef || internalPopupRef;
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  // Calculate position relative to container
  useEffect(() => {
    if (containerRef?.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      
      setPosition({
        top: containerRect.bottom + window.scrollY + 8,
        left: containerRect.left + window.scrollX,
      });
    }
  }, [containerRef]);

  if (!position) {
    return null; // Wait for position calculation
  }

  const popup = (
    <div
      ref={popupRef}
      className={`
        fixed z-50
        bg-white
        ${getRadiusClass('lg')}
        ${getShadowClass('xl')}
        border border-gray-200
      `}
      role="dialog"
      aria-modal="false"
      aria-label="Date picker calendar"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {children}
    </div>
  );

  // Portal rendering for better z-index handling
  if (typeof window !== 'undefined') {
    return createPortal(popup, document.body);
  }

  return popup;
}

// Compound components
DatePickerComponent.Input = DatePickerInput;
DatePickerComponent.Calendar = DatePickerCalendar;
DatePickerComponent.Popup = DatePickerPopup;

// Type declaration for compound components
export interface DatePickerComponentType extends React.FC<DatePickerProps> {
  Input: typeof DatePickerInput;
  Calendar: typeof DatePickerCalendar;
  Popup: typeof DatePickerPopup;
}

// Cast to include compound components and export as DatePicker
const DatePicker: DatePickerComponentType = DatePickerComponent as DatePickerComponentType;

export { DatePickerComponent };
export default DatePicker;
