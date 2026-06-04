"use client";

import { forwardRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getRadiusClass } from "../../tokens/radius";
import { getShadowClass } from "../../tokens/shadows";
import { getZIndexClass } from "../../tokens/z-index";
import { getSpacingClass } from "../../tokens/spacing";
import AutocompleteOption from "./AutocompleteOption";
import type { AutocompleteOptionType } from "./AutocompleteOption";

export interface AutocompleteListProps {
  options: AutocompleteOptionType[];
  highlightedIndex: number;
  onSelect: (option: AutocompleteOptionType) => void;
  loading?: boolean;
  emptyMessage?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  showSelectAll?: boolean;
  allSelected?: boolean;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  /**
   * Accessible name for the listbox. axe `aria-input-field-name`
   * (serious) flags a `role="listbox"` portal without `aria-label` /
   * `aria-labelledby` / `title`. The Autocomplete / MultiSelect parent
   * cascades whatever accessible-name source the consumer provided
   * (label string, aria-label, or external id) so the listbox inherits
   * the same name as the input it dropdowns from.
   */
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * AutocompleteList Component
 *
 * The list container for autocomplete options.
 * Renders in a portal and positions itself below the input.
 */
const AutocompleteList = forwardRef<HTMLDivElement, AutocompleteListProps>(
  function AutocompleteList(
    {
      options,
      highlightedIndex,
      onSelect,
      loading = false,
      emptyMessage = "No options found",
      containerRef,
      showSelectAll = false,
      allSelected = false,
      onSelectAll,
      onDeselectAll,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    },
    ref,
  ) {
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    // Calculate position
    useEffect(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    }, [containerRef]);

    const listContent = (
      <div
        ref={ref}
        role="listbox"
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={`
          absolute
          ${getZIndexClass("popover")}
          bg-surface-overlay
          ${getRadiusClass("md")}
          ${getShadowClass("lg")}
          border
          border-line-default
          max-h-60
          overflow-y-auto
          ${getSpacingClass("xs", "py")}
        `}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
        }}
      >
        {loading ? (
          <div
            className={`
              ${getSpacingClass("md", "p")}
              text-sm
              text-fg-tertiary
              text-center
            `}
          >
            Loading...
          </div>
        ) : options.length === 0 ? (
          <div
            className={`
              ${getSpacingClass("md", "p")}
              text-sm
              text-fg-tertiary
              text-center
            `}
          >
            {emptyMessage}
          </div>
        ) : (
          <>
            {showSelectAll && (
              <div
                className={`
                  ${getSpacingClass("sm", "px")}
                  ${getSpacingClass("sm", "py")}
                  text-sm
                  font-medium
                  cursor-pointer
                  hover:bg-surface-hover
                  border-b
                  border-line-default
                `}
                onClick={allSelected ? onDeselectAll : onSelectAll}
              >
                {allSelected ? "Deselect All" : "Select All"}
              </div>
            )}
            {options.map((option, index) => (
              <AutocompleteOption
                key={option.value}
                option={option}
                isHighlighted={index === highlightedIndex}
                onSelect={onSelect}
              />
            ))}
          </>
        )}
      </div>
    );

    return typeof window !== "undefined"
      ? createPortal(listContent, document.body)
      : null;
  },
);

AutocompleteList.displayName = "AutocompleteList";

export default AutocompleteList;
