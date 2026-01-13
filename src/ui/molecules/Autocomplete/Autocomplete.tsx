'use client';

import { useState, useRef, useEffect, forwardRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Input from '../../atoms/Input/Input';
import { getRadiusClass } from '../../tokens/radius';
import { getShadowClass } from '../../tokens/shadows';
import { getZIndexClass } from '../../tokens/z-index';
import { getSpacingClass } from '../../tokens/spacing';
import { ChevronDown, Loader2 } from 'lucide-react';
import AutocompleteOption from './AutocompleteOption';
import AutocompleteList from './AutocompleteList';
import type { AutocompleteOptionType } from './AutocompleteOption';

export type { AutocompleteOptionType as AutocompleteOption };

export interface AutocompleteProps {
  options: AutocompleteOptionType[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: AutocompleteOptionType) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  emptyMessage?: string;
  debounceMs?: number;
  filterOptions?: (options: AutocompleteOptionType[], searchValue: string) => AutocompleteOptionType[];
  className?: string;
  inputClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Autocomplete Component
 * 
 * An input component with autocomplete suggestions.
 * Supports keyboard navigation, loading states, and custom filtering.
 * 
 * @example
 * ```tsx
 * <Autocomplete
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' },
 *   ]}
 *   onSelect={(option) => console.log(option)}
 * />
 * ```
 */
const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  function Autocomplete(
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      onSelect,
      placeholder = 'Type to search...',
      loading = false,
      disabled = false,
      emptyMessage = 'No options found',
      debounceMs = 300,
      filterOptions,
      className = '',
      inputClassName = '',
      size = 'md',
    },
    ref
  ) {
    const [internalValue, setInternalValue] = useState<string>(
      typeof defaultValue === 'string' ? defaultValue : ''
    );
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [searchValue, setSearchValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    // Filter options
    const getFilteredOptions = (): AutocompleteOptionType[] => {
      if (!searchValue.trim()) {
        return options;
      }

      if (filterOptions) {
        return filterOptions(options, searchValue);
      }

      // Default filter: case-insensitive search in label
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      );
    };

    const filteredOptions = getFilteredOptions();
    const hasOptions = filteredOptions.length > 0;

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchValue(newValue);

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);

      // Debounce search
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setIsOpen(true);
        setHighlightedIndex(-1);
      }, debounceMs);
    };

    // Handle option select
    const handleSelect = (option: AutocompleteOption) => {
      if (option.disabled) return;

      if (!isControlled) {
        setInternalValue(option.value);
      }

      setSearchValue(option.label);
      setIsOpen(false);
      setHighlightedIndex(-1);
      onChange?.(option.value);
      onSelect?.(option);
      inputRef.current?.focus();
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredOptions.length === 0) {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
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
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Scroll highlighted item into view
    useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const items = listRef.current.querySelectorAll('[role="option"]');
        if (items[highlightedIndex]) {
          items[highlightedIndex].scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          });
        }
      }
    }, [highlightedIndex]);

    // Sync search value with current value
    useEffect(() => {
      if (currentValue) {
        const option = options.find((opt) => opt.value === currentValue);
        if (option) {
          setSearchValue(option.label);
        } else {
          setSearchValue(currentValue);
        }
      } else {
        setSearchValue('');
      }
    }, [currentValue, options]);

    const shouldShowList = isOpen && (hasOptions || loading || emptyMessage);

    return (
      <div ref={containerRef} className={`relative ${className}`}>
        <Input
          ref={inputRef || ref}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          rightIcon={
            loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            )
          }
          className={inputClassName}
        />

        {shouldShowList && (
          <AutocompleteList
            ref={listRef}
            options={filteredOptions}
            highlightedIndex={highlightedIndex}
            onSelect={handleSelect}
            loading={loading}
            emptyMessage={emptyMessage}
            containerRef={containerRef}
          />
        )}
      </div>
    );
  }
);

Autocomplete.displayName = 'Autocomplete';

export default Autocomplete;
