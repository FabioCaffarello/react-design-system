"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { getSpacingClass } from "../../tokens/spacing";
import { getAnimationClass } from "../../tokens/animations";
import { getTypographyClasses } from "../../tokens/typography";
import { getRadiusClass } from "../../tokens/radius";

export type AccordionType = "single" | "multiple";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: AccordionType;
  defaultOpen?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
}

/**
 * Accordion Component
 *
 * A collapsible content component that can display multiple items.
 * Supports single and multiple selection modes.
 * Follows Atomic Design principles as an Atom component.
 *
 * @example
 * ```tsx
 * <Accordion
 *   type="single"
 *   items={[
 *     { id: '1', title: 'Item 1', content: 'Content 1' },
 *     { id: '2', title: 'Item 2', content: 'Content 2' },
 *   ]}
 * />
 * ```
 */
export default function Accordion({
  items,
  type = "single",
  defaultOpen,
  onValueChange,
  className = "",
}: AccordionProps) {
  const getInitialOpen = (): string[] => {
    if (defaultOpen === undefined) return [];
    return Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen];
  };

  const [openItems, setOpenItems] = useState<string[]>(getInitialOpen);

  const handleToggle = (itemId: string) => {
    if (items.find((item) => item.id === itemId)?.disabled) return;

    let newOpenItems: string[];

    if (type === "single") {
      newOpenItems = openItems.includes(itemId) ? [] : [itemId];
    } else {
      newOpenItems = openItems.includes(itemId)
        ? openItems.filter((id) => id !== itemId)
        : [...openItems, itemId];
    }

    setOpenItems(newOpenItems);
    onValueChange?.(type === "single" ? newOpenItems[0] || "" : newOpenItems);
  };

  return (
    <div className={`${getSpacingClass("xs", "space-y")} ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        const isDisabled = item.disabled;

        return (
          <div
            key={item.id}
            className={`border border-line-default ${getRadiusClass("md")} overflow-hidden`}
          >
            <button
              type="button"
              onClick={() => handleToggle(item.id)}
              disabled={isDisabled}
              className={`
                w-full
                flex
                items-center
                justify-between
                ${getSpacingClass("base", "px")}
                ${getSpacingClass("md", "py")}
                ${getTypographyClasses("label")}
                text-left
                text-fg-primary
                bg-surface-base
                hover:bg-surface-hover
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-line-focus
                ${getAnimationClass("base")}
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              aria-disabled={isDisabled}
            >
              <span>{item.title}</span>
              <ChevronDown
                className={`
                  ${getSpacingClass("sm", "ml")}
                  ${getAnimationClass("base")}
                  ${isOpen ? "transform rotate-180" : ""}
                  ${isDisabled ? "opacity-50" : ""}
                `}
                aria-hidden="true"
              />
            </button>
            <div
              id={`accordion-content-${item.id}`}
              className={`
                overflow-hidden
                ${getAnimationClass("base")}
                ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
              `}
              aria-hidden={!isOpen}
            >
              <div
                className={`
                ${getSpacingClass("base", "px")}
                ${getSpacingClass("md", "py")}
                text-fg-secondary
              `}
              >
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
