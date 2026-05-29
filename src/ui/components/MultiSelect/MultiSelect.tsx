"use client";

import { useState, useRef, useEffect, forwardRef } from "react";
import Chip from "../../primitives/Chip/Chip";
import { Check } from "lucide-react";
import AutocompleteList from "../Autocomplete/AutocompleteList";
import type { AutocompleteOptionType } from "../Autocomplete/AutocompleteOption";
import { cn } from "../../utils";
import { getSpacingClass } from "../../tokens";
import { getRadiusClass } from "../../tokens";

export interface MultiSelectProps {
  options: AutocompleteOptionType[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  onSelect?: (options: AutocompleteOptionType[]) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  emptyMessage?: string;
  maxSelected?: number;
  showSelectAll?: boolean;
  className?: string;
  inputClassName?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * MultiSelect Component
 *
 * A multi-select component with chips for selected items.
 * Supports keyboard navigation, loading states, and custom filtering.
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' },
 *   ]}
 *   onSelect={(options) => console.log(options)}
 * />
 * ```
 */
const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(
  function MultiSelect(
    {
      options,
      value: controlledValue,
      defaultValue = [],
      onChange,
      onSelect,
      placeholder = "Select options...",
      loading = false,
      disabled = false,
      emptyMessage = "No options found",
      maxSelected,
      showSelectAll = false,
      className = "",
      inputClassName = "",
      size = "md",
    },
    ref,
  ) {
    const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [searchValue, setSearchValue] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const isControlled = controlledValue !== undefined;
    const selectedValues = isControlled ? controlledValue : internalValue;

    // Get selected options
    const selectedOptions = options.filter((opt) =>
      selectedValues.includes(opt.value),
    );

    // Filter options (exclude already selected if needed, or show all)
    const getFilteredOptions = (): AutocompleteOptionType[] => {
      let filtered = options;

      if (searchValue.trim()) {
        filtered = options.filter((option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase()),
        );
      }

      return filtered;
    };

    const filteredOptions = getFilteredOptions();
    const hasOptions = filteredOptions.length > 0;

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchValue(newValue);
      setIsOpen(true);
      setHighlightedIndex(-1);
    };

    // Handle option toggle
    const handleToggleOption = (option: AutocompleteOptionType) => {
      if (option.disabled) return;
      if (
        maxSelected &&
        selectedValues.length >= maxSelected &&
        !selectedValues.includes(option.value)
      ) {
        return;
      }

      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value];

      if (!isControlled) {
        setInternalValue(newValues);
      }

      onChange?.(newValues);
      onSelect?.(options.filter((opt) => newValues.includes(opt.value)));
      setSearchValue("");
    };

    // Handle select all
    const handleSelectAll = () => {
      const allValues = filteredOptions
        .filter((opt) => !opt.disabled)
        .map((opt) => opt.value);
      const newValues = [...new Set([...selectedValues, ...allValues])];

      if (!isControlled) {
        setInternalValue(newValues);
      }

      onChange?.(newValues);
      onSelect?.(options.filter((opt) => newValues.includes(opt.value)));
    };

    // Handle deselect all
    const handleDeselectAll = () => {
      const filteredValues = filteredOptions.map((opt) => opt.value);
      const newValues = selectedValues.filter(
        (v) => !filteredValues.includes(v),
      );

      if (!isControlled) {
        setInternalValue(newValues);
      }

      onChange?.(newValues);
      onSelect?.(options.filter((opt) => newValues.includes(opt.value)));
    };

    // Handle remove chip
    const handleRemoveChip = (value: string) => {
      const newValues = selectedValues.filter((v) => v !== value);

      if (!isControlled) {
        setInternalValue(newValues);
      }

      onChange?.(newValues);
      onSelect?.(options.filter((opt) => newValues.includes(opt.value)));
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredOptions.length === 0) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          setIsOpen(true);
        }
        // Remove last chip on backspace
        if (
          e.key === "Backspace" &&
          searchValue === "" &&
          selectedValues.length > 0
        ) {
          handleRemoveChip(selectedValues[selectedValues.length - 1]);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOptions.length
          ) {
            handleToggleOption(filteredOptions[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    // Close on click outside
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
          setHighlightedIndex(-1);
          setSearchValue("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Check if all filtered options are selected
    const allSelected = filteredOptions
      .filter((opt) => !opt.disabled)
      .every((opt) => selectedValues.includes(opt.value));

    const shouldShowList = isOpen && (hasOptions || loading || emptyMessage);

    return (
      <div ref={containerRef} className={cn("relative", className)}>
        <div
          className={cn(
            "flex",
            "flex-wrap",
            getSpacingClass("sm", "gap"),
            getSpacingClass("sm", "p"),
            "border",
            "border-line-default",
            getRadiusClass("md"),
            "min-h-10",
            "focus-within:outline-none",
            "focus-within:ring-2",
            "focus-within:ring-offset-2",
            "focus-within:border-line-brand",
            "focus-within:ring-line-brand",
          )}
        >
          {selectedOptions.map((option) => (
            <Chip
              key={option.value}
              onRemove={() => handleRemoveChip(option.value)}
              size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
            >
              {option.label}
            </Chip>
          ))}
          <input
            ref={(node) => {
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                (
                  ref as React.MutableRefObject<HTMLInputElement | null>
                ).current = node;
              }
              inputRef.current = node;
            }}
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedValues.length === 0 ? placeholder : ""}
            disabled={disabled}
            className={cn(
              "flex-1",
              "min-w-32",
              "outline-none",
              "bg-transparent",
              inputClassName,
            )}
          />
        </div>

        {shouldShowList && (
          <AutocompleteList
            ref={listRef}
            options={filteredOptions.map((opt) => ({
              ...opt,
              icon: selectedValues.includes(opt.value) ? (
                <Check className={cn("h-4", "w-4", "text-fg-brand")} />
              ) : (
                opt.icon
              ),
            }))}
            highlightedIndex={highlightedIndex}
            onSelect={handleToggleOption}
            loading={loading}
            emptyMessage={emptyMessage}
            containerRef={containerRef}
            showSelectAll={showSelectAll && filteredOptions.length > 0}
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
        )}
      </div>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
