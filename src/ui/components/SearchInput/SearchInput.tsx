"use client";

import { useState, forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";
import Input from "../../primitives/Input/Input";
import Button from "../../primitives/Button/Button";
import { cn } from "../../utils";
import { getSpacingClass } from "../../tokens";

export interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
  showClearButton?: boolean;
  debounceMs?: number;
}

/**
 * SearchInput Component
 *
 * A search input component with icon, clear button, and loading state.
 * Follows Atomic Design principles as a Molecule component.
 *
 * @example
 * ```tsx
 * <SearchInput
 *   placeholder="Search..."
 *   onSearch={(value) => console.log(value)}
 * />
 * ```
 */
const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      onSearch,
      onClear,
      loading = false,
      showClearButton = true,
      debounceMs = 300,
      value: controlledValue,
      defaultValue,
      onChange,
      className = "",
      ...props
    },
    ref,
  ) {
    const [internalValue, setInternalValue] = useState<string>(
      typeof defaultValue === "string" ? defaultValue : "",
    );
    const [debounceTimer, setDebounceTimer] = useState<ReturnType<
      typeof setTimeout
    > | null>(null);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;
    const hasValue =
      currentValue !== undefined &&
      currentValue !== null &&
      String(currentValue).length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onChange?.(e);

      // Debounce search
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        onSearch?.(newValue);
      }, debounceMs);

      setDebounceTimer(timer);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }

      // Create synthetic event for onChange
      const syntheticEvent = {
        target: { value: "" },
        currentTarget: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);

      onClear?.();
      onSearch?.("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(String(currentValue || ""));
      }
      props.onKeyDown?.(e);
    };

    return (
      <div className={cn("relative", className)}>
        <Input
          ref={ref}
          {...props}
          type="search"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          leftIcon={
            loading ? (
              <div className="animate-spin">
                <Search className="h-4 w-4" />
              </div>
            ) : (
              <Search className="h-4 w-4" />
            )
          }
          rightIcon={
            showClearButton && hasValue && !loading ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className={`h-auto ${getSpacingClass("xs", "p")}`}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : undefined
          }
          className={cn(getSpacingClass("lg", "pr"))}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
