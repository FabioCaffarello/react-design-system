"use client";

import { forwardRef, type ReactNode } from "react";
import { getSpacingClass } from "../../tokens/spacing";

export interface AutocompleteOptionType {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
  group?: string;
}

export interface AutocompleteOptionProps {
  option: AutocompleteOptionType;
  isHighlighted: boolean;
  onSelect: (option: AutocompleteOptionType) => void;
}

/**
 * AutocompleteOption Component
 *
 * A single option in the autocomplete list.
 */
const AutocompleteOption = forwardRef<HTMLDivElement, AutocompleteOptionProps>(
  function AutocompleteOption({ option, isHighlighted, onSelect }, ref) {
    const handleClick = () => {
      if (!option.disabled) {
        onSelect(option);
      }
    };

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isHighlighted}
        aria-disabled={option.disabled}
        onClick={handleClick}
        className={`
          flex
          items-center
          gap-2
          ${getSpacingClass("sm", "px")}
          ${getSpacingClass("sm", "py")}
          text-sm
          cursor-pointer
          transition-colors
          ${isHighlighted ? "bg-surface-active" : ""}
          ${option.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-surface-hover"}
        `}
      >
        {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
        <span className="flex-1">{option.label}</span>
      </div>
    );
  },
);

AutocompleteOption.displayName = "AutocompleteOption";

export default AutocompleteOption;
