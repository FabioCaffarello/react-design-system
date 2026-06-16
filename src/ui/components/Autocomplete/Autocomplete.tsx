"use client";

import { useState, useRef, useEffect, useId, forwardRef } from "react";
import Input from "../../primitives/Input/Input";
import { mergeRefs } from "../../utils";
import { ChevronDown, Loader2 } from "lucide-react";
import AutocompleteList from "./AutocompleteList";
import type { AutocompleteOptionType } from "./AutocompleteOption";

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
  filterOptions?: (
    options: AutocompleteOptionType[],
    searchValue: string,
  ) => AutocompleteOptionType[];
  className?: string;
  inputClassName?: string;
  size?: "sm" | "md" | "lg";
  /**
   * Visible label rendered above the input via the `Input` primitive's
   * `label` API, which wires `<label htmlFor>` to the inner `<input>`.
   * Provides the accessible name axe `aria-input-field-name` requires.
   */
  label?: string;
  /**
   * Invisible accessible name. Use when the input has no visible label
   * (e.g. a tightly-packed toolbar combobox). One of `label`,
   * `aria-label`, or `aria-labelledby` MUST be present — without any,
   * the input has no programmatic name and axe `aria-input-field-name`
   * (serious) flags it. A dev-only warning fires when all are missing.
   */
  "aria-label"?: string;
  /**
   * Override path: point at an id the consumer manages externally.
   */
  "aria-labelledby"?: string;
  id?: string;
  /**
   * Name of the form field (issue #225). When set, the component renders
   * a synchronized `<input type="hidden" name={name}>` carrying the
   * **selected option value** (not the visible search text), so the
   * Autocomplete participates in native form submission exactly like a
   * `<select name>` — a `<form method="GET">` picks up `name=value` with
   * no `onChange`/router wiring on the consumer side. This is the
   * form-native integration the brasil-a-vera filter bars need.
   *
   * Caveat: the component is interactive (`"use client"`), so the hidden
   * field is populated once hydrated — it is NOT a pre-hydration no-JS
   * fallback. For a true zero-JS fallback, pair it with a `<noscript>`
   * native `<select name>`.
   */
  name?: string;
  /**
   * Associates the hidden field with a form by id (the native `form`
   * attribute), for when the Autocomplete renders outside the `<form>`
   * it submits to. No effect unless `name` is also set.
   */
  form?: string;
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
      placeholder = "Type to search...",
      loading = false,
      disabled = false,
      emptyMessage = "No options found",
      debounceMs = 300,
      filterOptions,
      className = "",
      inputClassName = "",
      size = "md",
      label,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      id: idProp,
      name,
      form,
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = idProp ?? autoId;
    const listboxId = `${inputId}-listbox`;
    const [internalValue, setInternalValue] = useState<string>(
      typeof defaultValue === "string" ? defaultValue : "",
    );
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [searchValue, setSearchValue] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        option.label.toLowerCase().includes(searchValue.toLowerCase()),
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
    const handleSelect = (option: AutocompleteOptionType) => {
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

    // Next/previous ENABLED option index, wrapping, skipping disabled
    // options (arrow nav previously landed on disabled options where
    // Enter then did nothing — a dead keypress).
    const moveHighlight = (prev: number, dir: 1 | -1): number => {
      const n = filteredOptions.length;
      if (n === 0) return -1;
      const start = prev < 0 ? (dir === 1 ? -1 : 0) : prev;
      for (let i = 1; i <= n; i++) {
        const idx = (((start + dir * i) % n) + n) % n;
        if (!filteredOptions[idx].disabled) return idx;
      }
      return prev;
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredOptions.length === 0) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => moveHighlight(prev, 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => moveHighlight(prev, -1));
          break;
        case "Enter":
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOptions.length
          ) {
            handleSelect(filteredOptions[highlightedIndex]);
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
        const target = e.target as Node;
        // The list is portalled to document.body, so it is NOT inside
        // containerRef — without the listRef check, a mousedown on an
        // option closed the list before its click fired, losing the
        // selection.
        if (
          containerRef.current &&
          !containerRef.current.contains(target) &&
          !listRef.current?.contains(target)
        ) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Clear any pending debounce timer on unmount (avoids a state update
    // on an unmounted component / a dangling timer).
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      };
    }, []);

    // Scroll highlighted item into view
    useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const items = listRef.current.querySelectorAll('[role="option"]');
        if (
          items[highlightedIndex] &&
          typeof items[highlightedIndex].scrollIntoView === "function"
        ) {
          items[highlightedIndex].scrollIntoView({
            block: "nearest",
            behavior: "smooth",
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
        setSearchValue("");
      }
    }, [currentValue, options]);

    // Dev-only accessible-name warning. Same four-path shape as the
    // Textarea 6c guard: label / aria-label / aria-labelledby / external
    // `<label htmlFor={id}>`. Without any source, axe
    // `aria-input-field-name` (serious) flags the input. Silent in
    // production.
    useEffect(() => {
      if (!import.meta.env.DEV) return;
      if (label || ariaLabel || ariaLabelledBy) return;
      const externalLabel =
        typeof document !== "undefined"
          ? document.querySelector(`label[for="${CSS.escape(inputId)}"]`)
          : null;
      if (externalLabel) return;
      console.warn(
        "[Autocomplete] Missing accessible name. Provide a `label` prop, `aria-label`, `aria-labelledby`, or pair an external `<label htmlFor={id}>` with the same `id`.",
      );
    }, [label, ariaLabel, ariaLabelledBy, inputId]);

    const shouldShowList =
      isOpen && (hasOptions || loading || Boolean(emptyMessage));
    const activeOptionId =
      shouldShowList &&
      highlightedIndex >= 0 &&
      highlightedIndex < filteredOptions.length
        ? `${listboxId}-option-${highlightedIndex}`
        : undefined;

    return (
      <div ref={containerRef} className={`relative ${className}`}>
        <Input
          ref={mergeRefs(inputRef, ref)}
          id={inputId}
          label={label}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          role="combobox"
          aria-expanded={shouldShowList}
          aria-controls={shouldShowList ? listboxId : undefined}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
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
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )
          }
          className={inputClassName}
        />

        {/*
          Form-native participation (issue #225). The hidden field carries
          the SELECTED OPTION VALUE (`currentValue`), not the visible
          `searchValue` label, so a native `<form>` submits `name=value`
          like a `<select name>`. Rendered only when `name` is set; `form`
          lets it associate with a form by id when rendered outside it.
        */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={currentValue ?? ""}
            form={form}
          />
        )}

        {shouldShowList && (
          <AutocompleteList
            ref={listRef}
            id={listboxId}
            options={filteredOptions}
            highlightedIndex={highlightedIndex}
            onSelect={handleSelect}
            loading={loading}
            emptyMessage={emptyMessage}
            containerRef={containerRef}
            // Cascade the same accessible-name source the consumer
            // provided for the input to the listbox portal — keeps
            // axe `aria-input-field-name` satisfied on the listbox
            // without making the consumer re-state the name.
            aria-labelledby={ariaLabelledBy}
            aria-label={ariaLabelledBy ? undefined : ariaLabel || label}
          />
        )}
      </div>
    );
  },
);

Autocomplete.displayName = "Autocomplete";

export default Autocomplete;
