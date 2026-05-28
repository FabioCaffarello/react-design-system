"use client";

import type { HTMLAttributes, ReactNode, KeyboardEvent } from "react";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils";
import {
  getColorClass,
  getRadiusClass,
  getFocusColorClass,
  getHoverColorClass,
  getSpacingClass,
  getTypographySize,
  getShadowClass,
} from "../../tokens";

export interface DropdownItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  variant?: "default" | "minimal";
  "aria-label"?: string;
}

/**
 * Dropdown Component
 *
 * A dropdown menu component for displaying actions and options.
 * Follows Atomic Design principles as a Molecule component.
 *
 * @example
 * ```tsx
 * <Dropdown
 *   trigger={<Button>Actions</Button>}
 *   items={[
 *     { label: "Edit", onClick: () => handleEdit() },
 *     { label: "Delete", onClick: () => handleDelete(), variant: "danger" },
 *   ]}
 * />
 * ```
 */
export default function Dropdown({
  trigger,
  items,
  align = "right",
  variant: _variant = "default",
  className = "",
  "aria-label": ariaLabel,
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Generate unique IDs
  const menuId = `dropdown-menu-${Math.random().toString(36).substr(2, 9)}`;
  const triggerId = `dropdown-trigger-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus first item when opening
      setTimeout(() => {
        const firstEnabledIndex = items.findIndex((item) => !item.disabled);
        if (firstEnabledIndex >= 0) {
          setActiveIndex(firstEnabledIndex);
          itemRefs.current[firstEnabledIndex]?.focus();
        }
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, items]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const enabledItems = items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !item.disabled);
      const currentEnabledIndex = enabledItems.findIndex(
        ({ index }) => index === activeIndex,
      );

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex =
            currentEnabledIndex < enabledItems.length - 1
              ? enabledItems[currentEnabledIndex + 1].index
              : enabledItems[0].index;
          setActiveIndex(nextIndex);
          itemRefs.current[nextIndex]?.focus();
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex =
            currentEnabledIndex > 0
              ? enabledItems[currentEnabledIndex - 1].index
              : enabledItems[enabledItems.length - 1].index;
          setActiveIndex(prevIndex);
          itemRefs.current[prevIndex]?.focus();
          break;
        }
        case "Home": {
          e.preventDefault();
          const firstIndex = enabledItems[0].index;
          setActiveIndex(firstIndex);
          itemRefs.current[firstIndex]?.focus();
          break;
        }
        case "End": {
          e.preventDefault();
          const lastIndex = enabledItems[enabledItems.length - 1].index;
          setActiveIndex(lastIndex);
          itemRefs.current[lastIndex]?.focus();
          break;
        }
        case "Enter":
        case " ":
          e.preventDefault();
          if (activeIndex >= 0 && !items[activeIndex].disabled) {
            handleItemClick(items[activeIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setActiveIndex(-1);
          // Restore focus to trigger after closing
          setTimeout(() => {
            triggerRef.current?.focus();
          }, 0);
          break;
      }
    };

    const menuElement = menuRef.current;
    if (menuElement) {
      const typedHandleKeyDown = handleKeyDown as unknown as (e: Event) => void;
      menuElement.addEventListener("keydown", typedHandleKeyDown);
      return () => {
        menuElement.removeEventListener("keydown", typedHandleKeyDown);
      };
    }
  }, [isOpen, activeIndex, items]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
      setActiveIndex(-1);
      // Restore focus to trigger after item selection
      setTimeout(() => {
        triggerRef.current?.focus();
      }, 0);
    }
  };

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
    setActiveIndex(-1);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const alignClasses = align === "right" ? "right-0" : "left-0";

  // Clone trigger to add accessibility props
  // Handle both Button component and native button elements
  const triggerWithProps = React.isValidElement(trigger) ? (
    React.cloneElement(trigger as React.ReactElement<unknown>, {
      onClick: (e: React.MouseEvent) => {
        handleTriggerClick();
        // Call original onClick if it exists
        if (trigger.props.onClick) {
          trigger.props.onClick(e);
        }
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        handleTriggerKeyDown(e);
        // Call original onKeyDown if it exists
        if (trigger.props.onKeyDown) {
          trigger.props.onKeyDown(e);
        }
      },
      "aria-haspopup": "menu",
      "aria-expanded": isOpen,
      "aria-controls": menuId,
      "aria-label": ariaLabel || trigger.props["aria-label"] || "Open menu",
      id: triggerId,
      ref: (node: HTMLElement | null) => {
        triggerRef.current = node;
        // Forward ref if trigger has one
        if (typeof trigger.ref === "function") {
          trigger.ref(node);
        } else if (trigger.ref) {
          (trigger.ref as React.MutableRefObject<HTMLElement | null>).current =
            node;
        }
      },
    })
  ) : (
    <div
      ref={triggerRef}
      onClick={handleTriggerClick}
      onKeyDown={handleTriggerKeyDown}
      role="button"
      tabIndex={0}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={menuId}
      aria-label={ariaLabel || "Open menu"}
      id={triggerId}
    >
      {trigger}
    </div>
  );

  return (
    <div
      className={cn("relative", "inline-block", className)}
      ref={dropdownRef}
      {...props}
    >
      {triggerWithProps}

      {isOpen && (
        <>
          <div
            // micro-z: dropdown click-outside backdrop internal to dropdown scope
            className={cn("fixed", "inset-0", "z-10")}
            onClick={() => {
              setIsOpen(false);
              setActiveIndex(-1);
            }}
            aria-hidden="true"
          />
          <div
            ref={menuRef}
            id={menuId}
            className={cn(
              "absolute",
              // micro-z: dropdown content above its own backdrop
              "z-20",
              getSpacingClass("sm", "mt"),
              "w-48", // Fixed width for dropdown menu - justified as layout constraint
              getRadiusClass("md"),
              getShadowClass("lg"),
              getColorClass("neutral", "light", "bg"),
              "ring-1",
              getColorClass("neutral", "dark", "border"),
              "ring-opacity-5",
              alignClasses,
            )}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby={triggerId}
            aria-activedescendant={
              activeIndex >= 0 ? `${menuId}-item-${activeIndex}` : undefined
            }
          >
            <div className={cn(getSpacingClass("xs", "py"))} role="none">
              {items.map((item, index) => {
                const itemClasses = cn(
                  "block",
                  getSpacingClass("base", "px"),
                  getSpacingClass("xs", "py"),
                  getTypographySize("bodySmall"),
                  "w-full",
                  "text-left",
                  "focus:outline-none",
                  item.disabled
                    ? cn(
                        getColorClass("neutral", "DEFAULT", "text"),
                        "cursor-not-allowed",
                        "opacity-50",
                      )
                    : item.variant === "danger"
                      ? cn(
                          "text-error-dark",
                          "hover:bg-error-bg-emphasis",
                          "focus:bg-error-bg-emphasis",
                        )
                      : cn(
                          getColorClass("neutral", "dark", "text"),
                          getHoverColorClass("neutral", "light", "bg"),
                          getFocusColorClass("neutral", "light", "bg").replace(
                            "focus:border-",
                            "focus:bg-",
                          ),
                        ),
                );

                return (
                  <button
                    key={index}
                    id={`${menuId}-item-${index}`}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    className={itemClasses}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    role="menuitem"
                    aria-disabled={item.disabled}
                    tabIndex={
                      item.disabled ? -1 : activeIndex === index ? 0 : -1
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
